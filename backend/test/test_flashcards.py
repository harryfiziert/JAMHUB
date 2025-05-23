import requests

BASE = "http://127.0.0.1:8000"

# Testkarten erzeugen lassen
res_create = requests.get(f"{BASE}/flashcards/test")
print("\n=== Testkarten erzeugt ===")
cards = res_create.json()
print(cards)

if not cards:
    exit("Keine Karten erhalten")

# Erste Karte verwenden
first = cards[0]
card_id = first["_id"]

# Karte abrufen
res_get = requests.get(f"{BASE}/flashcard/{card_id}")
print("\n=== Abruf der ersten Karte ===")
print(res_get.json())

# Karte bearbeiten
update_payload = {
    "question": "Was ist die Hauptstadt von Spanien?",
    "answer": "Madrid"
}
res_update = requests.put(f"{BASE}/flashcard/{card_id}", json=update_payload)
print("\n=== Karte bearbeiten ===")
print(res_update.json())

# Karte erneut abrufen
res_get_updated = requests.get(f"{BASE}/flashcard/{card_id}")
print("\n=== Karte nach Update ===")
print(res_get_updated.json())

# # Karte löschen
# res_delete = requests.delete(f"{BASE}/flashcard/{card_id}")
# print("\n=== Karte löschen ===")
# print(res_delete.json())
#
# # Abruf nach Löschung
# res_get_deleted = requests.get(f"{BASE}/flashcard/{card_id}")
# print("\n=== Abruf nach Löschung ===")
# print(f"Status: {res_get_deleted.status_code}")
# try:
#     print(res_get_deleted.json())
# except:
#     print("Fehler beim Parsen (wie erwartet bei 404).")
