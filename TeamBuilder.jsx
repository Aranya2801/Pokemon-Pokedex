import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { useTeam } from '@context/TeamContext'
import { TYPE_COLORS, TYPE_ICONS, getSpriteUrl, calculateTypeEffectiveness } from '@utils/pokeapi'
import styles from './TeamBuilder.module.css'

const ALL_TYPES = ['normal','fire','water','electric','grass','ice','fighting','poison',
  'ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy']

export default function TeamBuilder() {
  const { teams, activeTeam, setActiveTeam, currentTeam, removeFromTeam, clearTeam, createTeam, deleteTeam, swapPosition, MAX_TEAM } = useTeam()
  const [newTeamName, setNewTeamName] = useState('')
  const [showNewTeam, setShowNewTeam] = useState(false)
  const [reorderable, setReorderable] = useState([...currentTeam])

  // Update reorderable when team changes
  React.useEffect(() => {
    setReorderable([...currentTeam])
  }, [currentTeam.length, activeTeam])

  // Type coverage analysis
  const coverageAnalysis = useMemo(() => {
    if (!currentTeam.length) return { covered: [], weak: [], immune: [] }
    const teamTypes = currentTeam.flatMap(p => p.types.map(t => t.type.name))

    const covered = ALL_TYPES.filter(atk =>
      teamTypes.some(def => {
        const mult = calculateTypeEffectiveness(atk, [def])
        return mult > 1
      })
    )

    const weak = ALL_TYPES.filter(atk =>
      currentTeam.every(p => {
        const defTypes = p.types.map(t => t.type.name)
        const mult = calculateTypeEffectiveness(atk, defTypes)
        return mult >= 1
      }) && !currentTeam.some(p => {
        const defTypes = p.types.map(t => t.type.name)
        return calculateTypeEffectiveness(atk, defTypes) < 1
      })
    )

    const immune = ALL_TYPES.filter(atk =>
      currentTeam.some(p => {
        const defTypes = p.types.map(t => t.type.name)
        return calculateTypeEffectiveness(atk, defTypes) === 0
      })
    )

    return { covered, weak, immune }
  }, [currentTeam])

  // Stat averages
  const statAverages = useMemo(() => {
    if (!currentTeam.length) return {}
    const statNames = ['hp','attack','defense','special-attack','special-defense','speed']
    return statNames.reduce((acc, stat) => {
      const avg = Math.round(currentTeam.reduce((sum, p) => {
        const s = p.stats.find(s => s.stat.name === stat)
        return sum + (s?.base_stat || 0)
      }, 0) / currentTeam.length)
      acc[stat] = avg
      return acc
    }, {})
  }, [currentTeam])

  function handleCreateTeam() {
    if (!newTeamName.trim()) return
    createTeam(newTeamName.trim())
    setNewTeamName('')
    setShowNewTeam(false)
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={styles.title}>Team Builder</h1>
          <p className={styles.subtitle}>Build, analyze, and optimize your competitive team</p>
        </motion.div>

        {/* Team Selector */}
        <div className={styles.teamSelector}>
          {Object.keys(teams).map(name => (
            <button
              key={name}
              className={`${styles.teamTab} ${activeTeam === name ? styles.teamTabActive : ''}`}
              onClick={() => setActiveTeam(name)}
            >
              {name} ({teams[name]?.length || 0}/{MAX_TEAM})
              {Object.keys(teams).length > 1 && (
                <span
                  className={styles.deleteTeam}
                  onClick={e => { e.stopPropagation(); deleteTeam(name) }}
                  title="Delete team"
                >✕</span>
              )}
            </button>
          ))}
          <button className={styles.newTeamBtn} onClick={() => setShowNewTeam(s => !s)}>
            + New Team
          </button>
        </div>

        <AnimatePresence>
          {showNewTeam && (
            <motion.div
              className={styles.newTeamForm}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <input
                type="text"
                placeholder="Team name..."
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreateTeam()}
                className={styles.teamInput}
                autoFocus
              />
              <button className={styles.createBtn} onClick={handleCreateTeam}>Create</button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.layout}>
          {/* Team Slots */}
          <div className={styles.teamSection}>
            <div className={styles.slotsHeader}>
              <h2 className={styles.sectionTitle}>
                {activeTeam} — {currentTeam.length}/{MAX_TEAM}
              </h2>
              {currentTeam.length > 0 && (
                <button className={styles.clearBtn} onClick={clearTeam}>Clear All</button>
              )}
            </div>

            <div className={styles.slotsGrid}>
              {Array.from({ length: MAX_TEAM }).map((_, i) => {
                const poke = currentTeam[i]
                return (
                  <motion.div
                    key={poke ? poke.id : `empty-${i}`}
                    className={`${styles.slot} ${poke ? styles.slotFilled : styles.slotEmpty}`}
                    style={poke ? { '--slot-color': TYPE_COLORS[poke.types?.[0]?.type?.name] } : {}}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    {poke ? (
                      <>
                        <div className={styles.slotGlow} />
                        <Link to={`/pokemon/${poke.id}`}>
                          <motion.img
                            src={getSpriteUrl(poke.id, 'official-artwork')}
                            alt={poke.name}
                            className={styles.slotSprite}
                            whileHover={{ scale: 1.1, rotate: [-3, 3, 0] }}
                            transition={{ duration: 0.3 }}
                          />
                        </Link>
                        <div className={styles.slotInfo}>
                          <span className={styles.slotId}>#{poke.id}</span>
                          <span className={styles.slotName}>{poke.name.replace(/-/g, ' ')}</span>
                          <div className={styles.slotTypes}>
                            {poke.types.map(t => (
                              <span key={t.type.name} className="type-badge"
                                style={{ background: TYPE_COLORS[t.type.name], fontSize: '9px', padding: '1px 6px' }}>
                                {t.type.name}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeFromTeam(poke.id)}
                          title="Remove"
                        >✕</button>
                      </>
                    ) : (
                      <div className={styles.emptySlot}>
                        <span className={styles.emptySlotNum}>{i + 1}</span>
                        <span className={styles.emptySlotText}>
                          <Link to="/pokedex" className={styles.addLink}>+ Add Pokémon</Link>
                        </span>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>

            <div className={styles.addHint}>
              <span>💡 Browse the <Link to="/pokedex" className={styles.hintLink}>Pokédex</Link> and click + to add to your team</span>
            </div>
          </div>

          {/* Analysis Panel */}
          {currentTeam.length > 0 && (
            <div className={styles.analysisPanel}>
              {/* Type Coverage */}
              <div className={styles.analysisCard}>
                <h3 className={styles.analysisTitle}>⚡ Type Coverage</h3>
                <div className={styles.coverageSection}>
                  <p className={styles.coverageLabel}>Super Effective Against</p>
                  <div className={styles.typeChips}>
                    {coverageAnalysis.covered.map(t => (
                      <span key={t} className="type-badge" style={{ background: TYPE_COLORS[t], fontSize: '10px', padding: '2px 8px' }}>
                        {TYPE_ICONS[t]} {t}
                      </span>
                    ))}
                  </div>
                </div>
                {coverageAnalysis.immune.length > 0 && (
                  <div className={styles.coverageSection}>
                    <p className={styles.coverageLabel}>Immunities</p>
                    <div className={styles.typeChips}>
                      {coverageAnalysis.immune.map(t => (
                        <span key={t} className="type-badge" style={{ background: '#22c55e', fontSize: '10px', padding: '2px 8px' }}>
                          {t} 0×
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className={styles.coverageSection}>
                  <p className={styles.coverageLabel} style={{ color: '#ff3b3b' }}>⚠ Team Weaknesses</p>
                  <div className={styles.typeChips}>
                    {coverageAnalysis.weak.length > 0 ? coverageAnalysis.weak.map(t => (
                      <span key={t} className="type-badge" style={{ background: '#ff3b3b', fontSize: '10px', padding: '2px 8px' }}>
                        {t}
                      </span>
                    )) : <span className={styles.noWeak}>✓ No shared weaknesses!</span>}
                  </div>
                </div>
              </div>

              {/* Stat Averages */}
              <div className={styles.analysisCard}>
                <h3 className={styles.analysisTitle}>📊 Team Stat Averages</h3>
                {Object.entries(statAverages).map(([stat, avg]) => {
                  const label = { hp:'HP', attack:'ATK', defense:'DEF', 'special-attack':'SP.ATK', 'special-defense':'SP.DEF', speed:'SPD' }[stat]
                  const max = { hp:255, attack:165, defense:230, 'special-attack':194, 'special-defense':230, speed:200 }[stat] || 255
                  const pct = Math.round((avg / max) * 100)
                  return (
                    <div key={stat} className={styles.avgStatRow}>
                      <span className={styles.avgStatLabel}>{label}</span>
                      <div className={styles.avgStatBar}>
                        <motion.div
                          className={styles.avgStatFill}
                          style={{ background: pct >= 70 ? '#22c55e' : pct >= 45 ? '#ffd700' : '#ff3b3b' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                      </div>
                      <span className={styles.avgStatNum}>{avg}</span>
                    </div>
                  )
                })}
              </div>

              {/* Team members quick view */}
              <div className={styles.analysisCard}>
                <h3 className={styles.analysisTitle}>👥 Team Members</h3>
                <div className={styles.membersList}>
                  {currentTeam.map(p => (
                    <Link key={p.id} to={`/pokemon/${p.id}`} className={styles.memberRow}>
                      <img src={getSpriteUrl(p.id)} alt={p.name} className={styles.memberSprite} />
                      <div>
                        <span className={styles.memberName}>{p.name.replace(/-/g, ' ')}</span>
                        <div className={styles.memberTypes}>
                          {p.types.map(t => (
                            <span key={t.type.name} style={{ color: TYPE_COLORS[t.type.name], fontSize: '11px', fontFamily: 'Oxanium', fontWeight: 600 }}>
                              {t.type.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className={styles.memberBst}>
                        {p.stats.reduce((s, st) => s + st.base_stat, 0)} BST
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
