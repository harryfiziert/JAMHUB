# import requests
#
# BASE = "http://127.0.0.1:8000"
#
# # Raum erstellen
# room = {
#     "creator_id": "uid123",
#     "title": "Biologie",
#     "description": "Test-Raum",
#     "password": "1234",
#     "user": [],
#     "flashcards": []
# }
# r = requests.post(f"{BASE}/room", json=room)
# room_data = r.json()
# print("Raum erstellt:", room_data)
#
# room_id = room_data["id"]
#
# # User hinzufügen
# res_add = requests.post(f"{BASE}/room/{room_id}/add-user/uid456")
# print("User hinzugefügt:", res_add.json())
#
# # User entfernen
# res_remove = requests.delete(f"{BASE}/room/{room_id}/remove-user/uid456")
# print("User entfernt:", res_remove.json())
#
# # Räume eines Users abrufen
# res_by_user = requests.get(f"{BASE}/rooms/by-user/uid123")
# print("Räume für uid123:", res_by_user.json())
#
# # # Raum löschen
# # res_delete = requests.delete(f"{BASE}/room/{room_id}")
# # print("Raum gelöscht:", res_delete.json())
