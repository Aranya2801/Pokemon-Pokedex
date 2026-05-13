import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TYPE_COLORS, TYPE_ICONS, getSpriteUrl } from '@utils/pokeapi'
import { usePokemonContext } from '@context/PokemonContext'
import { useTeam } from '@context/TeamContext'
import styles from './PokemonCard.module.css'

export default function PokemonCard({ pokemon, index = 0, variant = 'default' }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { toggleFavorite, isFavorite, settings } = usePokemonContext()
  const { addToTeam, isOnTeam, currentTeam, MAX_TEAM } = useTeam()

  if (!pokemon) return null

  const id = pokemon.id
  const name = pokemon.name
  const types = pokemon.types?.map(t => t.type.name) || []
  const primaryType = types[0] || 'normal'
  const typeColor = TYPE_COLORS[primaryType] || '#A8A878'
  const spriteUrl = settings.showShiny
    ? getSpriteUrl(id, 'shiny')
    : getSpriteUrl(id, 'official-artwork')

  const statTotal = pokemon.stats?.reduce((sum, s) => sum + s.base_stat, 0) || 0
  const fav = isFavorite(id)
  const onTeam = isOnTeam(id)
  const teamFull = currentTeam.length >= MAX_TEAM && !onTeam

  function handleFav(e) {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(id)
  }

  function handleAddTeam(e) {
    e.preventDefault()
    e.stopPropagation()
    addToTeam(pokemon)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.5) }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={styles.cardWrapper}
    >
      <Link to={`/pokemon/${id}`} className={styles.card} style={{ '--type-color': typeColor }}>
        {/* Background glow */}
        <div className={styles.glow} style={{ background: `radial-gradient(ellipse at center, ${typeColor}22 0%, transparent 70%)` }} />

        {/* ID */}
        <span className={styles.pokemonId}>#{String(id).padStart(4, '0')}</span>

        {/* Action buttons */}
        <div className={styles.actions}>
          <button
            onClick={handleFav}
            className={`${styles.actionBtn} ${fav ? styles.favActive : ''}`}
            title={fav ? 'Remove from favorites' : 'Add to favorites'}
          >
            {fav ? '❤️' : '🤍'}
          </button>
          {!teamFull && (
            <button
              onClick={handleAddTeam}
              className={`${styles.actionBtn} ${onTeam ? styles.teamActive : ''}`}
              title={onTeam ? 'On team' : 'Add to team'}
            >
              {onTeam ? '⚔️' : '+'}
            </button>
          )}
        </div>

        {/* Sprite */}
        <div className={styles.spriteContainer}>
          {!imgLoaded && <div className={`skeleton ${styles.spriteSkeleton}`} />}
          <motion.img
            src={spriteUrl}
            alt={name}
            className={styles.sprite}
            onLoad={() => setImgLoaded(true)}
            style={{ opacity: imgLoaded ? 1 : 0 }}
            animate={isHovered ? { scale: 1.12, rotate: [-2, 2, -2, 0] } : { scale: 1 }}
            transition={{ duration: 0.4 }}
            loading="lazy"
          />
        </div>

        {/* Info */}
        <div className={styles.info}>
          <h3 className={styles.name}>{name.replace(/-/g, ' ')}</h3>

          <div className={styles.types}>
            {types.map(type => (
              <span
                key={type}
                className={`type-badge ${styles.typeBadge}`}
                style={{ background: TYPE_COLORS[type] }}
              >
                {TYPE_ICONS[type]} {type}
              </span>
            ))}
          </div>

          {/* Mini stats */}
          <div className={styles.statRow}>
            <span className={styles.statLabel}>BST</span>
            <div className={styles.statBar}>
              <motion.div
                className={styles.statFill}
                style={{ background: typeColor }}
                initial={{ width: 0 }}
                animate={isHovered ? { width: `${Math.min((statTotal / 720) * 100, 100)}%` } : { width: `${Math.min((statTotal / 720) * 100, 100)}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
            <span className={styles.statValue}>{statTotal}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
