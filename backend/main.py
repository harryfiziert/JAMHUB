from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from routes.rooms import router as rooms_router
# from user.user import router as user_router
from routes.rooms import router as rooms_router
from routes.user import router as user_router
from routes.flashcards import router as flashcard_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routen registrieren
app.include_router(user_router)
app.include_router(rooms_router)
app.include_router(flashcard_router)


print("✅ main.py geladen")
