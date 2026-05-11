import React from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { usePokemonBatch } from '@hooks/usePokemon'
import { usePokemonContext } from '@context/PokemonContext'
import PokemonCard from '@components/PokemonCard'
import styles from './Favorites.module.css'

export default function Favorites() {
  const { favorites, toggleFavorite } = usePokemonContext()
  const { data: pokemonList, isLoading } = usePokemonBatch(favorites, {
    enabled: favorites.length > 0,
  })

  return (
    <div className={styles.page}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.header}
        >
          <div>
            <h1 className={styles.title}>❤️ My Favourites</h1>
            <p className={styles.subtitle}>
              {favorites.length === 0
                ? 'No favourites yet — browse the Pokédex to add some!'
                : `${favorites.length} Pokémon saved`}
            </p>
          </div>
          {favorites.length > 0 && (
            <button
              className={styles.clearBtn}
              onClick={() => favorites.forEach(id => toggleFavorite(id))}
            >
              Clear All
            </button>
          )}
        </motion.div>

        {favorites.length === 0 ? (
          <motion.div
            className={styles.empty}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className={styles.emptyIcon}>🤍</div>
            <h2 className={styles.emptyTitle}>No favourites yet</h2>
            <p className={styles.emptyDesc}>
              Browse the Pokédex and tap the heart icon on any Pokémon card to save it here.
            </p>
            <Link to="/pokedex" className={styles.browseCta}>
              Browse Pokédex →
            </Link>
          </motion.div>
        ) : isLoading ? (
          <div className={styles.loading}>
            <p>Loading your favourites...</p>
          </div>
        ) : (
          <div className={styles.grid}>
            <AnimatePresence>
              {pokemonList?.map((pokemon, i) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
