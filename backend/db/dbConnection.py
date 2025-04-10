from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://julian:XWul7F7L4l6AyhBY@jamhub.szt6lxj.mongodb.net/?retryWrites=true&w=majority&appName=JAMHUB"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["JAMHUB"]
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)



