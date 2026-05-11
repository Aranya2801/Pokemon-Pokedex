import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTeam } from '@context/TeamContext'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/pokedex', label: 'Pokédex', icon: '📖' },
  { path: '/team-builder', label: 'Team', icon: '⚔️' },
  { path: '/battle', label: 'Battle', icon: '🥊' },
  { path: '/type-chart', label: 'Types', icon: '📊' },
  { path: '/moves', label: 'Moves', icon: '💫' },
  { path: '/compare', label: 'Compare', icon: '⚖️' },
  { path: '/favorites', label: 'Favorites', icon: '❤️' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currentTeam } = useTeam()
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  return (
    <motion.nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.pokeballIcon}>⬤</span>
          <span className={styles.logoText}>PokéDex <span className={styles.logoPro}>Pro</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.desktopNav} aria-label="Main navigation">
          {NAV_LINKS.map(({ path, label, icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>{icon}</span>
              <span className={styles.navLabel}>{label}</span>
              {path === '/team-builder' && currentTeam.length > 0 && (
                <span className={styles.teamBadge}>{currentTeam.length}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span className={mobileOpen ? styles.barOpen : styles.bar} />
          <span className={mobileOpen ? styles.barOpen2 : styles.bar} />
          <span className={mobileOpen ? styles.barOpen3 : styles.bar} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {NAV_LINKS.map(({ path, label, icon }, i) => (
              <motion.div
                key={path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <NavLink
                  to={path}
                  end={path === '/'}
                  className={({ isActive }) =>
                    `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`
                  }
                >
                  <span>{icon}</span> {label}
                  {path === '/team-builder' && currentTeam.length > 0 && (
                    <span className={styles.teamBadge}>{currentTeam.length}</span>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
