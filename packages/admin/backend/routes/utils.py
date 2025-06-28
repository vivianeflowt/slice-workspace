from fastapi import APIRouter
from lib.logger import logger

router = APIRouter()

@router.get("/ping")
def ping():
    logger.info("Ping recebido!")
    return {"status": "ok"}
