// MovesDex.jsx
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { TYPE_COLORS, TYPE_ICONS } from '@utils/pokeapi'

const MOVE_CATEGORIES = ['all', 'physical', 'special', 'status']

async function fetchMoveList() {
  const res = await fetch('https://pokeapi.co/api/v2/move?limit=100&offset=0')
  const data = await res.json()
  return data.results
}

export default function MovesDex() {
  const [search, setSearch] = useState('')
  const { data: moves, isLoading } = useQuery(['move-list'], fetchMoveList, { staleTime: Infinity })

  const filtered = moves?.filter(m => m.name.includes(search.toLowerCase())) || []

  return (
    <div style={{ paddingTop: 100, paddingBottom: 80, minHeight: '100vh' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontFamily: 'Oxanium', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
            Move Dex
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>Explore Pokémon moves and their effects</p>
        </motion.div>

        <input
          type="text"
          placeholder="Search moves..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '12px 16px', marginBottom: 24,
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            borderRadius: 12, color: 'var(--text-primary)', fontSize: 15,
            fontFamily: 'Inter', outline: 'none'
          }}
        />

        {isLoading ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>Loading moves...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
            {filtered.slice(0, 100).map((move, i) => (
              <motion.div
                key={move.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.01 }}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                  borderRadius: 10, padding: '12px 16px', cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                whileHover={{ borderColor: 'rgba(255,255,255,0.15)', y: -2 }}
              >
                <span style={{ fontFamily: 'Oxanium', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize', display: 'block', marginBottom: 4 }}>
                  {move.name.replace(/-/g, ' ')}
                </span>
                <a href={move.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none' }}>
                  View details ↗
                </a>
              </motion.div>
            ))}
          </div>
        )}

        {filtered.length > 100 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: 20, fontSize: 13 }}>
            Showing 100 of {filtered.length} moves. Refine your search to see more.
          </p>
        )}
      </div>
    </div>
  )
}
