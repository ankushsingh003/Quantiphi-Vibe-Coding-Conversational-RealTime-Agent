from openai import AsyncOpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Tone → System Prompt mapping (The Vibe Check)
TONE_PROMPTS = {
    "professional": (
        "You are a formal, precise, and structured AI assistant. "
        "Use professional language, well-organized responses, and proper terminology. "
        "Avoid slang or overly casual expressions."
    ),
    "casual": (
        "You are a friendly, conversational, and relaxed AI assistant. "
        "Talk like a knowledgeable friend — keep it warm, approachable, and easy to understand. "
        "Feel free to use everyday language and a light tone."
    ),
    "concise": (
        "You are a concise, direct AI assistant. "
        "Keep every response as short and to-the-point as possible. "
        "No unnecessary explanations — just the key information."
    ),
}


async def stream_openai_response(messages: list, tone: str = "professional"):
    """
    Stream a response from OpenAI GPT-4o using the selected tone as system instruction.
    Yields text chunks one at a time for WebSocket streaming.
    """
    system_prompt = TONE_PROMPTS.get(tone, TONE_PROMPTS["professional"])

    formatted_messages = [{"role": "system", "content": system_prompt}] + messages

    stream = await client.chat.completions.create(
        model="gpt-4o",
        messages=formatted_messages,
        stream=True,
    )

    full_response = ""
    async for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            full_response += delta
            yield delta

    # After streaming completes, also yield the full response for persistence
    yield f"__DONE__:{full_response}"
