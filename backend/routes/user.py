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

# PUT: Userdaten aktualisieren (z. B. E-Mail, Passwort, Username)
@router.put("/user/{uid}")
def update_user(uid: str, update_data: UserUpdate):
    try:
        user = collection.find_one({"uid": uid})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        update_fields = {}

        if update_data.email:
            update_fields["email"] = update_data.email
        if update_data.username:
            update_fields["username"] = update_data.username
        if update_data.password:
            hashed_pw = bcrypt.hashpw(update_data.password.encode(), bcrypt.gensalt())
            update_fields["password"] = hashed_pw.decode("utf-8")

        if not update_fields:
            raise HTTPException(status_code=400, detail="No update fields provided")

        collection.update_one({"uid": uid}, {"$set": update_fields})
        return {"message": "User updated successfully"}

    except Exception as e:
        # Für Debug-Zwecke: exakte Fehlermeldung im Terminal anzeigen
        print("⚠️ UPDATE ERROR:", e)
        raise HTTPException(status_code=500, detail="Something went wrong during update")
