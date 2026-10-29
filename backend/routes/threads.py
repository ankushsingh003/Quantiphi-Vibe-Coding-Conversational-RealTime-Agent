from fastapi import APIRouter, HTTPException
from services.mongo_service import get_all_threads, get_thread_by_id, delete_thread, update_thread_title
from services.openai_service import generate_title
from pydantic import BaseModel

router = APIRouter(prefix="/threads", tags=["Threads"])


class TitleRequest(BaseModel):
    first_message: str


@router.get("/")
async def list_threads():
    """Return all conversation threads sorted by latest activity."""
    threads = await get_all_threads()
    return {"threads": threads}


@router.get("/{thread_id}")
async def get_thread(thread_id: str):
    """Return a single thread with full message history."""
    thread = await get_thread_by_id(thread_id)
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    return thread


@router.post("/{thread_id}/generate-title")
async def auto_generate_title(thread_id: str, body: TitleRequest):
    """
    Auto-generate a smart thread title using OpenAI based on the first user message.
    Extra Feature 2: AI-powered thread title generation.
    """
    thread = await get_thread_by_id(thread_id)
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")

    title = await generate_title(body.first_message)
    await update_thread_title(thread_id, title)
    return {"thread_id": thread_id, "title": title}


@router.delete("/{thread_id}")
async def remove_thread(thread_id: str):
    """Delete a thread by ID."""
    deleted = await delete_thread(thread_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Thread not found")
    return {"message": "Thread deleted successfully"}

