import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'

const TeamContext = createContext(null)
const MAX_TEAM = 6

export function TeamProvider({ children }) {
  const [teams, setTeams] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pokemon-teams') || '{"My Team": []}')
    } catch {
      return { 'My Team': [] }
    }
  })
  const [activeTeam, setActiveTeam] = useState('My Team')

  useEffect(() => {
    localStorage.setItem('pokemon-teams', JSON.stringify(teams))
  }, [teams])

  const currentTeam = teams[activeTeam] || []

  const addToTeam = useCallback((pokemon) => {
    setTeams(prev => {
      const team = prev[activeTeam] || []
      if (team.length >= MAX_TEAM) {
        toast.error('Team is full! Max 6 Pokémon.')
        return prev
      }
      if (team.some(p => p.id === pokemon.id)) {
        toast.error(`${pokemon.name} is already on your team!`)
        return prev
      }
      toast.success(`${pokemon.name} added to team!`)
      return { ...prev, [activeTeam]: [...team, pokemon] }
    })
  }, [activeTeam])

  const removeFromTeam = useCallback((pokemonId) => {
    setTeams(prev => ({
      ...prev,
      [activeTeam]: (prev[activeTeam] || []).filter(p => p.id !== pokemonId)
    }))
  }, [activeTeam])

  const clearTeam = useCallback(() => {
    setTeams(prev => ({ ...prev, [activeTeam]: [] }))
  }, [activeTeam])

  const createTeam = useCallback((name) => {
    if (teams[name]) { toast.error('Team name already exists!'); return }
    setTeams(prev => ({ ...prev, [name]: [] }))
    setActiveTeam(name)
    toast.success(`Team "${name}" created!`)
  }, [teams])

  const deleteTeam = useCallback((name) => {
    if (Object.keys(teams).length <= 1) { toast.error('You need at least one team!'); return }
    setTeams(prev => {
      const next = { ...prev }
      delete next[name]
      return next
    })
    if (activeTeam === name) {
      setActiveTeam(Object.keys(teams).find(t => t !== name))
    }
  }, [teams, activeTeam])

  const isOnTeam = useCallback((id) => currentTeam.some(p => p.id === id), [currentTeam])

  const swapPosition = useCallback((fromIdx, toIdx) => {
    setTeams(prev => {
      const team = [...(prev[activeTeam] || [])]
      const [item] = team.splice(fromIdx, 1)
      team.splice(toIdx, 0, item)
      return { ...prev, [activeTeam]: team }
    })
  }, [activeTeam])

  return (
    <TeamContext.Provider value={{
      teams, activeTeam, setActiveTeam,
      currentTeam, addToTeam, removeFromTeam,
      clearTeam, createTeam, deleteTeam,
      isOnTeam, swapPosition, MAX_TEAM,
    }}>
      {children}
    </TeamContext.Provider>
  )
}

export const useTeam = () => {
  const ctx = useContext(TeamContext)
  if (!ctx) throw new Error('useTeam must be used within TeamProvider')
  return ctx
}
