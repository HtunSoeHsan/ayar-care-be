# Option 1: Direct app instance
from flask import Flask
app = Flask(__name__)

@app.route('/')
def home():
    return "Hello Ayar Care"