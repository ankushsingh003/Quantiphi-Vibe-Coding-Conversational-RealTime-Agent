from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from datetime import datetime
import os

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "quantiphi_chat")

client = AsyncIOMotorClient(MONGODB_URI)
db = client[DATABASE_NAME]
threads_collection = db["threads"]


async def create_thread(thread_data: dict) -> dict:
    """Insert a new thread into MongoDB."""
    thread_data["created_at"] = datetime.utcnow()
    thread_data["updated_at"] = datetime.utcnow()
    await threads_collection.insert_one(thread_data)
    thread_data.pop("_id", None)
    return thread_data


async def get_all_threads() -> list:
    """Fetch all threads sorted by latest updated."""
    cursor = threads_collection.find({}, {"_id": 0}).sort("updated_at", -1)
    return await cursor.to_list(length=100)


async def get_thread_by_id(thread_id: str) -> dict | None:
    """Fetch a single thread by thread_id."""
    return await threads_collection.find_one({"thread_id": thread_id}, {"_id": 0})


async def append_message_to_thread(thread_id: str, user_msg: dict, ai_msg: dict):
    """Append both user and AI messages to an existing thread."""
    await threads_collection.update_one(
        {"thread_id": thread_id},
        {
            "$push": {"messages": {"$each": [user_msg, ai_msg]}},
            "$set": {"updated_at": datetime.utcnow()},
        },
    )


async def update_thread_title(thread_id: str, title: str):
    """Update thread title based on first user message."""
    await threads_collection.update_one(
        {"thread_id": thread_id},
        {"$set": {"title": title, "updated_at": datetime.utcnow()}},
    )


async def delete_thread(thread_id: str) -> bool:
    """Delete a thread by thread_id."""
    result = await threads_collection.delete_one({"thread_id": thread_id})
    return result.deleted_count > 0
