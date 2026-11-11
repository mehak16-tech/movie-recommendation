/**
 * RecommendationsSection – shows KNN recommendations for a selected movie.
 */
import { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowLeft, RefreshCw, AlertCircle, Film, Zap } from 'lucide-react';
import { fetchRecommendations } from '../api';
import MovieCard from './MovieCard';
import LoadingGrid from './LoadingGrid';

export default function RecommendationsSection({
  selectedMovie,
  onSelectMovie,
  onOpenDetail,
  onBackToDiscover,
}) {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recMode, setRecMode] = useState(null);
  const requestId = useRef(0);

  useEffect(() => {
    if (!selectedMovie) {
      setRecs([]);
      setRecMode(null);
      return;
    }
    loadRecs(selectedMovie.title);
  }, [selectedMovie]);

  async function loadRecs(title) {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError(null);
    setRecs([]);
    try {
      const data = await fetchRecommendations(title, 10);
      if (currentRequest !== requestId.current) return;
      setRecs(data.recommendations);
      setRecMode(data.mode);
    } catch (err) {
      if (currentRequest !== requestId.current) return;
      setError(err.message);
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }

  return (
    <section
      id="recommend"
      className="section recs-section"
      aria-labelledby="recs-heading"
    >
      <div className="container">
        {/* Placeholder state – no movie selected */}
        {!selectedMovie ? (
          <div className="recs__placeholder">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)' }}>
              <div style={{
                width: 80, height: 80,
                borderRadius: '50%',
                background: 'rgba(138,101,255,0.1)',
                border: '1px solid rgba(138,101,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={36} style={{ color: 'var(--accent-primary)', opacity: 0.6 }} />
              </div>
              <h2 id="recs-heading" className="section-title" style={{ textAlign: 'center' }}>
                Recommendations
              </h2>
              <p style={{ color: 'var(--text-muted)', maxWidth: 360, textAlign: 'center', fontSize: '0.95rem' }}>
                Select a movie from the Discover section to see personalised genre-based recommendations.
              </p>
              <button className="btn btn--ghost" onClick={onBackToDiscover}>
                <Film size={15} />
                Browse Movies
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Selected movie header */}
            <div className="recs__header">
              <div className="recs__selected-movie">
                <p className="recs__selected-label">
                  <Sparkles size={11} style={{ display: 'inline', marginRight: 4 }} />
                  Recommendations for
                </p>
                <h2 id="recs-heading" className="recs__selected-title">
                  {selectedMovie.title}
                </h2>
                <div className="recs__selected-genres">
                  {(selectedMovie.genres || []).map(g => (
                    <span key={g} className="genre-tag">{g}</span>
                  ))}
                </div>
                {recMode && (
                  <p style={{ marginTop: 8, fontSize: '0.75rem', color: recMode === 'demo' ? 'var(--accent-secondary)' : 'var(--accent-electric)' }}>
                    {recMode === 'demo'
                      ? '⚡ Demo data — start the Flask API for live KNN results'
                      : '✓ Live KNN results from the MovieRecommender'}
                  </p>
                )}
              </div>

              <div className="recs__actions">
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => loadRecs(selectedMovie.title)}
                  disabled={loading}
                  aria-label="Refresh recommendations"
                >
                  <RefreshCw size={13} className={loading ? 'spin' : ''} />
                  Refresh
                </button>
                <button className="btn btn--outline btn--sm" onClick={onBackToDiscover}>
                  <ArrowLeft size={13} />
                  Pick Another
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="error-banner" role="alert" style={{ marginBottom: 'var(--space-xl)' }}>
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Loading skeletons */}
            {loading && <LoadingGrid count={10} />}

            {/* Results */}
            {!loading && !error && (
              <>
                {recs.length === 0 ? (
                  <div className="recs__empty" role="status">
                    <Film size={48} />
                    <p>No recommendations could be generated for this title.</p>
                    <button className="btn btn--ghost btn--sm" onClick={onBackToDiscover}>
                      Browse other movies
                    </button>
                  </div>
                ) : (
                  <>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 'var(--space-lg)' }}>
                      Movies You May Like
                    </p>
                    <div className="movies-grid" role="list" aria-label="Recommended movies">
                      {recs.map(rec => (
                        <MovieCard
                          key={rec.movieId}
                          movie={rec}
                          onSelect={onSelectMovie}
                          onDetail={onOpenDetail}
                          isSelected={false}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </section>
  );
}
