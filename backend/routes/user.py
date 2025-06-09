from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.dbConnection import db
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, EmailStr, constr
import bcrypt

router = APIRouter()
collection = db["users"]

# Modell für Registrierung
class UserCreate(BaseModel):
    uid: str
    email: EmailStr
    username: str
    university: str

# Modell für Update
class UserUpdate(BaseModel):
    email: EmailStr | None = None
    username: str | None = None
    password: constr(min_length=6) | None = None

# POST: Registrierung
@router.post("/register")
def register_user(user: UserCreate):
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


