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


@router.get("/progress/{user_id}/{room_id}")
def get_progress(user_id: str, room_id: str):
    total_cards = flashcards_collection.count_documents({"user_id": user_id, "room_id": room_id})
    learned_cards = flashcards_collection.count_documents({
        "user_id": user_id,
        "room_id": room_id,
        "learned": True
    })

    if total_cards == 0:
        return {"progress": 0, "learned": 0, "total": 0}

    progress = (learned_cards / total_cards) * 100
    return {
        "percent": round(progress, 2),
        "learned_cards": learned_cards,
        "total_cards": total_cards
    }

