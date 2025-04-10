from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from db.dbConnection import db

import random
import string
from fastapi import HTTPException

router = APIRouter()
collection = db["rooms"]


def generate_room_code(length=6):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))


class Room(BaseModel):
    name: str
    title: str
    description: str
    password: str
    user: List[str] = []
    flashcards: List[str] = []

@router.post("/room")
async def create_room(room: Room):
    # Room-Code erzeugen
    new_code = generate_room_code()
    while collection.find_one({"id": new_code}):
        new_code = generate_room_code()

    #TODO: hier auf userid ändern wenn wir die haben!
    creator_name = room.name
    room.user = [creator_name]


    room_data = room.dict()
    room_data["id"] = new_code

    result = collection.insert_one(room_data)
    room_data["_id"] = str(result.inserted_id)

    return room_data


@router.get("/room/{code}")
async def get_room_by_code(code: str):
    room = collection.find_one({"id": code})
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    # ObjectId konvertieren
    room["_id"] = str(room["_id"])
    return room