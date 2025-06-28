from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
import json
from lib.logger import logger

router = APIRouter()

class ChatMessage(BaseModel):
    text: str

@router.post("/send_chat")
async def send_chat(msg: ChatMessage):
    os.makedirs("../data", exist_ok=True)
    with open("../data/last_chat_message.json", "w") as f:
        json.dump({"text": msg.text}, f)
    logger.info(f"Mensagem recebida: {msg.text}")
    return JSONResponse(content={"status": "received", "text": msg.text}, status_code=status.HTTP_202_ACCEPTED)

@router.post("/send_to_chat")
async def send_to_chat(msg: ChatMessage):
    from tools.send_to_chat import send_text_to_chat
    result = send_text_to_chat(msg.text)
    logger.info(f"Texto enviado ao chat: {msg.text}")
    return JSONResponse(content=result, status_code=status.HTTP_202_ACCEPTED)
