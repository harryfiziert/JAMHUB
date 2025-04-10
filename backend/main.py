from fastapi import FastAPI, HTTPException
from sqlmodel import SQLModel, Field, create_engine, Session, select
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # oder z.B. ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Datenbankmodell für den Benutzer
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    uid: str
    email: str
    username: str
    university: str

# Verbindung zur SQLite-Datenbank herstellen
engine = create_engine("sqlite:///users.db")

# Beim Start: Datenbanktabellen erzeugen
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# Pydantic-Modell für die API-Anfrage
class UserCreate(BaseModel):
    uid: str
    email: str
    username: str
    university: str

# POST-Endpunkt für Registrierung
@app.post("/register")
def register_user(user: UserCreate):
    print("📥 Backend received:", user.dict())  # <-- Logging

    new_user = User(**user.dict())

    with Session(engine) as session:
        session.add(new_user)
        session.commit()

    return {"message": "User saved successfully"}



@app.get("/user/{uid}")
def get_user(uid: str):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.uid == uid)).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return {
            "uid": user.uid,
            "email": user.email,
            "username": user.username,
            "university": user.university
        }

