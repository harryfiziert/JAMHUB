from fastapi import APIRouter, HTTPException
# from sqlmodel import SQLModel, Field, Session, select, create_engine
from pydantic import BaseModel
# from typing import Optional

from db.dbConnection import db


router = APIRouter()
collection = db["users"]  # MongoDB-Collection für Benutzer

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

    user["_id"] = str(user["_id"])  # ObjectId konvertieren
    return user


# # Datenbankverbindung für SQLite
# engine = create_engine("sqlite:///users.db")
#
# router = APIRouter()
#
# # SQLModel-Tabelle
# class User(SQLModel, table=True):
#     id: Optional[int] = Field(default=None, primary_key=True)
#     uid: str
#     email: str
#     username: str
#     university: str
#
# # Pydantic-Modell für eingehende Daten
# class UserCreate(BaseModel):
#     uid: str
#     email: str
#     username: str
#     university: str
#
# # Tabelle beim Start erstellen
# @router.on_event("startup")
# def on_startup():
#     SQLModel.metadata.create_all(engine)
#
# # Registrierung
# @router.post("/register")
# def register_user(user: UserCreate):
#     print("📥 Backend received:", user.dict())
#     new_user = User(**user.dict())
#     with Session(engine) as session:
#         session.add(new_user)
#         session.commit()
#     return {"message": "User saved successfully"}
#
# # User abfragen
# @router.get("/user/{uid}")
# def get_user(uid: str):
#     with Session(engine) as session:
#         user = session.exec(select(User).where(User.uid == uid)).first()
#         if not user:
#             raise HTTPException(status_code=404, detail="User not found")
#         return {
#             "uid": user.uid,
#             "email": user.email,
#             "username": user.username,
#             "university": user.university
#         }
