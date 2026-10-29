# 🤖 Quantiphi — Real-Time Conversational AI Agent

> An intelligent chat interface with real-time streaming capabilities, tone control, and persistent conversation history.

---

## 🚀 Features

- 💬 **Chat Interface** — Scrollable conversational view with distinct User & AI bubbles
- ⚡ **Real-Time Streaming** — Character-by-character response via WebSockets
- 🗂️ **History Sidebar** — Browse and resume past conversation threads
- 🎛️ **Tone Toggle** — Switch between Professional, Casual, or Concise AI response styles
- 🧠 **OpenAI GPT-4o** — Powered by the latest OpenAI model
- 🍃 **MongoDB** — Persistent storage for all conversations

---

## 🏗️ Tech Stack

| Layer      | Technology         |
|------------|--------------------|
| Frontend   | React + Vite       |
| Backend    | Python + FastAPI   |
| Streaming  | WebSockets         |
| AI Model   | OpenAI GPT-4o      |
| Database   | MongoDB            |

---

## 📁 Project Structure

```
Quantiphi/
├── frontend/                        <- React + Vite
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx                 <- React entry point
│       ├── App.jsx                  <- Root component + state
│       ├── App.css
│       ├── index.css                <- Global design system
│       ├── components/
│       │   ├── Sidebar.jsx          <- History + Tone Toggle
│       │   ├── Sidebar.css
│       │   ├── ChatWindow.jsx       <- Chat bubbles + input
│       │   ├── ChatWindow.css
│       │   ├── MessageBubble.jsx    <- User/AI bubble
│       │   └── MessageBubble.css
│       └── hooks/
│           ├── useWebSocket.js      <- WS connection + events
│           └── useAutoScroll.js     <- Auto-scroll to bottom
│
├── backend/                         <- FastAPI + Python
│   ├── main.py                      <- App entry + WS endpoint
│   ├── requirements.txt
│   ├── models/
│   │   └── thread.py                <- Pydantic models
│   ├── routes/
│   │   └── threads.py               <- REST CRUD endpoints
│   └── services/
│       ├── openai_service.py        <- GPT-4o streaming + Tone
│       └── mongo_service.py         <- MongoDB async operations
│
├── .env.example
└── README.md
```

---

## ⚙️ Setup

### 1. Clone the repo
```bash
git clone https://github.com/ankushsingh003/Quantiphi-Vibe-Coding-Conversational-RealTime-Agent.git
cd Quantiphi-Vibe-Coding-Conversational-RealTime-Agent
```

### 2. Configure environment
```bash
cp .env.example .env
# Fill in your OPENAI_API_KEY and MONGODB_URI in .env
```

### 3. Run Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# Runs on http://localhost:8000
```

### 4. Run Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 🎛️ Tone Toggle (Vibe Check)

Select your preferred AI response style from the sidebar:
- 🏢 **Professional** — Formal, structured, precise
- 😎 **Casual** — Friendly, conversational, relaxed
- ⚡ **Concise** — Short, direct, no fluff

The selected tone is injected as a **system instruction** into every OpenAI API call — changing the AI's response style instantly.

---

## 🔌 WebSocket Protocol

```
Client -> Server:  { "message": "...", "tone": "casual", "thread_id": "..." }
Server -> Client:  { "type": "thread_id", "thread_id": "..." }
                   { "type": "chunk",     "content": "..." }   <- streaming
                   { "type": "done",      "content": "..." }   <- full response
                   { "type": "error",     "content": "..." }
```

---

## ✨ Two Extra Features (Beyond Requirements)

### 📋 Feature 1 — Copy-to-Clipboard Button
Every AI response bubble includes a **Copy** button that:
- Copies the full AI response text to clipboard with one click
- Shows a green ✅ **"Copied!"** confirmation for 2 seconds
- Only visible after streaming is fully complete

### 🏷️ Feature 2 — Auto Thread Title Generation
When a new conversation thread is started:
- The **first user message** is sent to `POST /threads/{id}/generate-title`
- GPT-4o generates a **3–6 word descriptive title** for the thread
- The sidebar **instantly updates** with the smart title
- Replaces the generic default with something meaningful like *"Explain Quantum Computing Simply"*

---

*Built during a 60-minute Vibe Coding Sprint 🔥*
