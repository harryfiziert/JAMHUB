import random

from pymongo import MongoClient
from datetime import datetime, timedelta
from bson import ObjectId
from backend.db.dbConnection import  flashcard_collection

# Variante 1
# # Ziel-User-ID
# user_id = "68473cadcfe835ed40d39d51"
#
# # Startdatum
# start_date = datetime.now() - timedelta(days=10)
#
# # Alle Karten des Users, learned=True, ohne learned_at
# cards = list(flashcard_collection.find({
#     "user_id": user_id,
#     "learned": True,
#     "learned_at": {"$exists": False}
# }))
#
# for i, card in enumerate(cards):
#     learned_at = start_date + timedelta(days=i % 10)
#     flashcard_collection.update_one(
#         {"_id": ObjectId(card["_id"])},
#         {"$set": {"learned_at": learned_at.replace(hour=12, minute=0, second=0, microsecond=0)}}
#     )
#     print(f"{card['_id']} → {learned_at.date()} gesetzt.")
#
# print(f" {len(cards)} Karten aktualisiert.")

# variante 2
user_id = "68616f6b2a1aa117c88be943"
# user_id = "68473cadcfe835ed40d39d51"
today = datetime.now().date()
date_range = [today - timedelta(days=i) for i in range(12)]
date_range.reverse()

cards_to_update = list(flashcard_collection.find({
    "user_id": user_id,
    "learned": True,
    "learned_at": {"$exists": False}
}))

day_card_distribution = {}
remaining_cards = cards_to_update.copy()

for date in date_range:
    count_today = random.randint(0, 5)
    day_card_distribution[date] = [remaining_cards.pop() for _ in range(min(count_today, len(remaining_cards)))]
    if not remaining_cards:
        break

for date, cards in day_card_distribution.items():
    for card in cards:
        flashcard_collection.update_one(
            {"_id": ObjectId(card["_id"])},
            {"$set": {"learned_at": datetime.combine(date, datetime.min.time())}}
        )

print("✅ Done. Verteilung:")
for date, cards in day_card_distribution.items():
    print(f"{date}: {len(cards)} Karten")