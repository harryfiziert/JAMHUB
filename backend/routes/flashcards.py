from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional, List
from dotenv import load_dotenv
from fastapi.responses import JSONResponse
from db.dbConnection import db
from bson import ObjectId
import os
from openai import OpenAI
import fitz
import json
import random
from fastapi import Form
from bson.json_util import dumps
from pydantic import BaseModel, Extra
from datetime import datetime, timezone
router = APIRouter()
load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)
collection = db["flashcards"]
comments = db["comments"]
user_collection = db["users"]

# ─────────────── MODELS ───────────────

class FlashcardInput(BaseModel):
    text: str
    room_id: Optional[str] = None


class FlashcardUpdate(BaseModel):
    question: Optional[str]
    answer: Optional[str]
    learned: Optional[bool]
    class Config:
        extra = Extra.allow


class CommentInput(BaseModel):
    flashcard_id: str
    user_id: str
    content: str


# ─────────────── FLASHCARDS ───────────────
def serialize_flashcard(card):
    card["_id"] = str(card["_id"])
    return card


@router.post("/flashcards/from-pdf")
async def generate_flashcards_from_pdf(file: UploadFile = File(...), user_id: str = Form(...),
                                       room_id: str = Form(...)):
    try:
        pdf_bytes = await file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        full_text = "\n".join([page.get_text() for page in doc])
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"PDF konnte nicht gelesen werden: {e}")

    chunks = [para.strip() for para in full_text.split("\n\n") if len(para.strip()) > 100]
    created = []

    # Raum laden
    room = db["rooms"].find_one({"id": room_id})
    if not room:
        print(f"Raum mit ID '{room_id}' nicht gefunden.")
        raise HTTPException(status_code=404, detail="Raum nicht gefunden")

    is_creator = room.get("creator_id") == user_id
    user_list = room.get("user", [])

    print(f"Raum gefunden: {room_id}")
    print(f"Hochladender User: {user_id}")
    print(f"Ist Ersteller? {is_creator}")
    print(f"Nutzer im Raum: {user_list}")

    for chunk in chunks:
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "Erstelle aus dem folgenden Text eine Liste von Lernkarten. "
                            "Jede Karte hat ein 'question'- und ein 'answer'-Feld. "
                            "Gib ausschließlich ein JSON-Array zurück. "
                            "Kein Einleitungstext, keine Erklärung – nur das JSON. "
                            "Beispiel: [{\"question\": \"...\", \"answer\": \"...\"}]"
                        )
                    },
                    {
                        "role": "user",
                        "content": chunk
                    }
                ]
            )
            raw = response.choices[0].message.content.strip()
            cards = json.loads(raw)

            for card in cards:
                base_card = {
                    "question": card["question"],
                    "answer": card["answer"],
                    "room_id": room_id,
                    "learned": False,
                    "learned_at": None,
                    "difficulty": {}
                }

                # Karte für Ersteller speichern
                creator_card = base_card.copy()
                creator_card["user_id"] = user_id
                result = collection.insert_one(creator_card)
                creator_card["_id"] = str(result.inserted_id)
                created.append(creator_card)
                print(f"Karte erstellt für Ersteller {user_id}: {creator_card['_id']}")

                # Wenn Ersteller → verteile Karte an andere
                if is_creator:
                    for uid in user_list:
                        if uid != user_id:
                            copied = base_card.copy()
                            copied["user_id"] = uid
                            copied["_id"] = ObjectId()
                            copied["original_id"] = str(result.inserted_id)
                            collection.insert_one(copied)
                            print(f"Karte verteilt an User {uid} (Kopie von {creator_card['_id']})")

        except Exception as e:
            print("GPT-Fehler:", e)
            # BREAK und Dummy-Karten erzeugen
            created = [
                {
                    "question": "Was ist ein Betriebssystem?",
                    "answer": "Ein Betriebssystem verwaltet Hardware und Software und stellt Schnittstellen für Anwendungen bereit.",
                    "user_id": user_id,
                    "room_id": room_id,
                    "learned": False,
                    "learned_at": None,
                    "difficulty": {}
                },
                {
                    "question": "Was versteht man unter einer IP-Adresse?",
                    "answer": "Eine IP-Adresse identifiziert ein Gerät eindeutig in einem Netzwerk.",
                    "user_id": user_id,
                    "room_id": room_id,
                    "learned": False,
                    "learned_at": None,
                    "difficulty": {}
                },
                {
                    "question": "Nenne drei Grundbegriffe der Objektorientierung.",
                    "answer": "Klasse, Objekt, Vererbung",
                    "user_id": user_id,
                    "room_id": room_id,
                    "learned": False,
                    "learned_at": None,
                    "difficulty": {}
                }
            ]
            print("Dummy-Karten eingefügt.")
            for card in created:
                result = collection.insert_one(card)
                card["_id"] = str(result.inserted_id)

                # Dummy-Karten auch verteilen
                if is_creator:
                    for uid in user_list:
                        if uid != user_id:
                            copied = card.copy()
                            copied["_id"] = ObjectId()
                            copied["user_id"] = uid
                            copied["original_id"] = card["_id"]
                            collection.insert_one(copied)
                            print(f"Dummy-Karte verteilt an User {uid} (Kopie von {card['_id']})")

    return {"message": "PDF verarbeitet", "cards": created}


@router.get("/flashcard/{id}")
def get_flashcard(id: str):
    card = collection.find_one({"_id": ObjectId(id)})
    if not card:
        raise HTTPException(status_code=404, detail="Flashcard nicht gefunden")
    card["_id"] = str(card["_id"])
    return card


@router.put("/flashcard/{id}")
def update_flashcard(id: str, data: dict):
    result = collection.update_one({"_id": ObjectId(id)}, {"$set": data})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Flashcard not found or unchanged")
    return {"message": "Flashcard updated"}



@router.delete("/flashcard/{id}")
def delete_flashcard(id: str):
    result = collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Flashcard nicht gefunden")
    return {"message": "Flashcard gelöscht"}


@router.get("/flashcards/by-user/{user_id}")
def get_flashcards_by_user(user_id: str):
    cards = list(collection.find({"user_id": user_id}))
    for card in cards:
        card["_id"] = str(card["_id"])
    return cards


@router.get("/flashcards/by-room/{room_id}")
def get_flashcards_by_room(room_id: str):
    cards = list(collection.find({"room_id": room_id}))
    for card in cards:
        card["_id"] = str(card["_id"])
    return cards


@router.get("/flashcards/by-room-and-user/{room_id}/{user_id}")
def get_flashcards_by_room_and_user(room_id: str, user_id: str):
    flashcards = collection.find({"room_id": room_id, "user_id": user_id})
    return [serialize_flashcard(card) for card in flashcards]


@router.get("/flashcards/progress/{user_id}")
def get_progress_by_user(user_id: str):
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
        },
        {
            "$project": {
                "room_id": "$_id",
                "total": 1,
                "learned": 1,
                "progress": {
                    "$cond": [
                        {"$eq": ["$total", 0]},
                        0,
                        {"$divide": ["$learned", "$total"]}
                    ]
                }
            }
        }
    ]
    return list(collection.aggregate(pipeline))


@router.patch("/flashcards/{flashcard_id}/mark-learned")
async def mark_card_as_learned(flashcard_id: str):
    result = collection.update_one(
        {"_id": ObjectId(flashcard_id)},
        {"$set": {"learned": True}}
    )
    if result.modified_count == 1:
        return {"message": "Marked as learned"}
    raise HTTPException(status_code=404, detail="Card not found")


@router.get("/flashcards/to-learn/{user_id}/{room_id}")
def get_flashcards_to_learn(user_id: str, room_id: str):
    cards = list(collection.find({
        "user_id": user_id,
        "room_id": room_id,
        "learned": False
    }))
    return JSONResponse(content=json.loads(dumps(cards)))

@router.post("/flashcards/{flashcard_id}/rate_difficulty")
def rate_flashcard_difficulty(flashcard_id: str, payload: dict):
    user_id = payload.get("user_id")
    score = payload.get("score")

    if user_id is None or score is None:
        raise HTTPException(status_code=400, detail="user_id and score are required")

    if not (0 <= score <= 3):
        raise HTTPException(status_code=400, detail="score must be between 0 and 3")

    update = {
        f"difficulty.{user_id}": score
    }

    if score == 0:
        update["learned"] = True

        update["learned_at"] = datetime.now(timezone.utc)


    result = collection.update_one(
        {"_id": ObjectId(flashcard_id)},
        {"$set": update}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Flashcard not found")

    return {"status": "ok", "updated": result.modified_count}

@router.post("/flashcards/reset-progress/{room_id}/{user_id}")
def reset_progress(room_id: str, user_id: str):
    result = collection.update_many(
        {"room_id": room_id, "user_id": user_id},
        {"$set": {
            "learned": False,
            "learned_at": None,
            "difficulty": {}
        }}
    )
    return {"message": "Fortschritt zurückgesetzt", "modified": result.modified_count}


# ─────────────── 🆕 Exam Simulation Endpoint ───────────────

@router.get("/exam-simulation/{user_id}")
def simulate_exam(user_id: str, limit: int = 5, room_id: Optional[str] = None):
    print("📥 Exam-Simulation: user_id =", user_id)
    print("📥 room_id =", room_id)
    query = {"user_id": user_id}
    if room_id:
        query["room_id"] = room_id
    print("📤 MongoDB Query:", query)

    cards = list(collection.find(query))
    random.shuffle(cards)
    exam_cards = cards[:limit]

    for card in exam_cards:
        card["_id"] = str(card["_id"])
        card.pop("learned", None)

    return exam_cards


# ─────────────── COMMENTS ───────────────

@router.post("/comments")
def add_comment(comment: CommentInput):
    if not collection.find_one({"_id": ObjectId(comment.flashcard_id)}):
        raise HTTPException(status_code=404, detail="Flashcard not found")

    result = comments.insert_one({
        "flashcard_id": comment.flashcard_id,
        "user_id": comment.user_id,
        "content": comment.content,
        "created_at": datetime.utcnow()
    })
    return {"message": "Comment added", "id": str(result.inserted_id)}


@router.get("/comments/{flashcard_id}")
def get_comments(flashcard_id: str):
    comment_list = list(comments.find({"flashcard_id": flashcard_id}))
    for c in comment_list:
        user = db["users"].find_one({"_id": ObjectId(c["user_id"])})
        c["username"] = user["username"] if user and "username" in user else c["user_id"]
        c["_id"] = str(c["_id"])
    return comment_list


@router.delete("/comments/{comment_id}")
def delete_comment(comment_id: str, user_id: str):
    comment = comments.find_one({"_id": ObjectId(comment_id)})
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    flashcard = collection.find_one({"_id": ObjectId(comment["flashcard_id"])})
    if not flashcard:
        raise HTTPException(status_code=404, detail="Flashcard not found")

    room = db["rooms"].find_one({"id": flashcard["room_id"]})
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    is_owner = (comment["user_id"] == user_id) or (room.get("creator_id") == user_id)
    if not is_owner:
        raise HTTPException(status_code=403, detail="Not authorized to delete comment")

    result = comments.delete_one({"_id": ObjectId(comment_id)})
    return {"message": "Comment deleted"}


# ─────────────── leaderboard + graphics ───────────────

@router.get("/leaderboard/{room_id}")
def get_leaderboard(room_id: str):
    cards = list(collection.find({"room_id": room_id}))
    user_stats = {}

    for card in cards:
        uid = card["user_id"]
        if uid not in user_stats:
            user_stats[uid] = 0
        if card.get("learned") is True:
            user_stats[uid] += 1

    leaderboard = []
    for uid, count in user_stats.items():
        username = "Unbekannt"
        try:
            if ObjectId.is_valid(uid):
                user = user_collection.find_one({"_id": ObjectId(uid)})
            else:
                print(f"Ungültige ObjectId (übersprungen): {uid}")
                user = None

            if user and "username" in user:
                username = user["username"]
                print(username)
        except Exception as e:
            print(f"Fehler beim Laden von User {uid}: {e}")

        leaderboard.append({
            "user_id": uid,
            "username": username,
            "learned_count": count
        })

    leaderboard.sort(key=lambda x: x["learned_count"], reverse=True)
    return leaderboard[:10]


@router.get("/learning-stats/{user_id}")
def get_learning_stats(user_id: str):
    from datetime import datetime, timedelta

    today = datetime.utcnow().date()
    start_date = today - timedelta(days=13)

    # Alle Karten des Users mit learned_at
    cards = collection.find({
        "user_id": user_id,
        "learned_at": {"$exists": True}
    })

    # Zählen nach Datum
    count_by_day = {}
    for card in cards:
        try:
            date = card["learned_at"].date()
            count_by_day[date] = count_by_day.get(date, 0) + 1
        except Exception:
            continue

    # Alle letzten 14 Tage einbauen
    stats = []
    for i in range(14):
        day = start_date + timedelta(days=i)
        stats.append({
            "date": day.strftime("%Y-%m-%d"),
            "count": count_by_day.get(day, 0)
        })
    return stats

