# CineMatch Frontend

A professional, cinematic, dark-themed movie recommendation interface for the KNN Movie Recommendation System.

## Technology Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | React 18 + Vite 6                   |
| Language    | JavaScript (JSX)                    |
| Styling     | Vanilla CSS with design tokens      |
| Icons       | Lucide React                        |
| API bridge  | Flask + Flask-CORS (`backend/api/app.py`)   |

---

## Folder Structure

```
frontend/
├── index.html              # HTML shell with SEO meta tags
├── vite.config.js          # Vite config + /api proxy to Flask :5000
├── package.json
├── README.md               # This file
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Root component — state, routing, layout
    ├── api.js              # Data access layer (auto-detects live vs demo)
    ├── index.css           # Design system (tokens, all component styles)
    └── components/
        ├── Navbar.jsx              # Responsive navbar + mobile hamburger
        ├── SearchInput.jsx         # Reusable search input with clear button
        ├── HeroSection.jsx         # Cinematic landing hero
        ├── DiscoverSection.jsx     # Paginated movie grid with search
        ├── RecommendationsSection.jsx  # KNN recommendation results
        ├── MovieCard.jsx           # Individual movie card
        ├── MoviePoster.jsx         # Gradient placeholder poster
        ├── MovieDetailModal.jsx    # Accessible detail modal
        ├── LoadingGrid.jsx         # Shimmer skeleton loading state
        ├── Pagination.jsx          # Page navigation controls
        └── Footer.jsx              # Footer with mode indicator
```

---

## Installation

```powershell
cd D:\movie-recommendation\frontend
npm install
```

---

## Running the Frontend

### Demo mode (no backend required)

```powershell
cd D:\movie-recommendation\frontend
npm run dev
```

Open http://localhost:5173 — the app runs with a built-in sample dataset.
A banner at the top indicates **Demo mode**.

### Live mode (with Flask API)

**Terminal 1 – Flask API:**
```powershell
cd D:\movie-recommendation
.venv\Scripts\Activate.ps1
python backend/api/app.py
```

**Terminal 2 – Vite dev server:**
```powershell
cd D:\movie-recommendation\frontend
npm run dev
```

Open http://localhost:5173 — the app detects the live API automatically.

---

## Features

| Feature                         | Status |
|---------------------------------|--------|
| Dark cinematic theme            | yes    |
| Responsive (mobile/tablet/desktop) | yes |
| Movie discovery grid            | yes    |
| Real-time title search          | yes    |
| Pagination                      | yes    |
| Movie detail modal              | yes    |
| KNN recommendations             | yes    |
| Genre tags                      | yes    |
| Cosine distance display         | yes    |
| Loading / skeleton states       | yes    |
| Empty states                    | yes    |
| Error states                    | yes    |
| Live API auto-detection         | yes    |
| Demo mode fallback              | yes    |
| Keyboard navigation             | yes    |
| ARIA labels / semantic HTML     | yes    |

---

## Data Mode

### Demo mode
Uses a curated set of 50 movies in `src/api.js`. Recommendations are pre-seeded for Toy Story, Jumanji, and Heat; all others use a generic fallback list. No backend needed.

### Live mode
All 9,708 genre-eligible movies from the MovieLens dataset. Recommendations computed by the KNN model (cosine distance). Requires `backend/api/app.py` running.

---

## Limitations

- No real movie poster images — stylised gradient placeholders are used.
- Recommendations are based on genre similarity only.
- Duplicate titles cause a disambiguation error (intentional backend behaviour).
- Demo dataset contains 50 movies; full catalogue available in live mode.

---

## Backend Safety

The following files were NOT modified:
- `backend/data_processing.py`
- `backend/feature_engineering.py`
- `backend/recommender.py`
- `backend/evaluation.py`
- `test_*.py` (all test files)
- `backend/requirements.txt`
- `backend/data/ml-latest-small/movies.csv`
