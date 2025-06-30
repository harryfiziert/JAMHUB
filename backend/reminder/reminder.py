from fastapi import APIRouter
from db.dbConnection import db
import smtplib
from email.message import EmailMessage
import os
from bson import ObjectId

router = APIRouter()

def send_reminder_email(to_email, room_name):
    msg = EmailMessage()
    msg["Subject"] = f"Reminder: Weiterlernen im Raum {room_name}"
    msg["From"] = os.getenv("EMAIL_FROM")
    msg["To"] = to_email
    msg.set_content(f"Du hast noch nicht alle Karten im Raum '{room_name}' gelernt. Lern weiter, um deinen Fortschritt zu halten!")

    print(msg)


    with smtplib.SMTP(os.getenv("SMTP_HOST"), int(os.getenv("SMTP_PORT"))) as smtp:
        print(f"Sende Mail an {to_email}")
        smtp.send_message(msg)
    print(f"Reminder verschickt an: {to_email} ")


def send_reminders():
    flashcards = db["flashcards"]
    users = db["users"]
    rooms = db["rooms"]

    print("Reminder check gestartet...")

    user_ids = flashcards.distinct("user_id")

    for user_id in user_ids:
        user = users.find_one({"_id": ObjectId(user_id)}) if isinstance(user_id, str) else users.find_one({"_id": user_id})
        if not user or "email" not in user:
            continue

        print(user)

        room_ids = flashcards.distinct("room_id", {"user_id": user_id})
        for room_id in room_ids:
            total = flashcards.count_documents({"user_id": user_id, "room_id": room_id})
            learned = flashcards.count_documents({"user_id": user_id, "room_id": room_id, "learned": True})
            print(room_id, total, learned)
            if learned < total:
                room = rooms.find_one({"id": room_id})
                room_name = room["title"] if room and "title" in room else room_id
                send_reminder_email(user["email"], room_name)
                print(f"Reminder sent to {user['email']} for room '{room_name}'")