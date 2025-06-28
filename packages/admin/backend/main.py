from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chat import router as chat_router
from routes.utils import router as utils_router
from routes import tasks

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(utils_router)
app.include_router(tasks.router)

# Placeholder para integração PyQt5
# Endpoint futuro: /mark_chat_position
