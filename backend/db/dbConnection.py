import os

import dotenv
import pymongo.mongo_client
from pymongo.server_api import ServerApi

dotenv.load_dotenv()
uri = os.getenv("MONGO_URI")

# Create a new client and connect to the server
client = pymongo.mongo_client.MongoClient(uri, server_api=ServerApi('1'))
db = client["JAMHUB"]
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

room_collection = db["rooms"]
flashcard_collection = db["flashcards"]
progress_collection = db["progress"]
comment_collection = db["comments"]
user_collection = db["users"]



