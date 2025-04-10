import requests

BASE = "http://127.0.0.1:8000"

# 🧍‍♂️ USER REGISTRIEREN
user_data = {
    "uid": "u123",
    "email": "test@fh.at",
    "username": "Max Mustermann",
    "university": "FH OÖ"
}

res_user = requests.post(f"{BASE}/register", json=user_data)
print("📩 Register User:", res_user.json())

# 🧠 USER ABRUFEN
res_get_user = requests.get(f"{BASE}/user/u123")
print("🔍 Get User:", res_get_user.json())

# 🏠 ROOM ERSTELLEN
room_data = {
    "name": "u123",
    "title": "Mathe 1",
    "description": "Lernraum für Mathe",
    "password": "1234",
    "user": [],
    "flashcards": []
}

res_room = requests.post(f"{BASE}/room", json=room_data)
print("🏠 Create Room:", res_room.json())

# ⛳ ROOM ABRUFEN
room_code = res_room.json()["id"]
res_get_room = requests.get(f"{BASE}/room/{room_code}")
print("🔍 Get Room:", res_get_room.json())
