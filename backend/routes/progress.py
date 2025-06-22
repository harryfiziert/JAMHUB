from fastapi import APIRouter, HTTPException
from db.dbConnection import db

router = APIRouter()
flashcards_collection = db["flashcards"]

@router.get("/badges/{user_id}")
def get_user_badges(user_id: str):
    # Aggregation to compute total and learned flashcards per room
    pipeline = [
        {"$match": {"user_id": user_id}},
        {
            "$group": {
                "_id": "$room_id",
                "total": {"$sum": 1},
                "learned": {
                    "$sum": {
                        "$cond": [{"$eq": ["$learned", True]}, 1, 0]
                    }
                }
            }
        }
    ]

    result = list(flashcards_collection.aggregate(pipeline))
    total_learned = sum(entry["learned"] for entry in result)

    # 🏅 Badge levels with thresholds
    badge_levels = [
        {"name": "🥇 Master", "threshold": 200},
        {"name": "🥈 Scholar", "threshold": 100},
        {"name": "🥉 Learner", "threshold": 50},
        {"name": "🔰 Beginner", "threshold": 10},
    ]

    # 🧠 Assign the highest badge unlocked
    badges = [badge["name"] for badge in badge_levels if total_learned >= badge["threshold"]]

    return {
        "user_id": user_id,
        "total_learned": total_learned,
        "badges": badges
    }
@router.get("/progress/{user_id}/{room_id}")
def get_progress_for_room(user_id: str, room_id: str):
    cards = list(flashcards_collection.find({
        "user_id": user_id,
        "room_id": room_id
    }))

    total = len(cards)
    learned = sum(1 for card in cards if card.get("learned") == True)

    return {
        "room_id": room_id,
        "user_id": user_id,
        "total_cards": total,
        "learned_cards": learned,
        "percent": round((learned / total) * 100) if total > 0 else 0
    }



# 🔧 Optional: Return full badge structure
# return {
#     "user_id": user_id,
#     "total_learned": total_learned,
#     "badges_unlocked": badges,
#     "all_badges": badge_levels
# }
