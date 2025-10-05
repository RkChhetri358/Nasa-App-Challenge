from flask import Flask, request, jsonify
import json
import re
from rapidfuzz import process

app = Flask(__name__)

# Load crater data
with open("mercury_simple.json", "r", encoding="utf-8") as f:
    craters = json.load(f)

# Extract crater names
crater_names = [c["name"] for c in craters]

# --- Helper functions ---
def parse_coordinates(text):
    matches = re.findall(r"(-?\d+\.?\d*)", text)
    if len(matches) >= 2:
        return float(matches[0]), float(matches[1])
    return None

def find_nearest_craters(lat, lon, top_n=3):
    def distance(c):
        c_lat, c_lon = c["coordinates"]
        return (c_lat - lat)**2 + (c_lon - lon)**2
    sorted_craters = sorted(craters, key=distance)
    return sorted_craters[:top_n]

# --- Main search function ---
def find_crater(user_input, top_n=3):
    user_input = user_input.lower().strip()

    # Biggest / smallest
    if "biggest" in user_input or "largest" in user_input:
        crater = max(craters, key=lambda c: c.get("diameter", 0))
        return [{"name": crater["name"], "coordinates": crater["coordinates"],
                 "diameter": crater["diameter"], "link": crater["link"],
                 "reason": "Largest crater found"}]

    if "smallest" in user_input:
        crater = min(craters, key=lambda c: c.get("diameter", 0))
        return [{"name": crater["name"], "coordinates": crater["coordinates"],
                 "diameter": crater["diameter"], "link": crater["link"],
                 "reason": "Smallest crater found"}]

    # Coordinates search
    coords = parse_coordinates(user_input)
    if coords:
        lat, lon = coords
        nearest = find_nearest_craters(lat, lon, top_n=top_n)
        return [{"name": c["name"], "coordinates": c["coordinates"],
                 "diameter": c["diameter"], "link": c["link"],
                 "reason": f"Closest crater to ({lat},{lon})"} for c in nearest]

    # Name fuzzy search
    best_match, score, idx = process.extractOne(user_input, crater_names)
    if score > 60:
        crater = craters[idx]
        return [{"name": crater["name"], "coordinates": crater["coordinates"],
                 "diameter": crater["diameter"], "link": crater["link"],
                 "reason": f"Name matched with score {score}"}]

    # No match
    return []

# --- Flask routes ---
@app.route("/")
def home():
    return "Welcome to the Mercury Crater Search API! Use /search/?q=<query> to search."

@app.route("/search/", methods=["GET", "POST"])
def search_crater():
    if request.method == "GET":
        query = request.args.get("q", "")
        if not query:
            return jsonify({"error": "Missing query parameter 'q'"}), 400

    elif request.method == "POST":
        data = request.get_json()
        if not data or "query" not in data:
            return jsonify({"error": "Missing JSON body with 'query' key"}), 400
        query = data["query"]

    results = find_crater(query, top_n=3)
    if not results:
        return jsonify({"query": query, "results": [], "message": "No matching craters found"}), 404

    return jsonify({"query": query, "results": results})

if __name__ == "__main__":
    app.run(debug=True)
