import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import { usePokemonDetail } from '@hooks/usePokemon'
import LoadingScreen from '@components/LoadingScreen'
import {
  TYPE_COLORS, TYPE_ICONS, STAT_LABELS, STAT_MAX,
  getSpriteUrl, extractEnglishEntry, extractEnglishName,
  calculateTypeEffectiveness, formatStatTotal
} from '@utils/pokeapi'
import { usePokemonContext } from '@context/PokemonContext'
import { useTeam } from '@context/TeamContext'
import styles from './PokemonDetail.module.css'

const TABS = ['Overview', 'Stats', 'Moves', 'Evolution', 'Abilities', 'Locations']
const SPRITES_TABS = ['official', 'shiny', 'home', 'dream']

export default function PokemonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { pokemon, species, evolutionChain, isLoading, isError } = usePokemonDetail(id)
  const { toggleFavorite, isFavorite, markViewed, settings } = usePokemonContext()
  const { addToTeam, isOnTeam } = useTeam()
  const [tab, setTab] = useState('Overview')
  const [spriteTab, setSpriteTab] = useState('official')
  const [showShiny, setShowShiny] = useState(false)

  useEffect(() => {
    if (pokemon) markViewed(pokemon.id)
  }, [pokemon, markViewed])

  useEffect(() => {
    setTab('Overview')
    setShowShiny(false)
  }, [id])

  if (isLoading) return <LoadingScreen message="Loading Pokémon details..." />
  if (isError || !pokemon) return (
    <div className={styles.error}>
      <h2>Pokémon not found</h2>
      <Link to="/pokedex" className={styles.backLink}>← Back to Pokédex</Link>
    </div>
  )

  const types = pokemon.types.map(t => t.type.name)
  const primaryType = types[0]
  const typeColor = TYPE_COLORS[primaryType]
  const fav = isFavorite(pokemon.id)
  const onTeam = isOnTeam(pokemon.id)
  const flavorText = species ? extractEnglishEntry(species.flavor_text_entries) : ''
  const genus = species ? extractEnglishName(species.genera, 'en')?.replace(' Pokémon', '') : ''
  const statTotal = formatStatTotal(pokemon.stats)

  const spriteMap = {
    official: getSpriteUrl(pokemon.id, 'official-artwork'),
    shiny: getSpriteUrl(pokemon.id, 'official-artwork-shiny'),
    home: getSpriteUrl(pokemon.id, 'home'),
    dream: getSpriteUrl(pokemon.id, 'dream_world'),
  }

  // Type effectiveness
  const allTypes = ['normal','fire','water','electric','grass','ice','fighting',
    'poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy']
  const effectiveness = allTypes.reduce((acc, atk) => {
    const mult = calculateTypeEffectiveness(atk, types)
    acc[mult] = acc[mult] || []
    acc[mult].push(atk)
    return acc
  }, {})

  // Radar data
  const radarData = pokemon.stats.map(s => ({
    stat: STAT_LABELS[s.stat.name] || s.stat.name,
    value: s.base_stat,
    fullMark: STAT_MAX[s.stat.name] || 255,
  }))

  function parseEvolution(chain) {
    if (!chain) return []
    const stages = []
    let current = chain.chain
    while (current) {
      stages.push({
        id: parseInt(current.species.url.split('/').slice(-2, -1)[0]),
        name: current.species.name,
        trigger: current.evolution_details?.[0]?.trigger?.name,
        level: current.evolution_details?.[0]?.min_level,
        item: current.evolution_details?.[0]?.item?.name,
      })
      current = current.evolves_to?.[0]
    }
    return stages
  }

  const evolutionStages = parseEvolution(evolutionChain)

  const prevId = pokemon.id > 1 ? pokemon.id - 1 : null
  const nextId = pokemon.id < 1025 ? pokemon.id + 1 : null

  return (
    <div className={styles.page} style={{ '--type-color': typeColor }}>
      {/* Background accent */}
      <div className={styles.bgAccent} style={{ background: `radial-gradient(ellipse 60% 50% at 70% 20%, ${typeColor}18 0%, transparent 70%)` }} />

      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link to="/pokedex">Pokédex</Link>
          <span>/</span>
          <span>{pokemon.name.replace(/-/g, ' ')}</span>
        </nav>

        {/* Main Layout */}
        <div className={styles.layout}>
          {/* LEFT: Sprite Panel */}
          <motion.aside
            className={styles.spritePanel}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Sprite Tabs */}
            <div className={styles.spriteTabs}>
              {SPRITES_TABS.map(st => (
                <button
                  key={st}
                  className={`${styles.spriteTabBtn} ${spriteTab === st ? styles.spriteTabActive : ''}`}
                  onClick={() => setSpriteTab(st)}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Main Sprite */}
            <div className={styles.spriteBox}>
              <div className={styles.spriteGlow} style={{ background: `radial-gradient(circle, ${typeColor}40 0%, transparent 70%)` }} />
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${spriteTab}-${pokemon.id}`}
                  src={spriteMap[spriteTab]}
                  alt={`${pokemon.name} ${spriteTab}`}
                  className={styles.mainSprite}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.3 }}
                  onError={e => { e.target.src = getSpriteUrl(pokemon.id) }}
                />
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className={styles.spriteActions}>
              <button
                className={`${styles.actionBtn} ${fav ? styles.actionBtnActive : ''}`}
                onClick={() => toggleFavorite(pokemon.id)}
              >
                {fav ? '❤️' : '🤍'} {fav ? 'Favorited' : 'Favorite'}
              </button>
              <button
                className={`${styles.actionBtn} ${onTeam ? styles.actionBtnGold : ''}`}
                onClick={() => addToTeam(pokemon)}
                disabled={onTeam}
              >
                {onTeam ? '⚔️ On Team' : '+ Add to Team'}
              </button>
            </div>

            {/* Sprite Variants Row */}
            <div className={styles.spriteVariants}>
              {['default','shiny','back','back-shiny'].map((v, i) => {
                const urls = [
                  pokemon.sprites?.front_default,
                  pokemon.sprites?.front_shiny,
                  pokemon.sprites?.back_default,
                  pokemon.sprites?.back_shiny,
                ]
                return urls[i] ? (
                  <img
                    key={v}
                    src={urls[i]}
                    alt={`${pokemon.name} ${v}`}
                    className={styles.variantSprite}
                    title={v}
                  />
                ) : null
              })}
            </div>
          </motion.aside>

          {/* RIGHT: Info Panel */}
          <motion.div
            className={styles.infoPanel}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Header */}
            <div className={styles.infoHeader}>
              <div>
                <span className={styles.pokemonId}>#{String(pokemon.id).padStart(4, '0')}</span>
                <h1 className={styles.pokemonName}>{pokemon.name.replace(/-/g, ' ')}</h1>
                {genus && <p className={styles.genus}>{genus} Pokémon</p>}
              </div>
              <div className={styles.headerNav}>
                {prevId && (
                  <button className={styles.navBtn} onClick={() => navigate(`/pokemon/${prevId}`)}>
                    ← #{prevId}
                  </button>
                )}
                {nextId && (
                  <button className={styles.navBtn} onClick={() => navigate(`/pokemon/${nextId}`)}>
                    #{nextId} →
                  </button>
                )}
              </div>
            </div>

            {/* Types */}
            <div className={styles.types}>
              {types.map(type => (
                <Link key={type} to={`/pokedex?type=${type}`} className={`type-badge ${styles.typeBadge}`}
                  style={{ background: TYPE_COLORS[type] }}>
                  {TYPE_ICONS[type]} {type}
                </Link>
              ))}
            </div>

            {/* Flavor text */}
            {flavorText && (
              <p className={styles.flavorText}>"{flavorText}"</p>
            )}

            {/* Quick Stats */}
            <div className={styles.quickStats}>
              {[
                { label: 'Height', value: `${(pokemon.height / 10).toFixed(1)}m` },
                { label: 'Weight', value: `${(pokemon.weight / 10).toFixed(1)}kg` },
                { label: 'Base XP', value: pokemon.base_experience || '—' },
                { label: 'BST', value: statTotal },
                { label: 'Capture Rate', value: species?.capture_rate || '—' },
                { label: 'Base Happiness', value: species?.base_happiness ?? '—' },
              ].map(({ label, value }) => (
                <div key={label} className={styles.quickStat}>
                  <span className={styles.qsLabel}>{label}</span>
                  <span className={styles.qsValue}>{value}</span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
              {TABS.map(t => (
                <button
                  key={t}
                  className={`${styles.tabBtn} ${tab === t ? styles.tabActive : ''}`}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                className={styles.tabContent}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {/* ── OVERVIEW ── */}
                {tab === 'Overview' && (
                  <div className={styles.overview}>
                    <h3 className={styles.sectionHeading}>Type Effectiveness</h3>
                    <div className={styles.typeChart}>
                      {[4, 2, 1, 0.5, 0.25, 0].map(mult => {
                        const types_ = effectiveness[mult]
                        if (!types_?.length) return null
                        return (
                          <div key={mult} className={styles.typeRow}>
                            <span className={styles.multLabel}
                              style={{ color: mult >= 2 ? '#ff3b3b' : mult === 0 ? '#555' : mult < 1 ? '#22c55e' : '#9090b0' }}>
                              {mult === 0 ? '0×' : mult === 0.25 ? '¼×' : mult === 0.5 ? '½×' : `${mult}×`}
                            </span>
                            <div className={styles.typeList}>
                              {types_.map(t => (
                                <span key={t} className="type-badge" style={{ background: TYPE_COLORS[t], fontSize: '10px', padding: '2px 8px' }}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <h3 className={styles.sectionHeading}>Training</h3>
                    <div className={styles.detailGrid}>
                      {species && <>
                        <div className={styles.detailItem}>
                          <span className={styles.diLabel}>Growth Rate</span>
                          <span className={styles.diValue}>{species.growth_rate?.name?.replace(/-/g, ' ') || '—'}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.diLabel}>Egg Groups</span>
                          <span className={styles.diValue}>{species.egg_groups?.map(e => e.name).join(', ') || '—'}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.diLabel}>Hatch Steps</span>
                          <span className={styles.diValue}>{species.hatch_counter ? `${species.hatch_counter * 257} steps` : '—'}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.diLabel}>Gender Ratio</span>
                          <span className={styles.diValue}>
                            {species.gender_rate === -1 ? 'Genderless' :
                             `♂ ${((8 - species.gender_rate) / 8 * 100).toFixed(0)}% / ♀ ${(species.gender_rate / 8 * 100).toFixed(0)}%`}
                          </span>
                        </div>
                      </>}
                    </div>
                  </div>
                )}

                {/* ── STATS ── */}
                {tab === 'Stats' && (
                  <div className={styles.statsTab}>
                    {pokemon.stats.map((s, i) => {
                      const label = STAT_LABELS[s.stat.name] || s.stat.name
                      const max = STAT_MAX[s.stat.name] || 255
                      const pct = Math.round((s.base_stat / max) * 100)
                      return (
                        <div key={s.stat.name} className={styles.statRow}>
                          <span className={styles.statName}>{label}</span>
                          <span className={styles.statNum}>{s.base_stat}</span>
                          <div className={styles.statBarTrack}>
                            <motion.div
                              className={styles.statBarFill}
                              style={{
                                background: pct >= 80 ? '#22c55e' : pct >= 50 ? typeColor : '#ff3b3b'
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.7, delay: i * 0.08, ease: 'easeOut' }}
                            />
                          </div>
                          <span className={styles.statMax}>/{max}</span>
                        </div>
                      )
                    })}
                    <div className={styles.statTotal}>
                      <span>Base Stat Total</span>
                      <strong>{statTotal}</strong>
                    </div>

                    {/* Radar Chart */}
                    <div className={styles.radarWrap}>
                      <h4 className={styles.radarTitle}>Stat Radar</h4>
                      <ResponsiveContainer width="100%" height={260}>
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="rgba(255,255,255,0.08)" />
                          <PolarAngleAxis dataKey="stat" tick={{ fill: '#9090b0', fontSize: 11, fontFamily: 'Oxanium' }} />
                          <Radar
                            dataKey="value"
                            stroke={typeColor}
                            fill={typeColor}
                            fillOpacity={0.25}
                            strokeWidth={2}
                          />
                          <Tooltip
                            contentStyle={{ background: '#13131f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                            labelStyle={{ color: '#f0f0ff', fontFamily: 'Oxanium' }}
                            itemStyle={{ color: typeColor }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* ── MOVES ── */}
                {tab === 'Moves' && (
                  <div className={styles.movesTab}>
                    <div className={styles.movesGrid}>
                      {pokemon.moves.slice(0, 60).map(m => (
                        <div key={m.move.name} className={styles.moveItem}>
                          <span className={styles.moveName}>{m.move.name.replace(/-/g, ' ')}</span>
                          <span className={styles.moveMethod}>
                            {m.version_group_details?.[0]?.move_learn_method?.name?.replace(/-/g, ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                    {pokemon.moves.length > 60 && (
                      <p className={styles.moreText}>+{pokemon.moves.length - 60} more moves</p>
                    )}
                  </div>
                )}

                {/* ── EVOLUTION ── */}
                {tab === 'Evolution' && (
                  <div className={styles.evolutionTab}>
                    {evolutionStages.length > 1 ? (
                      <div className={styles.evoChain}>
                        {evolutionStages.map((stage, i) => (
                          <React.Fragment key={stage.id}>
                            {i > 0 && (
                              <div className={styles.evoArrow}>
                                <span className={styles.evoTrigger}>
                                  {stage.level ? `Lv. ${stage.level}` : stage.item ? stage.item.replace(/-/g, ' ') : 'Evolve'}
                                </span>
                                <span>→</span>
                              </div>
                            )}
                            <Link to={`/pokemon/${stage.id}`} className={`${styles.evoCard} ${stage.id === pokemon.id ? styles.evoCardActive : ''}`}>
                              <img
                                src={getSpriteUrl(stage.id, 'official-artwork')}
                                alt={stage.name}
                                className={styles.evoSprite}
                              />
                              <span className={styles.evoId}>#{stage.id}</span>
                              <span className={styles.evoName}>{stage.name.replace(/-/g, ' ')}</span>
                            </Link>
                          </React.Fragment>
                        ))}
                      </div>
                    ) : (
                      <p className={styles.noEvo}>This Pokémon does not evolve.</p>
                    )}
                  </div>
                )}

                {/* ── ABILITIES ── */}
                {tab === 'Abilities' && (
                  <div className={styles.abilitiesTab}>
                    {pokemon.abilities.map(a => (
                      <div key={a.ability.name} className={styles.abilityCard}>
                        <div className={styles.abilityHeader}>
                          <span className={styles.abilityName}>{a.ability.name.replace(/-/g, ' ')}</span>
                          {a.is_hidden && <span className={styles.hiddenBadge}>Hidden</span>}
                        </div>
                        <p className={styles.abilityDesc}>
                          Tap to explore this ability in the Moves Dex.
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── LOCATIONS ── */}
                {tab === 'Locations' && (
                  <div className={styles.locTab}>
                    <p className={styles.locText}>
                      Location data requires in-game exploration. Check the Battle Simulator or official Pokémon resources for encounter locations.
                    </p>
                    <div className={styles.locLinks}>
                      <a href={`https://bulbapedia.bulbagarden.net/wiki/${pokemon.name.replace(/-/g, '_')}_(Pokémon)`}
                        target="_blank" rel="noopener noreferrer" className={styles.extLink}>
                        View on Bulbapedia ↗
                      </a>
                      <a href={`https://www.smogon.com/dex/sv/pokemon/${pokemon.name}/`}
                        target="_blank" rel="noopener noreferrer" className={styles.extLink}>
                        View on Smogon ↗
                      </a>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
