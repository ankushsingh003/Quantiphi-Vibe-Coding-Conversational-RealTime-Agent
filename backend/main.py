from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from routes.threads import router as threads_router
from services.mongo_service import (
    create_thread,
    get_thread_by_id,
    append_message_to_thread,
)
from services.openai_service import stream_openai_response
from datetime import datetime
import json
import uuid

app = FastAPI(title="Quantiphi Real-Time Chat API", version="1.0.0")

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REST routes
app.include_router(threads_router)


@app.get("/")
async def root():
    return {"status": "Quantiphi API is running 🚀"}


@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    """
    WebSocket endpoint for real-time AI chat with streaming.

    Expected incoming JSON:
    {
        "thread_id": "optional-existing-id",
        "message": "user message text",
        "tone": "professional | casual | concise"
    }

    Response protocol:
    - {"type": "thread_id", "thread_id": "..."}   → sent once at session start
    - {"type": "chunk", "content": "..."}          → streamed tokens
    - {"type": "done", "content": "full response"} → signals completion
    - {"type": "error", "content": "..."}          → on failure
    """
    await websocket.accept()

    try:
        while True:
            # Receive message from frontend
            raw = await websocket.receive_text()
            data = json.loads(raw)

            user_message = data.get("message", "").strip()
            tone = data.get("tone", "professional")
            thread_id = data.get("thread_id")

            if not user_message:
                await websocket.send_json({"type": "error", "content": "Empty message"})
                continue

            # --- Thread Management ---
            if thread_id:
                thread = await get_thread_by_id(thread_id)
                if not thread:
                    thread_id = None  # fallback to new thread

            if not thread_id:
                # Create a new thread
                thread_id = str(uuid.uuid4())
                title = user_message[:50]  # first 50 chars as title
                new_thread = {
                    "thread_id": thread_id,
                    "title": title,
                    "tone": tone,
                    "messages": [],
                }
                await create_thread(new_thread)
                # Notify frontend of new thread_id
                await websocket.send_json({"type": "thread_id", "thread_id": thread_id})

            # Build message history for OpenAI context
            existing_thread = await get_thread_by_id(thread_id)
            history = [
                {"role": msg["role"], "content": msg["content"]}
                for msg in (existing_thread.get("messages", []) if existing_thread else [])
            ]
            history.append({"role": "user", "content": user_message})

            # --- Stream OpenAI Response ---
            full_ai_response = ""
            async for chunk in stream_openai_response(history, tone=tone):
                if chunk.startswith("__DONE__:"):
                    full_ai_response = chunk[len("__DONE__:"):]
                    break
                # Send each streaming token to frontend
                await websocket.send_json({"type": "chunk", "content": chunk})

            # Signal streaming complete
            await websocket.send_json({"type": "done", "content": full_ai_response})

            # --- Persist to MongoDB ---
            user_msg = {
                "role": "user",
                "content": user_message,
                "timestamp": datetime.utcnow().isoformat(),
            }
            ai_msg = {
                "role": "assistant",
                "content": full_ai_response,
                "timestamp": datetime.utcnow().isoformat(),
            }
            await append_message_to_thread(thread_id, user_msg, ai_msg)

    except WebSocketDisconnect:
        print(f"Client disconnected")
    except Exception as e:
        await websocket.send_json({"type": "error", "content": str(e)})
