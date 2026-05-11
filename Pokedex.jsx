import React, { useState, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from 'react-query'
import Fuse from 'fuse.js'
import PokemonCard from '@components/PokemonCard'
import LoadingScreen from '@components/LoadingScreen'
import { fetchPokemon, fetchPokemonList, TYPE_COLORS, GENERATIONS, pokemonIdFromUrl } from '@utils/pokeapi'
import { usePokemonContext } from '@context/PokemonContext'
import styles from './Pokedex.module.css'

const TYPES = [
  'all','normal','fire','water','electric','grass','ice','fighting','poison',
  'ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'
]
const SORT_OPTIONS = [
  { value: 'id-asc', label: 'ID: Low → High' },
  { value: 'id-desc', label: 'ID: High → Low' },
  { value: 'name-asc', label: 'Name: A → Z' },
  { value: 'name-desc', label: 'Name: Z → A' },
  { value: 'bst-desc', label: 'BST: High → Low' },
  { value: 'bst-asc', label: 'BST: Low → High' },
]
const PAGE_SIZE = 40

export default function Pokedex() {
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedGen, setSelectedGen] = useState('all')
  const [sortBy, setSortBy] = useState('id-asc')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const { addToHistory } = usePokemonContext()
  const searchRef = useRef(null)

  // Fetch all 1025 pokemon list
  const { data: listData, isLoading: listLoading } = useQuery(
    ['pokemon-list-all'],
    () => fetchPokemonList(1025, 0),
    { staleTime: Infinity }
  )

  // Fetch detailed data in batches
  const pokemonIds = useMemo(() => {
    if (!listData?.results) return []
    return listData.results.map(p => pokemonIdFromUrl(p.url))
  }, [listData])

  const { data: pokemonDetails, isLoading: detailsLoading } = useQuery(
    ['pokemon-details-all', pokemonIds.length],
    async () => {
      const BATCH = 50
      const results = []
      for (let i = 0; i < Math.min(pokemonIds.length, 1025); i += BATCH) {
        const batch = pokemonIds.slice(i, i + BATCH)
        const fetched = await Promise.all(batch.map(id => fetchPokemon(id)))
        results.push(...fetched)
      }
      return results
    },
    { enabled: pokemonIds.length > 0, staleTime: 1000 * 60 * 30 }
  )

  // Fuzzy search
  const fuse = useMemo(() => {
    if (!pokemonDetails) return null
    return new Fuse(pokemonDetails, {
      keys: ['name', 'id'],
      threshold: 0.3,
      minMatchCharLength: 2,
    })
  }, [pokemonDetails])

  // Filter + sort
  const filtered = useMemo(() => {
    if (!pokemonDetails) return []
    let data = pokemonDetails

    if (search.trim().length >= 2 && fuse) {
      data = fuse.search(search.trim()).map(r => r.item)
    }

    if (selectedType !== 'all') {
      data = data.filter(p => p.types.some(t => t.type.name === selectedType))
    }

    if (selectedGen !== 'all') {
      const gen = GENERATIONS.find(g => g.id === parseInt(selectedGen))
      if (gen) {
        data = data.filter(p => p.id >= gen.range[0] && p.id <= gen.range[1])
      }
    }

    const [field, dir] = sortBy.split('-')
    return [...data].sort((a, b) => {
      let va, vb
      if (field === 'id') { va = a.id; vb = b.id }
      else if (field === 'name') { va = a.name; vb = b.name }
      else if (field === 'bst') {
        va = a.stats.reduce((s, x) => s + x.base_stat, 0)
        vb = b.stats.reduce((s, x) => s + x.base_stat, 0)
      }
      if (va < vb) return dir === 'asc' ? -1 : 1
      if (va > vb) return dir === 'asc' ? 1 : -1
      return 0
    })
  }, [pokemonDetails, search, selectedType, selectedGen, sortBy, fuse])

  const paginated = useMemo(() => {
    return filtered.slice(0, page * PAGE_SIZE)
  }, [filtered, page])

  const hasMore = paginated.length < filtered.length

  function handleSearch(e) {
    setSearch(e.target.value)
    setPage(1)
    if (e.target.value.length > 2) addToHistory(e.target.value)
  }

  function resetFilters() {
    setSearch('')
    setSelectedType('all')
    setSelectedGen('all')
    setSortBy('id-asc')
    setPage(1)
  }

  if (listLoading || detailsLoading) {
    return (
      <div className={styles.page}>
        <LoadingScreen message={`Loading Pokémon... ${pokemonDetails?.length || 0}/1025`} />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className={styles.title}>National Pokédex</h1>
            <p className={styles.subtitle}>
              {filtered.length.toLocaleString()} Pokémon
              {selectedType !== 'all' || selectedGen !== 'all' || search ? ' matching filters' : ' total'}
            </p>
          </div>
          <button
            className={styles.filterToggle}
            onClick={() => setShowFilters(f => !f)}
          >
            {showFilters ? '✕ Filters' : '⚙ Filters'}
          </button>
        </motion.div>

        {/* Search */}
        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            ref={searchRef}
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={handleSearch}
            className={styles.searchInput}
          />
          {search && (
            <button className={styles.clearSearch} onClick={() => { setSearch(''); setPage(1) }}>✕</button>
          )}
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className={styles.filtersPanel}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {/* Type filter */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Type</label>
                <div className={styles.typeGrid}>
                  {TYPES.map(type => (
                    <button
                      key={type}
                      className={`${styles.typeBtn} ${selectedType === type ? styles.typeBtnActive : ''}`}
                      style={selectedType === type && type !== 'all' ? { background: TYPE_COLORS[type] } : {}}
                      onClick={() => { setSelectedType(type); setPage(1) }}
                    >
                      {type === 'all' ? '🌐 All' : type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generation filter */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Generation</label>
                <div className={styles.genGrid}>
                  <button
                    className={`${styles.genBtn} ${selectedGen === 'all' ? styles.genBtnActive : ''}`}
                    onClick={() => { setSelectedGen('all'); setPage(1) }}
                  >All</button>
                  {GENERATIONS.map(g => (
                    <button
                      key={g.id}
                      className={`${styles.genBtn} ${selectedGen === String(g.id) ? styles.genBtnActive : ''}`}
                      onClick={() => { setSelectedGen(String(g.id)); setPage(1) }}
                    >
                      {g.name} <span className={styles.genRegion}>{g.region}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort + Reset */}
              <div className={styles.filterBottom}>
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Sort By</label>
                  <select
                    className={styles.select}
                    value={sortBy}
                    onChange={e => { setSortBy(e.target.value); setPage(1) }}
                  >
                    {SORT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <button className={styles.resetBtn} onClick={resetFilters}>
                  Reset All Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        {filtered.length === 0 ? (
          <motion.div className={styles.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className={styles.emptyIcon}>🔍</span>
            <p>No Pokémon found matching your filters.</p>
            <button className={styles.resetBtn} onClick={resetFilters}>Reset Filters</button>
          </motion.div>
        ) : (
          <>
            <div className={styles.grid}>
              {paginated.map((pokemon, i) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} index={i} />
              ))}
            </div>

            {hasMore && (
              <div className={styles.loadMoreWrap}>
                <motion.button
                  className={styles.loadMore}
                  onClick={() => setPage(p => p + 1)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Load More ({filtered.length - paginated.length} remaining)
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
