/**
 * DiscoverSection – paginated movie grid with search.
 *
 * The internal search input is fully controlled — its value always matches
 * the `query` state. When the parent passes a new `initialQuery` (e.g. from
 * the navbar / hero search), it updates `query` immediately, which updates the
 * controlled input and triggers a fresh data load.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { SearchX, AlertCircle } from 'lucide-react';
import { fetchMovies } from '../api';
import MovieCard from './MovieCard';
import SearchInput from './SearchInput';
import LoadingGrid from './LoadingGrid';
import Pagination from './Pagination';

const PAGE_SIZE = 24;

export default function DiscoverSection({
  selectedMovie,
  onSelectMovie,
  onOpenDetail,
}) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const requestId = useRef(0);

  const loadMovies = useCallback(async (q, p) => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMovies({ q, page: p, limit: PAGE_SIZE });
      if (currentRequest !== requestId.current) return;
      setMovies(data.movies);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      if (currentRequest !== requestId.current) return;
      setError(err.message);
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMovies(query, page);
  }, [query, page, loadMovies]);

  // Called by the internal SearchInput on every keystroke
  function handleSearch(q) {
    setQuery(q);
    setPage(1);
  }

  function handlePageChange(p) {
    setPage(p);
    document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <section id="discover" className="section discover" aria-labelledby="discover-heading">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 id="discover-heading" className="section-title">
              Discover Movies
            </h2>
            <p className="section-subtitle">
              Browse {total.toLocaleString()} movies · Select one to see recommendations
            </p>
          </div>
        </div>

        {/* Controls — SearchInput is fully controlled via `value` prop */}
        <div className="discover__controls">
          <div className="discover__search">
            <SearchInput
              placeholder="Filter by title…"
              onSearch={handleSearch}
              value={query}          /* controlled: always mirrors `query` state */
              size="md"
              id="discover-search"
            />
          </div>
          {!loading && (
            <span className="discover__results-count" aria-live="polite">
              {total === 0
                ? 'No results'
                : `${total.toLocaleString()} movie${total !== 1 ? 's' : ''}`}
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="error-banner" role="alert">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && <LoadingGrid count={PAGE_SIZE} />}

        {/* Movies grid */}
        {!loading && !error && (
          <>
            {movies.length === 0 ? (
              <div className="empty-state" role="status">
                <SearchX size={48} />
                <h3>No movies found</h3>
                <p>
                  {query
                    ? `No results for "${query}". Try a different title.`
                    : 'No movies available.'}
                </p>
              </div>
            ) : (
              <div className="movies-grid" role="list" aria-label="Movie catalogue">
                {movies.map(movie => (
                  <MovieCard
                    key={movie.movieId}
                    movie={movie}
                    onSelect={onSelectMovie}
                    onDetail={onOpenDetail}
                    isSelected={selectedMovie?.movieId === movie.movieId}
                  />
                ))}
              </div>
            )}

            <Pagination page={page} pages={pages} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </section>
  );
}
