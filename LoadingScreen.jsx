import React from 'react'
import { motion } from 'framer-motion'
import styles from './LoadingScreen.module.css'

export default function LoadingScreen({ message = 'Loading Pokémon data...' }) {
  return (
    <motion.div
      className={styles.screen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.content}>
        {/* Animated Pokeball */}
        <div className={styles.pokeball}>
          <div className={styles.pokeballTop} />
          <div className={styles.pokeballMiddle}>
            <div className={styles.pokeballButton} />
          </div>
          <div className={styles.pokeballBottom} />
        </div>

        <motion.p
          className={styles.message}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {message}
        </motion.p>

        {/* Loading dots */}
        <div className={styles.dots}>
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              className={styles.dot}
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
