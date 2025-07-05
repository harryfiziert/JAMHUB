from fastapi import APIRouter
from db.dbConnection import db
import smtplib
from email.message import EmailMessage
import os
from bson import ObjectId

router = APIRouter()

def send_reminder_email(to_email, room_statuses):
    msg = EmailMessage()
    msg["Subject"] = "Reminder: Du hast noch Lernstoff offen!"
    msg["From"] = os.getenv("EMAIL_FROM")
    msg["To"] = to_email

    room_lines = [
        f"- {room['title']} – {room['open']} Karten offen"
        for room in room_statuses
    ]

    content = (
        "Hallo,\n\n"
        "Du hast in folgenden Räumen noch nicht alle Flashcards gelernt:\n\n"
        + "\n".join(room_lines) +
        "\n\nJetzt weitermachen und deinen Fortschritt sichern!"
    )

    msg.set_content(content)

    with smtplib.SMTP(os.getenv("SMTP_HOST"), int(os.getenv("SMTP_PORT"))) as smtp:
        smtp.send_message(msg)
        print(f"📬 Reminder verschickt an: {to_email}")


def send_reminders():
    flashcards = db["flashcards"]
    users = db["users"]
    rooms = db["rooms"]

    print("📣 Reminder check gestartet...")

    user_ids = [uid for uid in flashcards.distinct("user_id") if uid and uid != "null"]
    print(f"👤 Gefundene User IDs: {user_ids}")

    for user_id in user_ids:
        print(f"→ Prüfe User {user_id}")
        try:
            object_id = ObjectId(user_id)
        except Exception as e:
            print(f"⚠️ Ungültige ObjectId: {user_id} – {e}")
            continue

        user = users.find_one({"_id": object_id})
        if not user or "email" not in user:
            print(f"⚠️ Kein gültiger User mit ID {user_id}")
            continue

        print(f"→→ Räume für User {user_id}")
        room_ids = flashcards.distinct("room_id", {"user_id": user_id})
        room_statuses = []

        for room_id in room_ids:
            print(f"→→→ Prüfe Raum {room_id}")
            total = flashcards.count_documents({"user_id": user_id, "room_id": room_id})
            learned = flashcards.count_documents({"user_id": user_id, "room_id": room_id, "learned": True})
            print(f"User {user_id}, Raum {room_id}: total={total}, learned={learned}")
            if learned < total:
                room = rooms.find_one({"id": room_id})
                room_title = room["title"] if room and "title" in room else str(room_id)
                room_statuses.append({
                    "title": room_title,
                    "open": total - learned
                })

        if room_statuses:
            print(f"📧 Reminder wird gesendet an {user['email']}")
            send_reminder_email(user["email"], room_statuses)
