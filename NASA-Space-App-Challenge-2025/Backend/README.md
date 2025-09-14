**JWST Image Explorer**
This project is a web application that allows users to upload astronomical images (FITS, JPG, or PNG) and an interactive viewer that detects celestial objects within them. The application is built with a Streamlit frontend and a FastAPI backend.

**Key Features**
Image Upload: Supports uploading FITS, JPG, and PNG image files.

Object Detection: Automatically analyzes images to detect objects like stars, galaxies, and arcs.

Interactive Viewer: Uses a deep zoom viewer to allow for a detailed, high-resolution exploration of the uploaded images and the detected objects.

**Prerequisites**
To run this project, you need to have Python 3.8+ installed on your system. It is highly recommended to use a virtual environment to manage dependencies.

**The following Python libraries are required:**

Backend (FastAPI): fastapi, uvicorn, Pillow, astropy, matplotlib, python-multipart

Frontend (Streamlit): streamlit, requests, pandas

Setup and Installation
Follow these steps to set up the project locally.

1. Clone the repository
   Since you have the code files, place them in a single directory.

2. Install Dependencies
   Open your terminal or command prompt in the project directory and install the required packages using pip:

pip install fastapi "uvicorn[standard]" Pillow astropy matplotlib python-multipart
pip install streamlit requests pandas 3. Initialize the Database
The application uses a SQLite database to store detection results. Run the database.py script to create the jwst_data.db file and the necessary tables.

python database.py
Running the Application
The project consists of two separate components: a backend server and a frontend application. You must run the backend first.

1. Run the Backend Server
   In your terminal, navigate to the project directory and start the FastAPI server using uvicorn. This will run the backend on http://127.0.0.1:8000.

uvicorn main:app --reload
Note: The --reload flag is optional but useful for development as it automatically restarts the server when you make changes to the code.

2. Run the Frontend Application
   Open a new terminal window, navigate to the project directory, and start the Streamlit application. This will launch the web application in your default browser, usually on http://localhost:8501.

streamlit run app.py

**Usage**
Navigate to the Streamlit application in your web browser.

Click the "Choose an image..." button to upload a FITS, JPG, or PNG file.

Once the file is selected, click the "Analyze Image" button.

The application will process the image and then display an interactive viewer with the detected objects. You can zoom in and out of the image to see the details.
