/**
 * LoadingGrid – skeleton placeholder for movie cards during fetch.
 */
export default function LoadingGrid({ count = 12 }) {
  return (
    <div className="loading-grid" aria-busy="true" aria-label="Loading movies">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card" aria-hidden="true">
          <div className="skeleton skeleton--poster" />
          <div className="skeleton-card__body">
            <div className="skeleton skeleton--text" />
            <div className="skeleton skeleton--text skeleton--short" />
            <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
              <div className="skeleton skeleton--text" style={{ width: '45%', height: 18, borderRadius: 999 }} />
              <div className="skeleton skeleton--text" style={{ width: '40%', height: 18, borderRadius: 999 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
