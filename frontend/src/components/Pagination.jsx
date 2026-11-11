/**
 * Pagination controls.
 */
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  // Show at most 5 page numbers
  function buildPageNumbers() {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);

    const nums = new Set([1, pages, page]);
    for (let d = -2; d <= 2; d++) {
      const p = page + d;
      if (p >= 1 && p <= pages) nums.add(p);
    }

    const sorted = [...nums].sort((a, b) => a - b);
    const withEllipsis = [];
    let prev = null;
    for (const n of sorted) {
      if (prev !== null && n - prev > 1) withEllipsis.push('…');
      withEllipsis.push(n);
      prev = n;
    }
    return withEllipsis;
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="pagination__btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {buildPageNumbers().map((n, i) =>
        n === '…' ? (
          <span key={`ellipsis-${i}`} style={{ color: 'var(--text-muted)', padding: '0 4px' }}>…</span>
        ) : (
          <button
            key={n}
            className={`pagination__btn${n === page ? ' active' : ''}`}
            onClick={() => onPageChange(n)}
            aria-label={`Page ${n}`}
            aria-current={n === page ? 'page' : undefined}
          >
            {n}
          </button>
        )
      )}

      <button
        className="pagination__btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
