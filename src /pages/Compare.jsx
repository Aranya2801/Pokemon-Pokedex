// Compare.jsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { usePokemon } from '@hooks/usePokemon'
import { TYPE_COLORS, STAT_LABELS, getSpriteUrl } from '@utils/pokeapi'
import styles from './Compare.module.css'

function PokePicker({ label, onSelect, selected }) {
  const [val, setVal] = useState('')
  const [trigger, setTrigger] = useState(null)
  const { data } = usePokemon(trigger, { onSuccess: onSelect, enabled: !!trigger })

  return (
    <div className={styles.picker}>
      <label className={styles.pickerLabel}>{label}</label>
      <div className={styles.pickerRow}>
        <input
          type="text" placeholder="Name or ID"
          value={val} onChange={e => setVal(e.target.value)}
          className={styles.pickerInput}
          onKeyDown={e => { if (e.key === 'Enter') setTrigger(val.toLowerCase().trim()) }}
        />
        <button className={styles.pickerBtn} onClick={() => setTrigger(val.toLowerCase().trim())}>→</button>
      </div>
      {selected && (
        <div className={styles.pickerPreview} style={{ '--pc': TYPE_COLORS[selected.types[0].type.name] }}>
          <img src={getSpriteUrl(selected.id, 'official-artwork')} alt={selected.name} className={styles.pickerSprite} />
          <div>
            <div className={styles.pickerName}>{selected.name.replace(/-/g, ' ')}</div>
            <div className={styles.pickerTypes}>
              {selected.types.map(t => (
                <span key={t.type.name} className="type-badge" style={{ background: TYPE_COLORS[t.type.name], fontSize: '9px', padding: '1px 7px' }}>{t.type.name}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Compare() {
  const [pokeA, setPokeA] = useState(null)
  const [pokeB, setPokeB] = useState(null)

  const allStats = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed']

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Pokémon Comparator</h1>
        <p className={styles.subtitle}>Compare any two Pokémon side-by-side</p>

        <div className={styles.pickers}>
          <PokePicker label="Pokémon A" onSelect={setPokeA} selected={pokeA} />
          <div className={styles.vsLabel}>VS</div>
          <PokePicker label="Pokémon B" onSelect={setPokeB} selected={pokeB} />
        </div>

        {pokeA && pokeB && (
          <motion.div className={styles.comparison} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className={styles.compTitle}>Stat Comparison</h2>
            {allStats.map(stat => {
              const sA = pokeA.stats.find(s => s.stat.name === stat)?.base_stat || 0
              const sB = pokeB.stats.find(s => s.stat.name === stat)?.base_stat || 0
              const max = Math.max(sA, sB, 1)
              const label = STAT_LABELS[stat] || stat
              return (
                <div key={stat} className={styles.statCompRow}>
                  <div className={styles.statCompA}>
                    <span className={styles.statNum} style={{ color: sA > sB ? '#22c55e' : sA < sB ? '#ff3b3b' : '#9090b0' }}>{sA}</span>
                    <motion.div className={styles.barA} initial={{ width: 0 }} animate={{ width: `${(sA / max) * 100}%` }} transition={{ duration: 0.6 }}
                      style={{ background: TYPE_COLORS[pokeA.types[0].type.name] }} />
                  </div>
                  <span className={styles.statCompLabel}>{label}</span>
                  <div className={styles.statCompB}>
                    <motion.div className={styles.barB} initial={{ width: 0 }} animate={{ width: `${(sB / max) * 100}%` }} transition={{ duration: 0.6 }}
                      style={{ background: TYPE_COLORS[pokeB.types[0].type.name] }} />
                    <span className={styles.statNum} style={{ color: sB > sA ? '#22c55e' : sB < sA ? '#ff3b3b' : '#9090b0' }}>{sB}</span>
                  </div>
                </div>
              )
            })}

            <div className={styles.bstRow}>
              <span className={styles.bstNum}>{pokeA.stats.reduce((s, x) => s + x.base_stat, 0)}</span>
              <span className={styles.bstLabel}>Base Stat Total</span>
              <span className={styles.bstNum}>{pokeB.stats.reduce((s, x) => s + x.base_stat, 0)}</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
