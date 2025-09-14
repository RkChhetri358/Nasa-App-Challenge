# app.py
import streamlit as st
import requests
import pandas as pd
import streamlit.components.v1 as components
import json

st.set_page_config(page_title="JWST Explorer", page_icon="🔭", layout="wide")
st.title("🔭 JWST Image Explorer")
st.write("Upload a FITS or JPG image to detect celestial objects.")
API_URL = "http://127.0.0.1:8000"

if 'dzi_path' not in st.session_state:
    st.session_state.dzi_path = None

uploaded_file = st.file_uploader("Choose an image...", type=["fits", "jpg", "png"])

if uploaded_file is not None:
    if st.button("Analyze Image"):
        with st.spinner("Processing image and detecting features..."):
            files_for_processing = {"file": (uploaded_file.name, uploaded_file.getvalue(), uploaded_file.type)}
            try:
                process_response = requests.post(f"{API_URL}/process-image/", files=files_for_processing)
                if process_response.status_code != 200:
                    st.error("Failed to process image."); st.stop()
                
                files_for_tiling = {"file": (uploaded_file.name, uploaded_file.getvalue(), uploaded_file.type)}
                tiles_response = requests.post(f"{API_URL}/generate-tiles/", files=files_for_tiling)
                if tiles_response.status_code == 200:
                    tiles_result = tiles_response.json()
                    if "dzi_path" in tiles_result:
                        st.session_state.dzi_path = tiles_result["dzi_path"]
                    else:
                        st.error("API did not return a valid tile path."); st.write(tiles_result); st.stop()
                else:
                    st.error("Failed to generate image tiles:"); st.error(f"Backend Error: {tiles_response.text}"); st.stop()
                
                st.success("Analysis complete!")
            except requests.exceptions.RequestException as e:
                st.error(f"API Connection Error: {e}")
    
    if st.session_state.dzi_path:
        detections_df = pd.DataFrame()
        image_id = uploaded_file.name.split('.')[0]
        detections_response = requests.get(f"{API_URL}/detections/{image_id}")
        if detections_response.status_code == 200:
            detections_df = pd.DataFrame(detections_response.json())
        
        detections_json = detections_df.to_json(orient='records')

        with open("openseadragon_template.html") as f:
            html_template = f.read()
        
        dzi_url = f"{API_URL}/{st.session_state.dzi_path}"
        
        # --- CORRECTED LINE: Removed extra single quotes from the first argument ---
        html_code = html_template.replace("%DZI_PATH%", dzi_url).replace("%DETECTIONS_JSON%", detections_json)
        
        st.write("### Interactive Viewer")
        components.html(html_code, height=600)
        
        if not detections_df.empty:
            st.write("### Detected Features:")
            st.dataframe(detections_df)