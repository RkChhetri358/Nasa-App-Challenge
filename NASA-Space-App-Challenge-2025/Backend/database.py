# database.py
import sqlite3

def initialize_database():
    # Connect to the SQLite database (this will create the file if it doesn't exist)
    conn = sqlite3.connect('jwst_data.db')
    cursor = conn.cursor()

    # Create the 'labels' table for user annotations [cite: 39]
    # This will store coordinates and the type of object labeled by a user.
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS labels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image_id TEXT NOT NULL,
        x_coord REAL NOT NULL,
        y_coord REAL NOT NULL,
        label_type TEXT NOT NULL
    )
    ''')

    # We can also add the 'detections' table for AI results [cite: 38]
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS detections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image_id TEXT NOT NULL,
        ra REAL,
        dec REAL,
        type TEXT,
        confidence REAL
    )
    ''')

    # Save the changes and close the connection
    conn.commit()
    conn.close()
    print("Database initialized successfully.")

if __name__ == "__main__":
    initialize_database()