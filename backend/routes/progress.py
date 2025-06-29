from fastapi import APIRouter, HTTPException
from db.dbConnection import db
from db.dbConnection import db

collection = db["flashcards"]

router = APIRouter()
flashcards_collection = db["flashcards"]

@router.get("/badges/{user_id}")
def get_badges_for_user(user_id: str):
    from db.dbConnection import db
    flashcards_collection = db["flashcards"]

    # Cards für diesen User, die gelernt wurden
    flashcards = flashcards_collection.find({"user_id": user_id, "learned": True})
    learned_count = len(list(flashcards))  # ✅ funktioniert sicher

    badge_levels = [
        {"name": "🥇 Master", "threshold": 200},
        {"name": "🥈 Scholar", "threshold": 50},
        {"name": "🥉 Learner", "threshold": 10},
        {"name": "🔰 Beginner", "threshold": 5},
    ]

    earned_badges = [b["name"] for b in badge_levels if learned_count >= b["threshold"]]

    return {"total_learned": learned_count, "badges": earned_badges}


