from fastapi import FastAPI
from typing import List
from pydantic import BaseModel

app = FastAPI()

# Flashcard model for validation and structure
class Flashcard(BaseModel):
    id: int
    question: str
    answer: str
    topic: str

# In-memory "database"
flashcards_db = [
    Flashcard(id=1, question="What is a variable?", answer="A named container for a value.", topic="Basics"),
    Flashcard(id=2, question="What is a function?", answer="Reusable block of code.", topic="Functions"),
]

# GET all flashcards
@app.get("/flashcards", response_model=List[Flashcard])
def get_flashcards():
    return flashcards_db

# POST a new flashcard
@app.post("/flashcards", response_model=Flashcard)
def create_flashcard(flashcard: Flashcard):
    flashcards_db.append(flashcard)
    return flashcard
