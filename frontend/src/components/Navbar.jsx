/**
 * Navbar component with responsive hamburger menu.
 *
 * Search is intentionally kept on the Discover page so the application has
 * one authoritative filter and no duplicate search controls.
 */
import { useState, useEffect } from 'react';
import { Home, Compass, Star, X, Menu } from 'lucide-react';

export default function Navbar({ onNavClick, activeSection }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  function handleNavLink(section) {
    setMobileOpen(false);
    onNavClick(section);
  }

  const navLinks = [
    { id: 'home',      label: 'Home',             icon: <Home size={14} /> },
    { id: 'discover',  label: 'Discover Movies',  icon: <Compass size={14} /> },
    { id: 'recommend', label: 'Recommendations',  icon: <Star size={14} /> },
  ];

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="navbar__inner">
          {/* Logo */}
          <button
            className="navbar__logo"
            onClick={() => handleNavLink('home')}
            aria-label="CineMatch – go to home"
          >
            <div className="navbar__logo-icon" aria-hidden="true">🎬</div>
            <span className="navbar__logo-text">CineMatch</span>
          </button>

          {/* Desktop nav links */}
          <div className="navbar__nav" role="list">
            {navLinks.map(link => (
              <button
                key={link.id}
                role="listitem"
                className={`navbar__nav-link${activeSection === link.id ? ' active' : ''}`}
                onClick={() => handleNavLink(link.id)}
                aria-current={activeSection === link.id ? 'page' : undefined}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Hamburger */}
          <button
            className="navbar__hamburger"
            onClick={() => setMobileOpen(v => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`navbar__mobile-menu${mobileOpen ? ' open' : ''}`}
        role="navigation"
        aria-label="Mobile navigation"
      >
        {navLinks.map(link => (
          <button
            key={link.id}
            className={`navbar__nav-link${activeSection === link.id ? ' active' : ''}`}
            onClick={() => handleNavLink(link.id)}
            aria-current={activeSection === link.id ? 'page' : undefined}
            style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {link.icon} {link.label}
          </button>
        ))}
      </div>
    </>
  );
}
