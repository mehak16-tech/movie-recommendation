/**
 * MovieDetailModal – accessible modal showing movie details.
 */
import { useEffect, useRef } from 'react';
import { X, Star, Zap } from 'lucide-react';
import MoviePoster from './MoviePoster';

export default function MovieDetailModal({ movie, onClose, onGetRecommendations }) {
  const closeRef = useRef(null);

  // Trap focus and handle Escape
  useEffect(() => {
    closeRef.current?.focus();

    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal">
        <div className="modal__header">
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--accent-electric)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              Movie Details
            </p>
            <h2 id="modal-title" className="modal__title">{movie.title}</h2>
          </div>
          <button
            ref={closeRef}
            className="modal__close"
            onClick={onClose}
            aria-label="Close details"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal__body">
          <div className="modal__poster">
            <MoviePoster movie={movie} />
          </div>

          <div className="modal__info">
            {movie.year && (
              <p className="modal__year">Released: {movie.year}</p>
            )}

            <div className="modal__genres" aria-label="Genres">
              {(movie.genres || []).map(g => (
                <span key={g} className="genre-tag">{g}</span>
              ))}
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-lg)', lineHeight: 1.6 }}>
              Recommendations are based on genre similarity using a K-Nearest Neighbours model trained on the MovieLens dataset.
            </p>

            <div className="modal__actions">
              <button
                className="btn btn--primary"
                onClick={() => { onGetRecommendations(movie); onClose(); }}
              >
                <Zap size={15} />
                Get Recommendations
              </button>
              <button className="btn btn--outline" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
