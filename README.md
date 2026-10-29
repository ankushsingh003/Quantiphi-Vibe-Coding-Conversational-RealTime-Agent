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
intelligent-chat/
├── frontend/               ← React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   └── MessageBubble.jsx
│   │   ├── hooks/
│   │   │   └── useWebSocket.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/                ← FastAPI + Python
│   ├── main.py
│   ├── routes/
│   │   └── threads.py
│   ├── services/
│   │   ├── openai_service.py
│   │   └── mongo_service.py
│   ├── models/
│   │   └── thread.py
│   └── requirements.txt
│
├── .env.example
└── README.md
```

---

## ⚙️ Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
```
OPENAI_API_KEY=your_openai_key
MONGODB_URI=your_mongodb_connection_string
```

---

## 🎛️ Tone Toggle (Vibe Check)

Select your preferred AI response style:
- 🏢 **Professional** — Formal, structured, precise
- 😎 **Casual** — Friendly, conversational, relaxed
- ⚡ **Concise** — Short, direct, no fluff

---

*Built during a 60-minute Vibe Coding Sprint 🔥*
