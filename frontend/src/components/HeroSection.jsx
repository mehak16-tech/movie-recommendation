/**
 * HeroSection – cinematic landing hero.
 *
 * The single application search lives on the Discover page.
 */
import { Sparkles, ChevronDown, Compass } from 'lucide-react';

// Sample floating mini-cards shown on the right of the hero (decorative)
const FLOATING_CARDS = [
  { title: 'Pulp Fiction', year: 1994, genres: ['Crime', 'Thriller'] },
  { title: 'Inception', year: 2010, genres: ['Sci-Fi', 'Action'] },
  { title: 'The Lion King', year: 1994, genres: ['Animation', 'Drama'] },
];

export default function HeroSection({ onExplore }) {
  return (
    <section id="home" className="hero" aria-labelledby="hero-heading">
      {/* Atmospheric background */}
      <div className="hero__bg-orbs" aria-hidden="true">
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__orb hero__orb--3" />
      </div>
      <div className="hero__grid-overlay" aria-hidden="true" />

      <div className="container" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', width: '100%', gap: 48 }}>
        {/* Content */}
        <div className="hero__content">
          <div className="hero__badge">
            <Sparkles size={12} aria-hidden="true" />
            KNN Genre-Similarity Recommendations
          </div>

          <h1 id="hero-heading" className="hero__title">
            Find Your Next<br />
            <span className="hero__title-gradient">Favorite Movie</span>
          </h1>

          <p className="hero__subtitle">
            Discover films you'll love using an intelligent K-Nearest Neighbours recommendation engine built on the MovieLens dataset.
          </p>

          <div className="hero__cta">
            <button className="btn btn--primary btn--lg" onClick={onExplore} id="explore-btn">
              <Compass size={17} aria-hidden="true" />
              Explore Movies
            </button>
            <button
              className="btn btn--outline"
              onClick={() => document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label="Scroll to discover section"
            >
              <ChevronDown size={16} aria-hidden="true" />
              Browse All
            </button>
          </div>
        </div>

        {/* Floating decorative mini-cards */}
        <div className="hero__floating-cards" aria-hidden="true">
          {FLOATING_CARDS.map((card, i) => (
            <div key={i} className="hero__mini-card" style={{ animationDelay: `${i * 2}s` }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {card.title}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{card.year}</div>
              <div className="mini-card__genres">
                {card.genres.map(g => (
                  <span key={g} className="genre-tag" style={{ fontSize: '0.62rem', padding: '2px 7px' }}>{g}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
