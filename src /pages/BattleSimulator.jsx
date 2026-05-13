import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePokemon } from '@hooks/usePokemon'
import { TYPE_COLORS, TYPE_ICONS, getSpriteUrl, calculateTypeEffectiveness } from '@utils/pokeapi'
import styles from './BattleSimulator.module.css'

const NATURES = {
  Hardy:{ atk:1,def:1,spa:1,spd:1,spe:1}, Lonely:{atk:1.1,def:0.9,spa:1,spd:1,spe:1},
  Brave:{atk:1.1,def:1,spa:1,spd:1,spe:0.9}, Adamant:{atk:1.1,def:1,spa:0.9,spd:1,spe:1},
  Naughty:{atk:1.1,def:1,spa:1,spd:0.9,spe:1}, Bold:{atk:0.9,def:1.1,spa:1,spd:1,spe:1},
  Docile:{atk:1,def:1,spa:1,spd:1,spe:1}, Relaxed:{atk:1,def:1.1,spa:1,spd:1,spe:0.9},
  Impish:{atk:1,def:1.1,spa:0.9,spd:1,spe:1}, Lax:{atk:1,def:1.1,spa:1,spd:0.9,spe:1},
  Timid:{atk:0.9,def:1,spa:1,spd:1,spe:1.1}, Hasty:{atk:1,def:0.9,spa:1,spd:1,spe:1.1},
  Serious:{atk:1,def:1,spa:1,spd:1,spe:1}, Jolly:{atk:1,def:1,spa:0.9,spd:1,spe:1.1},
  Naive:{atk:1,def:1,spa:1,spd:0.9,spe:1.1}, Modest:{atk:0.9,def:1,spa:1.1,spd:1,spe:1},
  Mild:{atk:1,def:0.9,spa:1.1,spd:1,spe:1}, Quiet:{atk:1,def:1,spa:1.1,spd:1,spe:0.9},
  Bashful:{atk:1,def:1,spa:1,spd:1,spe:1}, Rash:{atk:1,def:1,spa:1.1,spd:0.9,spe:1},
  Calm:{atk:0.9,def:1,spa:1,spd:1.1,spe:1}, Gentle:{atk:1,def:0.9,spa:1,spd:1.1,spe:1},
  Sassy:{atk:1,def:1,spa:1,spd:1.1,spe:0.9}, Careful:{atk:1,def:1,spa:0.9,spd:1.1,spe:1},
  Quirky:{atk:1,def:1,spa:1,spd:1,spe:1},
}

function calcStat(base, level=50, iv=31, ev=0, nature=1, isHp=false) {
  if (isHp) return Math.floor(((2*base+iv+Math.floor(ev/4))*level)/100)+level+10
  return Math.floor((Math.floor(((2*base+iv+Math.floor(ev/4))*level)/100)+5)*nature)
}

function PokemonSelector({ label, onSelect, selected }) {
  const [input, setInput] = useState('')
  const [searching, setSearching] = useState(false)
  const { data: pokemon, isLoading } = usePokemon(input.toLowerCase().trim() || null, {
    enabled: searching && input.length > 1,
    onSuccess: (data) => { onSelect(data); setSearching(false) }
  })

  return (
    <div className={styles.selector}>
      <label className={styles.selectorLabel}>{label}</label>
      <div className={styles.selectorInput}>
        <input
          type="text"
          placeholder="Name or ID (e.g. charizard, 6)"
          value={input}
          onChange={e => setInput(e.target.value)}
          className={styles.input}
          onKeyDown={e => { if (e.key === 'Enter') setSearching(true) }}
        />
        <button
          className={styles.searchBtn}
          onClick={() => setSearching(true)}
          disabled={!input.trim()}
        >
          {isLoading ? '...' : '→'}
        </button>
      </div>
      {selected && (
        <motion.div
          className={styles.selectedPoke}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ '--poke-color': TYPE_COLORS[selected.types[0].type.name] }}
        >
          <div className={styles.selectedGlow} />
          <img src={getSpriteUrl(selected.id, 'official-artwork')} alt={selected.name} className={styles.selectedSprite} />
          <div className={styles.selectedInfo}>
            <span className={styles.selectedId}>#{selected.id}</span>
            <span className={styles.selectedName}>{selected.name.replace(/-/g, ' ')}</span>
            <div className={styles.selectedTypes}>
              {selected.types.map(t => (
                <span key={t.type.name} className="type-badge"
                  style={{ background: TYPE_COLORS[t.type.name], fontSize: '10px', padding: '2px 8px' }}>
                  {t.type.name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default function BattleSimulator() {
  const [attacker, setAttacker] = useState(null)
  const [defender, setDefender] = useState(null)
  const [atkLevel, setAtkLevel] = useState(50)
  const [defLevel, setDefLevel] = useState(50)
  const [atkNature, setAtkNature] = useState('Timid')
  const [defNature, setDefNature] = useState('Bold')
  const [battleLog, setBattleLog] = useState([])
  const [simulating, setSimulating] = useState(false)

  // Type matchup
  const matchup = useMemo(() => {
    if (!attacker || !defender) return null
    const atkTypes = attacker.types.map(t => t.type.name)
    const defTypes = defender.types.map(t => t.type.name)
    const results = atkTypes.map(at => ({
      type: at,
      mult: calculateTypeEffectiveness(at, defTypes)
    }))
    return results
  }, [attacker, defender])

  // Stat calculations
  const atkStats = useMemo(() => {
    if (!attacker) return null
    const n = NATURES[atkNature]
    const stats = {}
    attacker.stats.forEach(s => {
      const isHp = s.stat.name === 'hp'
      const natKey = { attack:'atk', defense:'def', 'special-attack':'spa', 'special-defense':'spd', speed:'spe' }[s.stat.name] || null
      stats[s.stat.name] = calcStat(s.base_stat, atkLevel, 31, 252, isHp ? 1 : (natKey ? n[natKey] : 1), isHp)
    })
    return stats
  }, [attacker, atkLevel, atkNature])

  const defStats = useMemo(() => {
    if (!defender) return null
    const n = NATURES[defNature]
    const stats = {}
    defender.stats.forEach(s => {
      const isHp = s.stat.name === 'hp'
      const natKey = { attack:'atk', defense:'def', 'special-attack':'spa', 'special-defense':'spd', speed:'spe' }[s.stat.name] || null
      stats[s.stat.name] = calcStat(s.base_stat, defLevel, 31, 252, isHp ? 1 : (natKey ? n[natKey] : 1), isHp)
    })
    return stats
  }, [defender, defLevel, defNature])

  function simulateBattle() {
    if (!attacker || !defender || !atkStats || !defStats) return
    setSimulating(true)
    const log = []
    let atkHp = atkStats['hp'] || 100
    let defHp = defStats['hp'] || 100
    let round = 1

    const atkSpd = atkStats['speed'] || 50
    const defSpd = defStats['speed'] || 50
    const atkAtk = Math.max(atkStats['attack'] || 50, atkStats['special-attack'] || 50)
    const defDef = Math.max(defStats['defense'] || 50, defStats['special-defense'] || 50)
    const defAtk = Math.max(defStats['attack'] || 50, defStats['special-attack'] || 50)
    const atkDef = Math.max(atkStats['defense'] || 50, atkStats['special-defense'] || 50)

    // type multiplier
    const atkTypes = attacker.types.map(t => t.type.name)
    const defTypes = defender.types.map(t => t.type.name)
    const atkMult = Math.max(...atkTypes.map(at => calculateTypeEffectiveness(at, defTypes)))
    const defMult = Math.max(...defTypes.map(dt => calculateTypeEffectiveness(dt, atkTypes)))

    while (atkHp > 0 && defHp > 0 && round <= 30) {
      // Simple damage formula approximation
      const atkDmg = Math.max(1, Math.floor(((atkAtk * 80 / defDef) * (atkLevel / 50 + 1) / 2 + 2) * atkMult * (0.85 + Math.random() * 0.15)))
      const defDmg = Math.max(1, Math.floor(((defAtk * 70 / atkDef) * (defLevel / 50 + 1) / 2 + 2) * defMult * (0.85 + Math.random() * 0.15)))

      if (atkSpd >= defSpd) {
        defHp -= atkDmg
        log.push({ round, actor: attacker.name, damage: atkDmg, mult: atkMult, targetHp: Math.max(0, defHp), targetMax: defStats['hp'] })
        if (defHp > 0) {
          atkHp -= defDmg
          log.push({ round, actor: defender.name, damage: defDmg, mult: defMult, targetHp: Math.max(0, atkHp), targetMax: atkStats['hp'] })
        }
      } else {
        atkHp -= defDmg
        log.push({ round, actor: defender.name, damage: defDmg, mult: defMult, targetHp: Math.max(0, atkHp), targetMax: atkStats['hp'] })
        if (atkHp > 0) {
          defHp -= atkDmg
          log.push({ round, actor: attacker.name, damage: atkDmg, mult: atkMult, targetHp: Math.max(0, defHp), targetMax: defStats['hp'] })
        }
      }
      round++
    }

    const winner = atkHp > 0 ? attacker.name : defHp > 0 ? defender.name : 'Draw'
    log.push({ winner, finalAtkHp: Math.max(0, atkHp), finalDefHp: Math.max(0, defHp) })
    setBattleLog(log)
    setTimeout(() => setSimulating(false), 300)
  }

  const lastEntry = battleLog[battleLog.length - 1]

  return (
    <div className={styles.page}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={styles.title}>Battle Simulator</h1>
          <p className={styles.subtitle}>Simulate a battle between any two Pokémon with EV/IV/Nature support</p>
        </motion.div>

        <div className={styles.arenaGrid}>
          {/* Attacker */}
          <div className={styles.side}>
            <PokemonSelector label="⚔️ Attacker" onSelect={setAttacker} selected={attacker} />
            {attacker && (
              <div className={styles.config}>
                <label className={styles.configLabel}>Level</label>
                <input type="range" min={1} max={100} value={atkLevel}
                  onChange={e => setAtkLevel(Number(e.target.value))} className={styles.range} />
                <span className={styles.rangeVal}>{atkLevel}</span>
                <label className={styles.configLabel}>Nature</label>
                <select value={atkNature} onChange={e => setAtkNature(e.target.value)} className={styles.select}>
                  {Object.keys(NATURES).map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
            )}
          </div>

          {/* VS */}
          <div className={styles.vsCenter}>
            <div className={styles.vs}>VS</div>
            {matchup && (
              <div className={styles.matchupInfo}>
                {matchup.map(({ type, mult }) => (
                  <div key={type} className={styles.matchupRow}>
                    <span className="type-badge" style={{ background: TYPE_COLORS[type], fontSize: '10px', padding: '2px 8px' }}>{type}</span>
                    <span className={styles.matchupMult} style={{ color: mult >= 2 ? '#ff3b3b' : mult === 0 ? '#555' : mult < 1 ? '#22c55e' : '#9090b0' }}>
                      {mult === 0 ? '0×' : `${mult}×`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Defender */}
          <div className={styles.side}>
            <PokemonSelector label="🛡️ Defender" onSelect={setDefender} selected={defender} />
            {defender && (
              <div className={styles.config}>
                <label className={styles.configLabel}>Level</label>
                <input type="range" min={1} max={100} value={defLevel}
                  onChange={e => setDefLevel(Number(e.target.value))} className={styles.range} />
                <span className={styles.rangeVal}>{defLevel}</span>
                <label className={styles.configLabel}>Nature</label>
                <select value={defNature} onChange={e => setDefNature(e.target.value)} className={styles.select}>
                  {Object.keys(NATURES).map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        {attacker && defender && (
          <div className={styles.battleControls}>
            <motion.button
              className={styles.battleBtn}
              onClick={simulateBattle}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              disabled={simulating}
            >
              {simulating ? '⚡ Simulating...' : '⚡ Simulate Battle!'}
            </motion.button>
          </div>
        )}

        {/* Battle Log */}
        <AnimatePresence>
          {battleLog.length > 0 && (
            <motion.div
              className={styles.battleLog}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className={styles.logTitle}>⚔️ Battle Result</h2>

              {lastEntry?.winner && (
                <div className={`${styles.winner} ${lastEntry.winner === attacker?.name ? styles.winnerAtk : styles.winnerDef}`}>
                  <span className={styles.winnerLabel}>🏆 Winner</span>
                  <span className={styles.winnerName}>{lastEntry.winner.replace(/-/g, ' ')}</span>
                </div>
              )}

              <div className={styles.logEntries}>
                {battleLog.filter(e => !e.winner).map((entry, i) => (
                  <motion.div
                    key={i}
                    className={styles.logEntry}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <span className={styles.logRound}>R{entry.round}</span>
                    <span className={styles.logActor} style={{ color: entry.actor === attacker?.name ? '#ff3b3b' : '#4fc3f7' }}>
                      {entry.actor.replace(/-/g, ' ')}
                    </span>
                    <span className={styles.logDamage}>
                      dealt <strong>{entry.damage}</strong> dmg
                      {entry.mult > 1 && <span style={{ color: '#ff3b3b' }}> ({entry.mult}×)</span>}
                      {entry.mult < 1 && entry.mult > 0 && <span style={{ color: '#22c55e' }}> ({entry.mult}×)</span>}
                    </span>
                    <div className={styles.hpBar}>
                      <div className={styles.hpFill} style={{ width: `${(entry.targetHp / entry.targetMax) * 100}%`, background: entry.targetHp / entry.targetMax > 0.5 ? '#22c55e' : entry.targetHp / entry.targetMax > 0.2 ? '#ffd700' : '#ff3b3b' }} />
                    </div>
                    <span className={styles.hpNum}>{entry.targetHp}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
