import os
from urllib.parse import quote_plus
from pymongo import MongoClient
from dotenv import load_dotenv

# Load env variables from .env file in the same directory
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://srinathbhattraju2007_db_user:srinath@6769@cluster0.zy7unko.mongodb.net/?appName=Cluster0")

# Programmatically auto-escape the password if it has unescaped special characters
if MONGO_URI.startswith("mongodb"):
    parts = MONGO_URI.split("://")
    if len(parts) == 2:
        scheme, rest = parts[0], parts[1]
        last_at = rest.rfind("@")
        if last_at != -1:
            creds = rest[:last_at]
            host = rest[last_at+1:]
            cred_parts = creds.split(":", 1)
            if len(cred_parts) == 2:
                user = cred_parts[0]
                pwd = cred_parts[1]
                # Avoid double quoting by checking if password already has encoding
                if "%" not in user:
                    user = quote_plus(user)
                if "%" not in pwd:
                    pwd = quote_plus(pwd)
                MONGO_URI = f"{scheme}://{user}:{pwd}@{host}"

print("Connecting to MongoDB Atlas database...")
try:
    client = MongoClient(MONGO_URI)
    # Ping the database to force connection and test credentials immediately
    client.admin.command('ping')
    print("Connected to MongoDB successfully.")
except Exception as e:
    print(f"Could not connect to MongoDB: {e}")
    raise e

db = client["nagapavan_db"]

# Dependency to get db instance in FastAPI routes
def get_db():
    return db
