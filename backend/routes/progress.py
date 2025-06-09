from fastapi import APIRouter, HTTPException
from db.dbConnection import db

router = APIRouter()
progress_collection = db["progress"]

@router.get("/progress/{user_id}")
def get_user_progress(user_id: str):
    progress_data = list(progress_collection.find({"user_id": user_id}))
    if not progress_data:
        raise HTTPException(status_code=404, detail="Kein Fortschritt gefunden")

    for entry in progress_data:
        entry["_id"] = str(entry["_id"])  # ID lesbar machen

    return {
        "user_id": user_id,
        "sets": progress_data
    }
