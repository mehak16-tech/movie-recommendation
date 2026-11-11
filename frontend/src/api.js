/**
 * api.js – Centralised data access layer.
 *
 * All movie-search and recommendation-fetch logic lives here so that
 * replacing the demo data with live API calls only requires changes
 * to this single file — not to any UI component.
 *
 * MODE:
 *   The app automatically detects whether the Flask API is reachable
 *   (via /api/health).  If it is, every call goes to the real backend.
 *   If it is not (demo / standalone mode) every call falls back to the
 *   static sample dataset below.
 */

// ---------------------------------------------------------------------------
// DEMO DATA  (used only when the Flask API is not available)
// Duplicates removed; each movieId is unique.
// ---------------------------------------------------------------------------
export const DEMO_MOVIES = [
  { movieId: 1,    title: "Toy Story (1995)",                       year: 1995, genres: ["Adventure","Animation","Children","Comedy","Fantasy"] },
  { movieId: 2,    title: "Jumanji (1995)",                         year: 1995, genres: ["Adventure","Children","Fantasy"] },
  { movieId: 3,    title: "Grumpier Old Men (1995)",                year: 1995, genres: ["Comedy","Romance"] },
  { movieId: 6,    title: "Heat (1995)",                            year: 1995, genres: ["Action","Crime","Thriller"] },
  { movieId: 10,   title: "GoldenEye (1995)",                       year: 1995, genres: ["Action","Adventure","Thriller"] },
  { movieId: 11,   title: "American President, The (1995)",         year: 1995, genres: ["Comedy","Drama","Romance"] },
  { movieId: 13,   title: "Balto (1995)",                           year: 1995, genres: ["Adventure","Animation","Children"] },
  { movieId: 14,   title: "Nixon (1995)",                           year: 1995, genres: ["Drama"] },
  { movieId: 16,   title: "Casino (1995)",                          year: 1995, genres: ["Crime","Drama"] },
  { movieId: 17,   title: "Sense and Sensibility (1995)",           year: 1995, genres: ["Drama","Romance"] },
  { movieId: 31,   title: "Dangerous Minds (1995)",                 year: 1995, genres: ["Drama"] },
  { movieId: 32,   title: "Twelve Monkeys (a.k.a. 12 Monkeys) (1995)", year: 1995, genres: ["Mystery","Sci-Fi","Thriller"] },
  { movieId: 36,   title: "Dead Man (1995)",                        year: 1995, genres: ["Comedy","Drama","Western"] },
  { movieId: 47,   title: "Seven (a.k.a. Se7en) (1995)",           year: 1995, genres: ["Mystery","Thriller"] },
  { movieId: 48,   title: "Pocahontas (1995)",                      year: 1995, genres: ["Animation","Children","Drama","Musical","Romance"] },
  { movieId: 50,   title: "Usual Suspects, The (1995)",             year: 1995, genres: ["Crime","Mystery","Thriller"] },
  { movieId: 110,  title: "Braveheart (1995)",                      year: 1995, genres: ["Action","Drama","War"] },
  { movieId: 111,  title: "Taxi Driver (1976)",                     year: 1976, genres: ["Crime","Drama","Thriller"] },
  { movieId: 112,  title: "Rumble in the Bronx (1995)",             year: 1995, genres: ["Action","Adventure","Comedy","Crime"] },
  { movieId: 150,  title: "Apollo 13 (1995)",                       year: 1995, genres: ["Adventure","Drama","IMAX"] },
  { movieId: 153,  title: "Batman Forever (1995)",                  year: 1995, genres: ["Action","Adventure","Comedy"] },
  { movieId: 156,  title: "Crimson Tide (1995)",                    year: 1995, genres: ["Drama","Thriller","War"] },
  { movieId: 158,  title: "Casper (1995)",                          year: 1995, genres: ["Adventure","Children","Fantasy"] },
  { movieId: 165,  title: "Die Hard: With a Vengeance (1995)",      year: 1995, genres: ["Action","Crime","Thriller"] },
  { movieId: 208,  title: "Waterworld (1995)",                      year: 1995, genres: ["Action","Adventure","Sci-Fi"] },
  { movieId: 231,  title: "Waiting to Exhale (1995)",               year: 1995, genres: ["Comedy","Drama","Romance"] },
  { movieId: 293,  title: "Léon: The Professional (1994)",          year: 1994, genres: ["Action","Crime","Drama","Thriller"] },
  { movieId: 296,  title: "Pulp Fiction (1994)",                    year: 1994, genres: ["Comedy","Crime","Drama","Thriller"] },
  { movieId: 318,  title: "Shawshank Redemption, The (1994)",       year: 1994, genres: ["Crime","Drama"] },
  { movieId: 356,  title: "Forrest Gump (1994)",                    year: 1994, genres: ["Comedy","Drama","Romance","War"] },
  { movieId: 364,  title: "Lion King, The (1994)",                  year: 1994, genres: ["Adventure","Animation","Children","Drama","Musical","IMAX"] },
  { movieId: 377,  title: "Speed (1994)",                           year: 1994, genres: ["Action","Romance","Thriller"] },
  { movieId: 380,  title: "True Lies (1994)",                       year: 1994, genres: ["Action","Adventure","Comedy","Romance","Thriller"] },
  { movieId: 457,  title: "Schindler's List (1993)",                year: 1993, genres: ["Drama","War"] },
  { movieId: 480,  title: "Jurassic Park (1993)",                   year: 1993, genres: ["Action","Adventure","Sci-Fi","Thriller"] },
  { movieId: 527,  title: "Philadelphia (1993)",                    year: 1993, genres: ["Drama","Romance"] },
  { movieId: 589,  title: "Terminator 2: Judgment Day (1991)",      year: 1991, genres: ["Action","Sci-Fi"] },
  { movieId: 593,  title: "Silence of the Lambs, The (1991)",       year: 1991, genres: ["Crime","Horror","Thriller"] },
  { movieId: 608,  title: "Fargo (1996)",                           year: 1996, genres: ["Comedy","Crime","Drama","Thriller"] },
  { movieId: 648,  title: "Mission: Impossible (1996)",             year: 1996, genres: ["Action","Adventure","Mystery","Thriller"] },
  { movieId: 733,  title: "Rock, The (1996)",                       year: 1996, genres: ["Action","Adventure","Thriller"] },
  { movieId: 858,  title: "Godfather, The (1972)",                  year: 1972, genres: ["Crime","Drama"] },
  { movieId: 912,  title: "Casablanca (1942)",                      year: 1942, genres: ["Drama","Romance","War"] },
  { movieId: 924,  title: "2001: A Space Odyssey (1968)",           year: 1968, genres: ["Mystery","Sci-Fi"] },
  { movieId: 953,  title: "It's a Wonderful Life (1946)",           year: 1946, genres: ["Children","Drama","Fantasy","Romance"] },
  { movieId: 1036, title: "Die Hard (1988)",                        year: 1988, genres: ["Action","Crime","Thriller"] },
  { movieId: 1196, title: "Star Wars: Episode V - The Empire Strikes Back (1980)", year: 1980, genres: ["Action","Adventure","Sci-Fi"] },
  { movieId: 1210, title: "Star Wars: Episode VI - Return of the Jedi (1983)",     year: 1983, genres: ["Action","Adventure","Sci-Fi"] },
  { movieId: 1270, title: "Back to the Future (1985)",              year: 1985, genres: ["Adventure","Comedy","Sci-Fi"] },
];

// ---------------------------------------------------------------------------
// DEMO RECOMMENDATIONS
// Genre-matched per movie so every card shows relevant results.
// ---------------------------------------------------------------------------

/**
 * Compute genre-similarity recommendations for a movie from the demo set.
 * Uses Jaccard similarity: |A ∩ B| / |A ∪ B|
 */
function computeDemoRecs(movie, allMovies, n) {
  const targetGenres = new Set(movie.genres);

  const scored = allMovies
    .filter(m => m.movieId !== movie.movieId)
    .map(m => {
      const candidateGenres = new Set(m.genres);
      const intersection = [...targetGenres].filter(g => candidateGenres.has(g)).length;
      const union = new Set([...targetGenres, ...candidateGenres]).size;
      const similarity = union === 0 ? 0 : intersection / union;
      // Convert to a distance-like metric (0 = identical, 1 = no overlap)
      const distance = parseFloat((1 - similarity).toFixed(4));
      return { ...m, distance };
    })
    // Sort by distance ascending (most similar first), then alphabetically
    .sort((a, b) => a.distance - b.distance || a.title.localeCompare(b.title));

  return scored.slice(0, n);
}

// ---------------------------------------------------------------------------
// API MODE DETECTION
// ---------------------------------------------------------------------------
let _apiAvailable = null; // null = unknown, true = live, false = demo

async function detectApiMode() {
  if (_apiAvailable !== null) return _apiAvailable;
  try {
    const res = await fetch('/api/health', { signal: AbortSignal.timeout(2000) });
    _apiAvailable = res.ok;
  } catch {
    _apiAvailable = false;
  }
  return _apiAvailable;
}

export async function isApiAvailable() {
  return detectApiMode();
}

// ---------------------------------------------------------------------------
// PUBLIC API FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Search / list movies from the catalogue.
 * Returns { movies, total, page, pages, limit, mode }
 */
export async function fetchMovies({ q = '', page = 1, limit = 24 } = {}) {
  const live = await detectApiMode();

  if (live) {
    const params = new URLSearchParams({ q, page, limit });
    const res = await fetch(`/api/movies?${params}`);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();
    return { ...data, mode: 'live' };
  }

  // --- Demo fallback ---
  const normalised = q.trim().toLowerCase();
  const filtered = normalised
    ? DEMO_MOVIES.filter(m => m.title.toLowerCase().includes(normalised))
    : DEMO_MOVIES;

  const total = filtered.length;
  const start = (page - 1) * limit;
  const movies = filtered.slice(start, start + limit);

  return {
    movies,
    total,
    page,
    limit,
    pages: Math.max(1, Math.ceil(total / limit)),
    mode: 'demo',
  };
}

/**
 * Fetch recommendations for a given movie title.
 * Returns { recommendations, query, mode }
 *
 * In demo mode: uses Jaccard genre-similarity computed on the fly,
 * so every movie gets meaningful, genre-matched recommendations.
 */
export async function fetchRecommendations(title, n = 10) {
  const live = await detectApiMode();

  if (live) {
    const params = new URLSearchParams({ title, n });
    const res = await fetch(`/api/recommend?${params}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `API error ${res.status}`);
    return { ...data, mode: 'live' };
  }

  // --- Demo fallback: genre-similarity computed locally ---
  const normalised = title.trim().toLowerCase();
  const match = DEMO_MOVIES.find(m => m.title.toLowerCase() === normalised);

  if (!match) {
    // Try partial match as a courtesy
    const partial = DEMO_MOVIES.find(m => m.title.toLowerCase().includes(normalised));
    if (!partial) {
      throw new Error(`Movie not found in demo data: "${title}". Try searching by title first.`);
    }
    const recs = computeDemoRecs(partial, DEMO_MOVIES, n);
    return { recommendations: recs, query: partial.title, mode: 'demo' };
  }

  const recs = computeDemoRecs(match, DEMO_MOVIES, n);
  return { recommendations: recs, query: title, mode: 'demo' };
}

/**
 * Fetch a single movie by ID.
 * Returns the movie object (or throws).
 */
export async function fetchMovieById(movieId) {
  const live = await detectApiMode();

  if (live) {
    const res = await fetch(`/api/movie/${movieId}`);
    if (!res.ok) throw new Error(`Movie not found: ${movieId}`);
    return await res.json();
  }

  const movie = DEMO_MOVIES.find(m => m.movieId === movieId);
  if (!movie) throw new Error(`Movie not found: ${movieId}`);
  return movie;
}
