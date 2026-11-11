# Movie Recommendation System

A full-stack content-based movie recommendation system. The application uses
K-Nearest Neighbors (KNN) to recommend movies with similar genres.

## Architecture

The project is split into three responsibilities:

### Frontend

The frontend is a React/Vite single-page application in
[`frontend/`](./frontend). It is responsible for:

- Rendering the cinematic user interface.
- Searching and paginating the movie catalogue.
- Displaying movie details and recommendations.
- Calling the backend HTTP API.
- Providing demo-mode data when the backend is unavailable.

Key files:

- [`frontend/src/App.jsx`](./frontend/src/App.jsx) - application state and layout.
- [`frontend/src/components/`](./frontend/src/components) - reusable UI components.
- [`frontend/src/api.js`](./frontend/src/api.js) - frontend data-access layer.
- [`frontend/vite.config.js`](./frontend/vite.config.js) - development server and API proxy.

Technology: React, Vite, JSX, JavaScript, and CSS.

### Backend

The backend is a Flask HTTP API in
[`backend/api/app.py`](./backend/api/app.py). It is responsible for:

- Loading and preprocessing the MovieLens dataset.
- Building the KNN recommendation model.
- Searching and paginating movies.
- Returning movie details and recommendations as JSON.
- Validating query parameters and returning HTTP errors.

Available endpoints:

| Endpoint | Responsibility |
|---|---|
| `GET /api/health` | Check API availability and catalogue size |
| `GET /api/movies?q=&page=&limit=` | Search and paginate movies |
| `GET /api/movie/<movie_id>` | Return one movie |
| `GET /api/recommend?title=&n=` | Return similar movies |

Technology: Python, Flask, Flask-CORS, pandas, NumPy, and scikit-learn.

### Recommendation and data-processing layer

The backend uses the Python modules in
[`backend/`](./backend) for the machine-learning logic:

- [`backend/data_processing.py`](./backend/data_processing.py) - loads and cleans movie data.
- [`backend/feature_engineering.py`](./backend/feature_engineering.py) - converts genres into features.
- [`backend/recommender.py`](./backend/recommender.py) - calculates KNN recommendations.
- [`backend/evaluation.py`](./backend/evaluation.py) - evaluates recommendation quality.

This layer is not frontend code and is not an independent web server; it is
imported and used by the Flask backend.

## Project Structure

```text
movie-recommendation/
├── frontend/              # React/Vite frontend
├── backend/               # Flask API, ML code, data, and Python tests
├── notebooks/              # Exploratory analysis
└── EVALUATION_SUMMARY.md  # ML evaluation notes
```

## Running the application

### Start the backend

From the project root, activate the Python environment and run:

```powershell
.venv\Scripts\Activate.ps1
python backend/api/app.py
```

The API runs at `http://localhost:5000`.

### Start the frontend

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

The frontend can also run without the backend in demo mode. When the Flask API
is available, it automatically uses the live catalogue and recommendations.

## Testing

Run the Python tests from the project root:

```powershell
python -m pytest backend
```

Build and lint the frontend:

```powershell
cd frontend
npm run lint
npm run build
```
