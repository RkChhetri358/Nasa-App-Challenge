# Moon Crater Search API

This API allows users to search for craters on Mercury (or Moon if you adapt the data) by name, coordinates, or simple descriptive queries (like "biggest crater", "smallest crater"). It returns crater information including name, coordinates, diameter, and a reference link.

## Base URL

```
http://<your-server-address>:5000
```

## Endpoints

### 1. `/search`

Search craters using GET or POST methods.

#### Methods

- **GET** – Query using URL parameters
- **POST** – Query using JSON body

## GET Method

### Request Format

```
GET /search?q=<your_query>
```

### Query Parameter

| Parameter | Type   | Description                                            |
| --------- | ------ | ------------------------------------------------------ |
| `q`       | string | The search query (name, coordinates, descriptive text) |

### Example Requests

```
GET /search?q=freddie+mercury+crater
GET /search?q=10+-34
GET /search?q=biggest+crater
```

### Example Response

```json
[
  {
    "name": "Waters",
    "coordinates": [254.5466, -8.9583],
    "diameter": 15.0,
    "link": "http://planetarynames.wr.usgs.gov/Feature/15086",
    "reason": "Name matched with score 72.0"
  }
]
```

## POST Method

### Request Format

```
POST /search
Content-Type: application/json

{
  "query": "<your_query>"
}
```

### Example Request Body

```json
{
  "query": "crater near 60 -34"
}
```

### Example Response

```json
[
  {
    "name": "Bulsara",
    "coordinates": [60.0, -34.16],
    "diameter": 110.0,
    "link": "http://planetarynames.wr.usgs.gov/Feature/16280",
    "reason": "Closest crater to (60.0,-34.0)"
  },
  {
    "name": "Nautilus Rupes",
    "coordinates": [66.6674, -28.2349],
    "diameter": 348.0,
    "link": "http://planetarynames.wr.usgs.gov/Feature/15134",
    "reason": "Closest crater to (60.0,-34.0)"
  }
]
```

## How It Works

### Fuzzy Name Search

- Matches crater names approximately using the `rapidfuzz` library
- Minimum similarity score of 60% required for matches

### Coordinate Search

- Finds the nearest craters to a given latitude and longitude
- Returns up to 3 closest craters by default
- Uses Euclidean distance calculation

### Descriptive Queries

- Supports **"biggest crater"** and **"smallest crater"** queries
- Returns the single largest or smallest crater by diameter

## Response Fields

| Field         | Type   | Description                                      |
| ------------- | ------ | ------------------------------------------------ |
| `name`        | string | The name of the crater                           |
| `coordinates` | array  | Array containing [longitude, latitude]           |
| `diameter`    | number | Crater diameter in kilometers                    |
| `link`        | string | URL with additional information about the crater |
| `reason`      | string | Explanation of why this crater was returned      |

## Error Handling

### Missing Query Parameter (GET)

**Status Code:** `400 Bad Request`

```json
{
  "error": "Missing query parameter 'q'"
}
```

### Missing JSON Body (POST)

**Status Code:** `400 Bad Request`

```json
{
  "error": "Missing JSON body with 'query' key"
}
```

### No Results Found

**Status Code:** `200 OK`

```json
{
  "query": "nonexistent_crater",
  "results": []
}
```

## Usage Examples

### Search by Name

```bash
# GET request
curl "http://localhost:5000/search?q=apollo"

# POST request
curl -X POST http://localhost:5000/search \
  -H "Content-Type: application/json" \
  -d '{"query": "apollo"}'
```

### Search by Coordinates

```bash
# Find craters near coordinates (60, -34)
curl "http://localhost:5000/search?q=60 -34"
```

### Search by Size

```bash
# Find the biggest crater
curl "http://localhost:5000/search?q=biggest crater"

# Find the smallest crater
curl "http://localhost:5000/search?q=smallest crater"
```

## Technical Details

### Dependencies

- Flask (web framework)
- rapidfuzz (fuzzy string matching)
- json (JSON handling)
- re (regular expressions)

### Data Source

The API uses crater data from `mercury_simple.json` file containing:

- Crater names
- Coordinates (longitude, latitude)
- Diameter measurements
- Reference links to planetary nomenclature database

### Running the API

```bash
python Main.py
```

The development server will start at `http://localhost:5000` with debug mode enabled.
