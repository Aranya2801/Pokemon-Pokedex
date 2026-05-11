import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePokemonBatch } from '@hooks/usePokemon'
import { getSpriteUrl, TYPE_COLORS } from '@utils/pokeapi'
import styles from './Home.module.css'

const FEATURED_IDS = [6, 25, 149, 150, 151, 384, 445, 483, 487, 718, 800, 888]
const QUICK_LINKS = [
  { to: '/pokedex', icon: '📖', title: 'Full Pokédex', desc: '1025+ Pokémon with live data', color: '#ff3b3b' },
  { to: '/team-builder', icon: '⚔️', title: 'Team Builder', desc: 'Build & analyze your team', color: '#ffd700' },
  { to: '/battle', icon: '🥊', title: 'Battle Sim', desc: 'Simulate Pokémon battles', color: '#f97316' },
  { to: '/type-chart', icon: '📊', title: 'Type Chart', desc: 'Full type effectiveness grid', color: '#4fc3f7' },
  { to: '/moves', icon: '💫', title: 'Moves Dex', desc: 'Every move, power, and effect', color: '#a855f7' },
  { to: '/compare', icon: '⚖️', title: 'Compare', desc: 'Side-by-side stat comparison', color: '#22c55e' },
]

const STATS_DISPLAY = [
  { value: '1,025+', label: 'Pokémon' },
  { value: '920+', label: 'Moves' },
  { value: '298+', label: 'Abilities' },
  { value: '9', label: 'Generations' },
]

export default function Home() {
  const [spotlightIdx, setSpotlightIdx] = useState(0)
  const { data: featured } = usePokemonBatch(FEATURED_IDS)

  useEffect(() => {
    const interval = setInterval(() => {
      setSpotlightIdx(i => (i + 1) % FEATURED_IDS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const spotlightPokemon = featured?.[spotlightIdx]
  const spotlightType = spotlightPokemon?.types?.[0]?.type?.name || 'normal'
  const spotlightColor = TYPE_COLORS[spotlightType] || '#A8A878'

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          {/* Left: Text */}
          <motion.div
            className={styles.heroText}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className={styles.heroBadge}>✦ The Most Advanced Pokédex</span>
            <h1 className={styles.heroTitle}>
              Explore Every<br />
              <span className="gradient-text">Pokémon Ever</span><br />
              Created
            </h1>
            <p className={styles.heroDesc}>
              A production-grade Pokédex powered by live PokeAPI data. 
              Search 1,025+ Pokémon, build competitive teams, simulate battles, 
              analyze type matchups, and dive deep into every stat, move, and ability.
            </p>
            <div className={styles.heroCTAs}>
              <Link to="/pokedex" className={styles.ctaPrimary}>
                Open Pokédex →
              </Link>
              <Link to="/team-builder" className={styles.ctaSecondary}>
                Build a Team
              </Link>
            </div>

            {/* Stats row */}
            <div className={styles.statsRow}>
              {STATS_DISPLAY.map(({ value, label }) => (
                <div key={label} className={styles.statItem}>
                  <span className={styles.statValue}>{value}</span>
                  <span className={styles.statLabel}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Spotlight */}
          <motion.div
            className={styles.heroRight}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div
              className={styles.spotlight}
              style={{ '--spotlight-color': spotlightColor }}
            >
              <div className={styles.spotlightGlow} />
              {spotlightPokemon && (
                <motion.div
                  key={spotlightPokemon.id}
                  className={styles.spotlightContent}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <Link to={`/pokemon/${spotlightPokemon.id}`}>
                    <motion.img
                      src={getSpriteUrl(spotlightPokemon.id, 'official-artwork')}
                      alt={spotlightPokemon.name}
                      className={styles.spotlightImg}
                      animate={{ y: [0, -12, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </Link>
                  <div className={styles.spotlightInfo}>
                    <span className={styles.spotlightId}>
                      #{String(spotlightPokemon.id).padStart(4, '0')}
                    </span>
                    <span className={styles.spotlightName}>
                      {spotlightPokemon.name.replace(/-/g, ' ')}
                    </span>
                    <div className={styles.spotlightDots}>
                      {FEATURED_IDS.map((_, i) => (
                        <button
                          key={i}
                          className={`${styles.dot} ${i === spotlightIdx ? styles.dotActive : ''}`}
                          onClick={() => setSpotlightIdx(i)}
                          aria-label={`View spotlight ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className={styles.quickLinks}>
        <div className="container">
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Explore Features
          </motion.h2>
          <div className={styles.quickGrid}>
            {QUICK_LINKS.map(({ to, icon, title, desc, color }, i) => (
              <motion.div
                key={to}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <Link to={to} className={styles.quickCard} style={{ '--card-color': color }}>
                  <span className={styles.quickIcon}>{icon}</span>
                  <h3 className={styles.quickTitle}>{title}</h3>
                  <p className={styles.quickDesc}>{desc}</p>
                  <span className={styles.quickArrow}>→</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Row */}
      <section className={styles.featuredSection}>
        <div className="container">
          <motion.h2
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Fan Favourites
          </motion.h2>
          <div className={styles.featuredRow}>
            {featured?.slice(0, 6).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.08, y: -8 }}
              >
                <Link to={`/pokemon/${p.id}`} className={styles.miniCard}>
                  <img
                    src={getSpriteUrl(p.id, 'official-artwork')}
                    alt={p.name}
                    className={styles.miniSprite}
                    loading="lazy"
                  />
                  <span className={styles.miniName}>{p.name.replace(/-/g, ' ')}</span>
                  <span className={styles.miniId}>#{p.id}</span>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className={styles.viewAllWrap}>
            <Link to="/pokedex" className={styles.viewAll}>
              View All 1,025+ Pokémon →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
