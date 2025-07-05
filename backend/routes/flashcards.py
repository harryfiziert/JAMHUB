from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional, List
from dotenv import load_dotenv
from bson import ObjectId
from starlette.responses import JSONResponse

from db.dbConnection import db
import os
from openai import OpenAI
import fitz  # PyMuPDF
import json
from datetime import datetime
import random
from fastapi import Form
from bson.json_util import dumps
from pydantic import BaseModel, Extra



router = APIRouter()
load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)
collection = db["flashcards"]
comments = db["comments"]


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
    card["_id"] = str(card["_id"])  # aus ObjectId → String
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
                card["user_id"] = user_id
                card["room_id"] = room_id
                card["learned"] = False
                card["difficulty"] = {}
                result = collection.insert_one(card)
                card["_id"] = str(result.inserted_id)
                created.append(card)
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
                    "difficulty": {}
                },
                {
                    "question": "Was versteht man unter einer IP-Adresse?",
                    "answer": "Eine IP-Adresse identifiziert ein Gerät eindeutig in einem Netzwerk.",
                    "user_id": user_id,
                    "room_id": room_id,
                    "learned": False,
                    "difficulty": {}
                },
                {
                    "question": "Nenne drei Grundbegriffe der Objektorientierung.",
                    "answer": "Klasse, Objekt, Vererbung",
                    "user_id": user_id,
                    "room_id": room_id,
                    "learned": False,
                    "difficulty": {}
                }
            ]
            for card in created:
                result = collection.insert_one(card)
                card["_id"] = str(result.inserted_id)
            break

    return {"message": "PDF verarbeitet", "cards": created, "errors": [c for c in created if "error" in c]}


@router.get("/flashcards")
def get_all_flashcards():
    cards = list(collection.find())
    for card in cards:
        card["_id"] = str(card["_id"])
    return cards


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


# @router.get("/flashcards/by-room-and-user/{room_id}/{user_id}")
# async def get_flashcards_by_room_and_user(room_id: str, user_id: str):
#     flashcards = list(collection.find({"room_id": room_id, "user_id": user_id}))
#     return json.loads(dumps(flashcards))
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

    result = collection.update_one(
        {"_id": ObjectId(flashcard_id)},
        {"$set": update}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Flashcard not found")

    return {"status": "ok", "updated": result.modified_count}


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
    result = list(comments.find({"flashcard_id": flashcard_id}).sort("created_at", -1))
    for r in result:
        r["_id"] = str(r["_id"])
    return result


@router.delete("/comments/{comment_id}")
def delete_comment(comment_id: str):
    result = comments.delete_one({"_id": ObjectId(comment_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Comment not found")
    return {"message": "Comment deleted"}
