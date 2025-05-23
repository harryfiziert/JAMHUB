from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.dbConnection import db


router = APIRouter()
collection = db["users"]

# Pydantic-Modell für User-Erstellung
class UserCreate(BaseModel):
    uid: str
    email: str
    username: str
    university: str

# POST: Registrierung
@router.post("/register")
def register_user(user: UserCreate):
    print("📥 Backend received:", user.dict())

    # Existiert der User bereits?
    if collection.find_one({"uid": user.uid}):
        raise HTTPException(status_code=400, detail="User already exists")

    result = collection.insert_one(user.dict())
    return {"message": "User saved successfully", "id": str(result.inserted_id)}

# GET: Benutzerdaten abrufen
@router.get("/user/{uid}")
def get_user(uid: str):
    user = collection.find_one({"uid": uid})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user["_id"] = str(user["_id"])
    return user


