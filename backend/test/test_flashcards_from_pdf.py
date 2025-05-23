import requests

BASE = "http://127.0.0.1:8000"
PDF_PATH = "test2.pdf"

params = {
    "user_id": "uid123",
    "room_id": "mathe123"
}

with open(PDF_PATH, "rb") as f:
    files = {"file": ("test.pdf", f, "application/pdf")}
    response = requests.post(f"{BASE}/flashcards/from-pdf", files=files, params=params)

print("Antwortstatus:", response.status_code)
print("Erzeugte Flashcards:")
print(response.json())
