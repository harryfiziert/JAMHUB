from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_utils.tasks import repeat_every

from routes.rooms import router as rooms_router
from routes.user import router as user_router
from routes.flashcards import router as flashcard_router
from routes.progress import router as progress_router

from reminder.reminder import send_reminders


app = FastAPI()

origins = [
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:5173",  # Alternate localhost
]

app.add_middleware(
    CORSMiddleware,
    # allow_origins=origins,  # DON'T use ["*"] with allow_credentials=True
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test-reminder")
def test_reminder():
    send_reminders()
    return {"status": "Reminder sent"}

# Register routes
app.include_router(user_router)
app.include_router(rooms_router)
app.include_router(flashcard_router)
app.include_router(progress_router)

print("✅ main.py geladen")
@app.on_event("startup")
@repeat_every(seconds=3000)
def schedule_reminders():
    print("test")
    send_reminders()
    return {"status": "Reminder sent"}