/**
 * MovieCard – interactive card for the discovery grid.
 */
import MoviePoster from './MoviePoster';

const MAX_GENRES = 3;

export default function MovieCard({ movie, onSelect, onDetail, isSelected }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.(movie);
    }
  }

  function handleClick(e) {
    // Double click or Ctrl+click → open detail
    if (e.detail === 2 || e.ctrlKey) {
      onDetail?.(movie);
    } else {
      onSelect?.(movie);
    }
  }

  const visibleGenres = movie.genres?.slice(0, MAX_GENRES) || [];
  const extraGenres = (movie.genres?.length || 0) - MAX_GENRES;

  return (
    <article
      className={`movie-card${isSelected ? ' selected' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`${movie.title}${movie.year ? `, ${movie.year}` : ''}. Click to select; double-click for details.`}
    >
      <div className="movie-card__overlay" aria-hidden="true" />

      <MoviePoster movie={movie} />

      <div className="movie-card__body">
        <h3 className="movie-card__title" title={movie.title}>
          {movie.title}
        </h3>
        {movie.year && (
          <span className="movie-card__year">{movie.year}</span>
        )}

        <div className="movie-card__genres" aria-label="Genres">
          {visibleGenres.map(g => (
            <span key={g} className="genre-tag">{g}</span>
          ))}
          {extraGenres > 0 && (
            <span className="genre-tag" aria-label={`${extraGenres} more genres`}>
              +{extraGenres}
            </span>
          )}
        </div>

      </div>
    </article>
  );
}
