from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional, List
from dotenv import load_dotenv
from bson import ObjectId
from db.dbConnection import db
import os
from openai import OpenAI
import fitz  # PyMuPDF
import json
from datetime import datetime
import random
from fastapi import Form

router = APIRouter()
load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)
collection = db["flashcards"]
comments = db["comments"]

# ─────────────── MODELS ───────────────

class FlashcardInput(BaseModel):
    text: str
    user_id: Optional[str] = None
    room_id: Optional[str] = None

class FlashcardUpdate(BaseModel):
    question: Optional[str]
    answer: Optional[str]
    learned: Optional[bool]

class CommentInput(BaseModel):
    flashcard_id: str
    user_id: str
    content: str

# ─────────────── FLASHCARDS ───────────────

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
                result = collection.insert_one(card)
                card["_id"] = str(result.inserted_id)
                created.append(card)
        except Exception as e:
            created.append({"error": f"Fehler bei Chunk: {chunk[:50]}...", "detail": str(e)})

    return {"message": f"{len(cards)} Karten erfolgreich erstellt", "cards": cards}


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
def update_flashcard(id: str, update: FlashcardUpdate):
    update_data = {k: v for k, v in update.dict().items() if v is not None}
    result = collection.update_one({"_id": ObjectId(id)}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Flashcard nicht gefunden")
    return {"message": "Flashcard aktualisiert"}

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

# ─────────────── 🆕 Exam Simulation Endpoint ───────────────

@router.get("/exam-simulation/{user_id}")
def simulate_exam(user_id: str, limit: int = 5, room_id: Optional[str] = None):
    query = {"user_id": user_id}
    if room_id:
        query["room_id"] = room_id

    cards = list(collection.find(query))
    random.shuffle(cards)
    exam_cards = cards[:limit]

    for card in exam_cards:
        card["_id"] = str(card["_id"])
        card.pop("answer", None)  # hide answers
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
