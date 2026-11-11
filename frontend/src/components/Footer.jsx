/**
 * Footer component.
 */
export default function Footer({ mode }) {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__inner">
          <div>
            <div className="footer__brand">🎬 CineMatch</div>
            <p className="footer__desc">
              A KNN movie recommendation system powered by genre-similarity matching on the MovieLens dataset.
              Recommendations reflect shared genre features — not ratings, reviews, or cultural relevance.
            </p>
          </div>
          <div className="footer__note">
            <p>MovieLens Latest Small dataset</p>
            <p style={{ marginTop: 4 }}>
              Running in{' '}
              <strong style={{ color: mode === 'live' ? 'var(--accent-electric)' : 'var(--accent-secondary)' }}>
                {mode === 'live' ? 'Live API' : 'Demo'} mode
              </strong>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
