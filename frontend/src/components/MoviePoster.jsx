/**
 * MoviePoster – renders a poster image or a styled placeholder.
 *
 * The MovieLens dataset does not include poster URLs, so this provides a
 * deterministic branded fallback without presenting genre data as artwork.
 */
import { Film } from 'lucide-react';

// Deterministic hue offset from movieId for visual variety
function hueFromId(id) {
  return (id * 83) % 360;
}

export default function MoviePoster({ movie, style = {}, className = '' }) {
  const hue = hueFromId(movie.movieId);
  return (
    <div
      className={`movie-card__poster-placeholder ${className}`}
      style={{
        background: `linear-gradient(145deg, hsl(${hue}, 35%, 14%) 0%, hsl(${(hue + 40) % 360}, 30%, 10%) 100%)`,
        borderBottom: `1px solid hsl(${hue}, 50%, 25%)`,
        ...style,
      }}
      aria-hidden="true"
    >
      <div style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: `hsl(${hue}, 60%, 22%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        border: `1px solid hsl(${hue}, 50%, 30%)`,
      }}>
        <Film size={24} style={{ color: `hsl(${hue}, 70%, 65%)`, opacity: 0.8 }} />
      </div>
      <span className="movie-card__poster-brand">CineMatch</span>
    </div>
  );
}
