"""
Flask API for the KNN Movie Recommendation System.

This file is the backend API entry point. It imports the recommender classes
from the backend package without modifying them.

Endpoints:
  GET /api/movies         – paginated movie catalogue (search param: ?q=)
  GET /api/recommend      – KNN recommendations for a title (?title=&n=5)

Run from the project root with the venv activated:
  .venv\\Scripts\\python.exe backend\\api\\app.py
"""

import sys
from pathlib import Path

# Ensure the project root is on the path when this file is run directly.
# This allows imports from the backend package to work from any working
# directory, including `python backend\api\app.py` from the repository root.
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from flask import Flask, jsonify, request
from flask_cors import CORS

from backend.data_processing import load_movies, preprocess_movies
from backend.recommender import MovieRecommender

app = Flask(__name__)
CORS(app)  # Allow the Vite dev server (port 5173) to call this API

# ---------------------------------------------------------------------------
# Boot: load movies and build the KNN model once at startup
# ---------------------------------------------------------------------------
print("Loading movie catalogue and building KNN model …")
_raw_movies = load_movies()
_processed_movies, _ = preprocess_movies(_raw_movies)

# Build a lightweight catalogue for search (title + year + genres)
_catalogue = (
    _processed_movies[_processed_movies["has_genres"]]
    [["movieId", "clean_title", "year", "genres", "genre_list"]]
    .copy()
    .reset_index(drop=True)
)

# Build the KNN recommender (fits model once)
_recommender = MovieRecommender()
print(f"Ready — {len(_catalogue)} movies loaded.")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def movie_to_dict(row):
    """Convert a catalogue row to a plain dict safe for JSON."""
    genres = row["genre_list"] if isinstance(row["genre_list"], list) else []
    return {
        "movieId": int(row["movieId"]),
        "title": str(row["clean_title"]),
        "year": int(row["year"]) if row["year"] is not None and str(row["year"]) != "nan" else None,
        "genres": genres,
    }


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.route("/api/movies")
def get_movies():
    """
    Return movies matching an optional search query.

    Query params:
      q      – case-insensitive substring match on title (default: "")
      page   – 1-based page number (default: 1)
      limit  – results per page, max 100 (default: 24)
    """
    q = request.args.get("q", "").strip().casefold()
    try:
        page = max(1, int(request.args.get("page", 1)))
    except ValueError:
        page = 1
    try:
        limit = min(100, max(1, int(request.args.get("limit", 24))))
    except ValueError:
        limit = 24

    if q:
        filtered = _catalogue[_catalogue["clean_title"].str.casefold().str.contains(q, na=False)]
    else:
        filtered = _catalogue

    total = len(filtered)
    start = (page - 1) * limit
    end = start + limit
    page_rows = filtered.iloc[start:end]

    movies = [movie_to_dict(row) for _, row in page_rows.iterrows()]

    return jsonify({
        "movies": movies,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": max(1, (total + limit - 1) // limit),
    })


@app.route("/api/recommend")
def get_recommendations():
    """
    Return KNN recommendations for a given movie title.

    Query params:
      title – exact movie title (e.g. "Toy Story (1995)")
      n     – number of recommendations (default: 10, max: 20)
    """
    title = request.args.get("title", "").strip()
    if not title:
        return jsonify({"error": "title parameter is required"}), 400

    try:
        n = min(20, max(1, int(request.args.get("n", 10))))
    except ValueError:
        n = 10

    try:
        results_df = _recommender.recommend_movies(title, n_recommendations=n)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 404

    # Merge with catalogue to get year + genre_list
    recs = []
    for _, row in results_df.iterrows():
        cat_row = _catalogue[_catalogue["movieId"] == row["movieId"]]
        year = None
        genre_list = row["genres"].split("|") if isinstance(row["genres"], str) else []

        if not cat_row.empty:
            cat = cat_row.iloc[0]
            yr = cat["year"]
            year = int(yr) if yr is not None and str(yr) != "nan" else None
            genre_list = cat["genre_list"] if isinstance(cat["genre_list"], list) else genre_list

        recs.append({
            "movieId": int(row["movieId"]),
            "title": str(row["title"]),
            "year": year,
            "genres": genre_list,
            "distance": float(row["distance"]),
        })

    return jsonify({"recommendations": recs, "query": title})


@app.route("/api/movie/<int:movie_id>")
def get_movie_detail(movie_id):
    """Return detail for a single movie by ID."""
    row = _catalogue[_catalogue["movieId"] == movie_id]
    if row.empty:
        return jsonify({"error": "Movie not found"}), 404
    return jsonify(movie_to_dict(row.iloc[0]))


@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "movies": len(_catalogue)})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
