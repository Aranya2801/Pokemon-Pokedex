import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const PokemonContext = createContext(null)

export function PokemonProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pokemon-favorites') || '[]') } catch { return [] }
  })
  const [searchHistory, setSearchHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pokemon-search-history') || '[]') } catch { return [] }
  })
  const [viewedPokemon, setViewedPokemon] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pokemon-viewed') || '[]') } catch { return [] }
  })
  const [settings, setSettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pokemon-settings') || JSON.stringify({
        showShiny: false,
        gridCols: 'auto',
        defaultSort: 'id',
        animationsEnabled: true,
        soundEnabled: false,
      }))
    } catch { return {} }
  })

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('pokemon-favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('pokemon-search-history', JSON.stringify(searchHistory))
  }, [searchHistory])

  useEffect(() => {
    localStorage.setItem('pokemon-viewed', JSON.stringify(viewedPokemon))
  }, [viewedPokemon])

  useEffect(() => {
    localStorage.setItem('pokemon-settings', JSON.stringify(settings))
  }, [settings])

  const toggleFavorite = useCallback((id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }, [])

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites])

  const addToHistory = useCallback((term) => {
    if (!term.trim()) return
    setSearchHistory(prev => {
      const filtered = prev.filter(h => h !== term)
      return [term, ...filtered].slice(0, 10)
    })
  }, [])

  const markViewed = useCallback((id) => {
    setViewedPokemon(prev => {
      if (prev.includes(id)) return prev
      return [...prev, id]
    })
  }, [])

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  return (
    <PokemonContext.Provider value={{
      favorites, toggleFavorite, isFavorite,
      searchHistory, addToHistory,
      viewedPokemon, markViewed,
      settings, updateSetting,
    }}>
      {children}
    </PokemonContext.Provider>
  )
}

export const usePokemonContext = () => {
  const ctx = useContext(PokemonContext)
  if (!ctx) throw new Error('usePokemonContext must be used within PokemonProvider')
  return ctx
}
