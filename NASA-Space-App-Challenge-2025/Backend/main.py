from fastapi import FastAPI
import sqlite3


app = FastAPI()
@app.get("/")
async def root():
     return {"message": "Hello, World!"}
