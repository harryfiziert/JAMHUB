from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from db.dbConnection import db
import random
import string

router = APIRouter()
collection = db["rooms"]

# Modell für einen Raum
class Room(BaseModel):
    creator_id: str
    title: str
    description: str
    password: str
    user: List[str] = []
    flashcards: List[str] = []

# Raumcode generieren
def generate_room_code(length=6):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

# Raum erstellen
@router.post("/room")
async def create_room(room: Room):
    print("DEBUG: create_room mit creator_id =", room.creator_id)

    new_code = generate_room_code()
    while collection.find_one({"id": new_code}):
        new_code = generate_room_code()

    room.user = [room.creator_id]

    room_data = room.dict()
    room_data["id"] = new_code

    result = collection.insert_one(room_data)
    room_data["_id"] = str(result.inserted_id)

    return room_data

# User zu Raum hinzufügen
@router.post("/room/{code}/add-user/{uid}")
async def add_user_to_room(code: str, uid: str):
    room = collection.find_one({"id": code})
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    if uid in room["user"]:
        return {"message": "User already in room"}

    collection.update_one({"id": code}, {"$push": {"user": uid}})
    return {"message": f"User {uid} added to room {code}"}

# User aus Raum entfernen
@router.post("/room/{code}/remove-user/{uid}")
async def remove_user_from_room(code: str, uid: str):
    room = collection.find_one({"id": code})
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    if uid not in room["user"]:
        return {"message": "User not in room"}

    collection.update_one({"id": code}, {"$pull": {"user": uid}})
    return {"message": f"User {uid} removed from room {code}"}

# Raum löschen
@router.delete("/room/{code}")
async def delete_room(code: str):
    result = collection.delete_one({"id": code})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Room not found")
    return {"message": f"Room {code} deleted"}

# Räume eines Users abrufen
@router.get("/rooms/by-user/{uid}")
async def get_rooms_by_user(uid: str):
    rooms = list(collection.find({"user": uid}))
    for room in rooms:
        room["_id"] = str(room["_id"])
    return rooms

# Raum anhand ID anzeigen
@router.get("/room/{code}")
async def get_room_by_code(code: str):
    room = collection.find_one({"id": code})
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    room["_id"] = str(room["_id"])
    return room
