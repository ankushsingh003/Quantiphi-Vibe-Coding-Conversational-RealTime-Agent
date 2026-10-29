from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# class handles the  user level subarchitechture
class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# class handles the threads level subarchitechture
class Thread(BaseModel):
    thread_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str = "New Conversation"
    tone: str = "professional"  # professional | casual | concise
    messages: List[Message] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ChatRequest(BaseModel):
    thread_id: Optional[str] = None
    message: str
    tone: str = "professional"  # professional | casual | concise
