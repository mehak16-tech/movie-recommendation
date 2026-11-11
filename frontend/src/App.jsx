/**
 * App.jsx – Root application component.
 *
 * The Discover section owns the single live search input. Movie selection
 * flows into the recommendations section, which fetches the selected title.
 */
import { useState, useCallback, useEffect } from 'react';
import { isApiAvailable } from './api';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import DiscoverSection from './components/DiscoverSection';
import RecommendationsSection from './components/RecommendationsSection';
import MovieDetailModal from './components/MovieDetailModal';
import Footer from './components/Footer';

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [detailMovie, setDetailMovie] = useState(null);
  const [apiMode, setApiMode] = useState(null);

  // Detect API mode on mount
  useEffect(() => {
    isApiAvailable().then(live => setApiMode(live ? 'live' : 'demo'));
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const ids = ['home', 'discover', 'recommend'];
    const observers = ids.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  // Nav click → scroll to section
  function handleNavClick(section) {
    setActiveSection(section);
    scrollToSection(section);
  }

  // Selecting a movie from any card
  const handleSelectMovie = useCallback((movie) => {
    setSelectedMovie(movie);
    scrollToSection('recommend');
  }, []);

  // Open detail modal
  const handleOpenDetail = useCallback((movie) => {
    setDetailMovie(movie);
  }, []);

  // Get recommendations from detail modal
  function handleGetRecommendations(movie) {
    setSelectedMovie(movie);
    scrollToSection('recommend');
  }

  return (
    <>
      {/* Demo mode banner */}
      {apiMode === 'demo' && (
        <div className="demo-banner" role="status">
          <span>⚡</span>
          <span>
            <strong>Demo mode</strong> — showing sample data.
            Start the Flask API (<code>backend/api/app.py</code>) for live KNN recommendations.
          </span>
        </div>
      )}

      <Navbar
        onNavClick={handleNavClick}
        activeSection={activeSection}
      />

      <main style={{ paddingTop: '68px' }}>
        <HeroSection
          onExplore={() => scrollToSection('discover')}
        />

        <DiscoverSection
          selectedMovie={selectedMovie}
          onSelectMovie={handleSelectMovie}
          onOpenDetail={handleOpenDetail}
        />

        <RecommendationsSection
          selectedMovie={selectedMovie}
          onSelectMovie={handleSelectMovie}
          onOpenDetail={handleOpenDetail}
          onBackToDiscover={() => scrollToSection('discover')}
        />
      </main>

      <Footer mode={apiMode} />

      {/* Movie detail modal */}
      {detailMovie && (
        <MovieDetailModal
          movie={detailMovie}
          onClose={() => setDetailMovie(null)}
          onGetRecommendations={handleGetRecommendations}
        />
      )}
    </>
  );
}
