import { useQuery } from 'react-query'
import {
  fetchPokemon,
  fetchPokemonSpecies,
  fetchEvolutionChain,
  fetchPokemonList,
  fetchAbility,
  fetchMove,
  fetchType,
  fetchPokemonBatch,
} from '@utils/pokeapi'

// ── Single Pokemon ───────────────────────────────────────────

export function usePokemon(idOrName, options = {}) {
  return useQuery(
    ['pokemon', idOrName],
    () => fetchPokemon(idOrName),
    { enabled: !!idOrName, ...options }
  )
}

export function usePokemonSpecies(idOrName, options = {}) {
  return useQuery(
    ['pokemon-species', idOrName],
    () => fetchPokemonSpecies(idOrName),
    { enabled: !!idOrName, ...options }
  )
}

export function useEvolutionChain(url, options = {}) {
  return useQuery(
    ['evolution-chain', url],
    () => fetchEvolutionChain(url),
    { enabled: !!url, ...options }
  )
}

// ── Combined Pokemon Detail ──────────────────────────────────

export function usePokemonDetail(idOrName) {
  const pokemonQuery = usePokemon(idOrName)
  const speciesQuery = usePokemonSpecies(idOrName, {
    enabled: !!pokemonQuery.data,
  })
  const evolutionQuery = useEvolutionChain(
    speciesQuery.data?.evolution_chain?.url,
    { enabled: !!speciesQuery.data?.evolution_chain?.url }
  )

  return {
    pokemon: pokemonQuery.data,
    species: speciesQuery.data,
    evolutionChain: evolutionQuery.data,
    isLoading: pokemonQuery.isLoading || speciesQuery.isLoading,
    isError: pokemonQuery.isError || speciesQuery.isError,
    error: pokemonQuery.error || speciesQuery.error,
  }
}

// ── Pokemon List ─────────────────────────────────────────────

export function usePokemonList(limit = 151, offset = 0) {
  return useQuery(
    ['pokemon-list', limit, offset],
    () => fetchPokemonList(limit, offset),
    { keepPreviousData: true }
  )
}

// ── Batch ────────────────────────────────────────────────────

export function usePokemonBatch(ids, options = {}) {
  return useQuery(
    ['pokemon-batch', ids?.join(',')],
    () => fetchPokemonBatch(ids),
    { enabled: !!ids?.length, ...options }
  )
}

// ── Ability ──────────────────────────────────────────────────

export function useAbility(idOrName, options = {}) {
  return useQuery(
    ['ability', idOrName],
    () => fetchAbility(idOrName),
    { enabled: !!idOrName, ...options }
  )
}

// ── Move ─────────────────────────────────────────────────────

export function useMove(idOrName, options = {}) {
  return useQuery(
    ['move', idOrName],
    () => fetchMove(idOrName),
    { enabled: !!idOrName, ...options }
  )
}

// ── Type ─────────────────────────────────────────────────────

export function useTypeData(idOrName, options = {}) {
  return useQuery(
    ['type', idOrName],
    () => fetchType(idOrName),
    { enabled: !!idOrName, ...options }
  )
}
