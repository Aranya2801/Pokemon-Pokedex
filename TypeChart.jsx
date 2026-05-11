import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TYPE_COLORS, TYPE_ICONS, calculateTypeEffectiveness } from '@utils/pokeapi'
import styles from './TypeChart.module.css'

const TYPES = ['normal','fire','water','electric','grass','ice','fighting','poison',
  'ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy']

function MultiplierCell({ mult }) {
  if (mult === 0)    return <span className={`${styles.cell} ${styles.immune}`}>0</span>
  if (mult === 0.25) return <span className={`${styles.cell} ${styles.quarter}`}>¼</span>
  if (mult === 0.5)  return <span className={`${styles.cell} ${styles.half}`}>½</span>
  if (mult === 1)    return <span className={`${styles.cell} ${styles.neutral}`}>1</span>
  if (mult === 2)    return <span className={`${styles.cell} ${styles.super2}`}>2</span>
  if (mult === 4)    return <span className={`${styles.cell} ${styles.super4}`}>4</span>
  return <span className={styles.cell}>{mult}</span>
}

export default function TypeChart() {
  const [mode, setMode] = useState('offense') // offense or defense
  const [highlight, setHighlight] = useState(null)

  return (
    <div className={styles.page}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={styles.title}>Type Effectiveness Chart</h1>
          <p className={styles.subtitle}>Full Gen IX type matchup grid — all 18 types</p>
        </motion.div>

        <div className={styles.legend}>
          <div className={styles.legendItem}><span className={`${styles.legendBox} ${styles.super4}`}>4×</span>Super Effective ×4</div>
          <div className={styles.legendItem}><span className={`${styles.legendBox} ${styles.super2}`}>2×</span>Super Effective ×2</div>
          <div className={styles.legendItem}><span className={`${styles.legendBox} ${styles.neutral}`}>1×</span>Normal Damage</div>
          <div className={styles.legendItem}><span className={`${styles.legendBox} ${styles.half}`}>½×</span>Not Very Effective</div>
          <div className={styles.legendItem}><span className={`${styles.legendBox} ${styles.quarter}`}>¼×</span>Very Weak</div>
          <div className={styles.legendItem}><span className={`${styles.legendBox} ${styles.immune}`}>0×</span>Immune</div>
        </div>

        <div className={styles.tableWrapper}>
          <motion.div
            className={styles.tableScroll}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.cornerCell}>
                    <span className={styles.atk}>ATK ↓</span>
                    <span className={styles.def}>DEF →</span>
                  </th>
                  {TYPES.map(def => (
                    <th
                      key={def}
                      className={styles.headerCell}
                      style={{ '--type-col': TYPE_COLORS[def] }}
                      onMouseEnter={() => setHighlight(def)}
                      onMouseLeave={() => setHighlight(null)}
                    >
                      <span className={styles.typeIcon}>{TYPE_ICONS[def]}</span>
                      <span className={styles.typeLabel}>{def.slice(0, 3).toUpperCase()}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TYPES.map(atk => (
                  <tr key={atk}>
                    <td
                      className={styles.rowHeader}
                      style={{ '--type-row': TYPE_COLORS[atk] }}
                    >
                      <span className={styles.typeIcon}>{TYPE_ICONS[atk]}</span>
                      <span className={styles.rowLabel}>{atk}</span>
                    </td>
                    {TYPES.map(def => {
                      const mult = calculateTypeEffectiveness(atk, [def])
                      return (
                        <td
                          key={def}
                          className={`${styles.dataCell} ${highlight === def ? styles.highlighted : ''}`}
                        >
                          <MultiplierCell mult={mult} />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>

        {/* Type Lookup */}
        <div className={styles.lookup}>
          <h2 className={styles.lookupTitle}>Quick Type Lookup</h2>
          <div className={styles.lookupGrid}>
            {TYPES.map(type => {
              const weaknesses = TYPES.filter(atk => calculateTypeEffectiveness(atk, [type]) === 2)
              const resistances = TYPES.filter(atk => calculateTypeEffectiveness(atk, [type]) === 0.5)
              const immunities = TYPES.filter(atk => calculateTypeEffectiveness(atk, [type]) === 0)
              return (
                <div key={type} className={styles.lookupCard} style={{ '--lc-color': TYPE_COLORS[type] }}>
                  <div className={styles.lookupHeader} style={{ background: TYPE_COLORS[type] }}>
                    <span>{TYPE_ICONS[type]}</span>
                    <span className={styles.lookupTypeName}>{type}</span>
                  </div>
                  <div className={styles.lookupBody}>
                    {weaknesses.length > 0 && (
                      <div className={styles.lookupRow}>
                        <span className={styles.lookupLabel} style={{ color: '#ff3b3b' }}>Weak ×2</span>
                        <div className={styles.lookupTypes}>
                          {weaknesses.map(t => <span key={t} style={{ color: TYPE_COLORS[t], fontSize: 11, fontFamily: 'Oxanium', fontWeight: 600 }}>{t}</span>)}
                        </div>
                      </div>
                    )}
                    {resistances.length > 0 && (
                      <div className={styles.lookupRow}>
                        <span className={styles.lookupLabel} style={{ color: '#22c55e' }}>Resists</span>
                        <div className={styles.lookupTypes}>
                          {resistances.map(t => <span key={t} style={{ color: TYPE_COLORS[t], fontSize: 11, fontFamily: 'Oxanium', fontWeight: 600 }}>{t}</span>)}
                        </div>
                      </div>
                    )}
                    {immunities.length > 0 && (
                      <div className={styles.lookupRow}>
                        <span className={styles.lookupLabel} style={{ color: '#4fc3f7' }}>Immune</span>
                        <div className={styles.lookupTypes}>
                          {immunities.map(t => <span key={t} style={{ color: TYPE_COLORS[t], fontSize: 11, fontFamily: 'Oxanium', fontWeight: 600 }}>{t}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
