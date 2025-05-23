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


router = APIRouter()
load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)
collection = db["flashcards"]

class FlashcardInput(BaseModel):
    text: str
    user_id: Optional[str] = None
    room_id: Optional[str] = None

class FlashcardUpdate(BaseModel):
    question: Optional[str]
    answer: Optional[str]


@router.post("/flashcards/from-pdf")
async def generate_flashcards_from_pdf(file: UploadFile = File(...), user_id: str = "", room_id: str = ""):
    try:
        pdf_bytes = await file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        full_text = "\n".join([page.get_text() for page in doc])
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"PDF konnte nicht gelesen werden: {e}")

    chunks = [para.strip() for para in full_text.split("\n\n") if len(para.strip()) > 100]
    print(f"DEBUG: {len(chunks)} Chunks (nach Absätzen)")
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

            try:
                cards = json.loads(raw)
            except json.JSONDecodeError as e:
                raise HTTPException(status_code=500, detail={
                    "error": f"Fehler beim JSON-Parsing: {str(e)}",
                    "gpt_output": raw
                })
            for card in cards:
                card["user_id"] = user_id
                card["room_id"] = room_id
                result = collection.insert_one(card)
                card["_id"] = str(result.inserted_id)
                created.append(card)

        except Exception as e:
            created.append({"error": f"Fehler bei Chunk: {chunk[:50]}...", "detail": str(e)})

    return created

@router.get("/flashcards/test")
def get_test_flashcards():
    dummy_cards = [
        {"question": "Was ist die Hauptstadt von Frankreich?", "answer": "Paris"},
        {"question": "Was ist 3 + 4?", "answer": "7"},
        {"question": "Wofür steht CPU?", "answer": "Central Processing Unit"}
    ]

    stored = []
    for card in dummy_cards:
        card["user_id"] = "test-user"
        card["room_id"] = "test-room"
        result = collection.insert_one(card)
        card["_id"] = str(result.inserted_id)
        stored.append(card)

    return stored


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
