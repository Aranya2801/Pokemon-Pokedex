/**
 * PokéAPI Service Layer
 * Centralized API calls with caching and error handling
 */

const BASE_URL = 'https://pokeapi.co/api/v2'
const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

// In-memory cache
const cache = new Map()

async function fetchWithCache(url) {
  if (cache.has(url)) return cache.get(url)
  
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch: ${url} — ${response.status}`)
  
  const data = await response.json()
  cache.set(url, data)
  return data
}

// ── Pokemon ──────────────────────────────────────────────────

export async function fetchPokemonList(limit = 151, offset = 0) {
  return fetchWithCache(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
}

export async function fetchPokemon(idOrName) {
  return fetchWithCache(`${BASE_URL}/pokemon/${idOrName}`)
}

export async function fetchPokemonSpecies(idOrName) {
  return fetchWithCache(`${BASE_URL}/pokemon-species/${idOrName}`)
}

export async function fetchEvolutionChain(url) {
  return fetchWithCache(url)
}

export async function fetchAbility(idOrName) {
  return fetchWithCache(`${BASE_URL}/ability/${idOrName}`)
}

export async function fetchMove(idOrName) {
  return fetchWithCache(`${BASE_URL}/move/${idOrName}`)
}

export async function fetchType(idOrName) {
  return fetchWithCache(`${BASE_URL}/type/${idOrName}`)
}

export async function fetchGeneration(id) {
  return fetchWithCache(`${BASE_URL}/generation/${id}`)
}

export async function fetchItem(idOrName) {
  return fetchWithCache(`${BASE_URL}/item/${idOrName}`)
}

// ── Batch Fetch ──────────────────────────────────────────────

export async function fetchPokemonBatch(ids) {
  return Promise.all(ids.map(id => fetchPokemon(id)))
}

export async function fetchAllTypes() {
  const data = await fetchWithCache(`${BASE_URL}/type?limit=18`)
  return data.results
}

// ── Sprites ──────────────────────────────────────────────────

export function getSpriteUrl(id, variant = 'default') {
  const variantMap = {
    default: `${SPRITE_BASE}/${id}.png`,
    shiny: `${SPRITE_BASE}/shiny/${id}.png`,
    'official-artwork': `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    'official-artwork-shiny': `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`,
    dream_world: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`,
    'home': `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`,
  }
  return variantMap[variant] || variantMap.default
}

export function getItemSpriteUrl(name) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${name}.png`
}

// ── Type Colors ──────────────────────────────────────────────

export const TYPE_COLORS = {
  normal:   '#A8A878',
  fire:     '#F08030',
  water:    '#6890F0',
  electric: '#F8D030',
  grass:    '#78C850',
  ice:      '#98D8D8',
  fighting: '#C03028',
  poison:   '#A040A0',
  ground:   '#E0C068',
  flying:   '#A890F0',
  psychic:  '#F85888',
  bug:      '#A8B820',
  rock:     '#B8A038',
  ghost:    '#705898',
  dragon:   '#7038F8',
  dark:     '#705848',
  steel:    '#B8B8D0',
  fairy:    '#EE99AC',
  unknown:  '#68A090',
  shadow:   '#3B3B6B',
}

export const TYPE_ICONS = {
  normal:   '⚪', fire: '🔥', water: '💧', electric: '⚡',
  grass:    '🌿', ice: '❄️', fighting: '🥊', poison: '☠️',
  ground:   '🌍', flying: '🦅', psychic: '🔮', bug: '🐛',
  rock:     '🪨', ghost: '👻', dragon: '🐉', dark: '🌑',
  steel:    '⚙️', fairy: '✨',
}

// ── Stats ────────────────────────────────────────────────────

export const STAT_LABELS = {
  hp:              'HP',
  attack:          'ATK',
  defense:         'DEF',
  'special-attack': 'SP.ATK',
  'special-defense':'SP.DEF',
  speed:           'SPD',
}

export const STAT_MAX = {
  hp: 255, attack: 165, defense: 230,
  'special-attack': 194, 'special-defense': 230, speed: 200
}

// ── Damage Calculation ──────────────────────────────────────

export const TYPE_CHART = {
  normal:   { fighting: 2, ghost: 0 },
  fire:     { water: 2, ground: 2, rock: 2, fire: 0.5, grass: 0.5, ice: 0.5, bug: 0.5, steel: 0.5, fairy: 0.5 },
  water:    { electric: 2, grass: 2, fire: 0.5, water: 0.5, ice: 0.5, steel: 0.5 },
  electric: { ground: 2, electric: 0.5, flying: 0.5, steel: 0.5 },
  grass:    { fire: 2, ice: 2, poison: 2, flying: 2, bug: 2, water: 0.5, electric: 0.5, grass: 0.5, ground: 0.5 },
  ice:      { fire: 2, fighting: 2, rock: 2, steel: 2, ice: 0.5 },
  fighting: { flying: 2, psychic: 2, fairy: 2, bug: 0.5, rock: 0.5, dark: 0.5, ghost: 0 },
  poison:   { ground: 2, psychic: 2, fighting: 0.5, poison: 0.5, bug: 0.5, grass: 0.5, fairy: 0.5 },
  ground:   { water: 2, grass: 2, ice: 2, electric: 0, poison: 0.5, rock: 0.5, bug: 0.5 },
  flying:   { electric: 2, ice: 2, rock: 2, fighting: 0.5, bug: 0.5, grass: 0.5, ground: 0 },
  psychic:  { bug: 2, ghost: 2, dark: 2, fighting: 0.5, psychic: 0.5 },
  bug:      { fire: 2, flying: 2, rock: 2, fighting: 0.5, ground: 0.5, grass: 0.5 },
  rock:     { water: 2, grass: 2, fighting: 2, ground: 2, steel: 2, normal: 0.5, fire: 0.5, poison: 0.5, flying: 0.5 },
  ghost:    { ghost: 2, dark: 2, normal: 0, fighting: 0, poison: 0.5, bug: 0.5 },
  dragon:   { ice: 2, dragon: 2, fairy: 2, fire: 0.5, water: 0.5, electric: 0.5, grass: 0.5 },
  dark:     { fighting: 2, bug: 2, fairy: 2, ghost: 0.5, dark: 0.5, psychic: 0 },
  steel:    { fire: 2, fighting: 2, ground: 2, normal: 0.5, grass: 0.5, ice: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 0.5, dragon: 0.5, steel: 0.5, fairy: 0.5, poison: 0, electric: 0.5 },
  fairy:    { poison: 2, steel: 2, fighting: 0.5, bug: 0.5, dark: 0.5, dragon: 0 },
}

export function calculateTypeEffectiveness(attackingType, defendingTypes) {
  let multiplier = 1
  const chart = TYPE_CHART[attackingType] || {}
  for (const defType of defendingTypes) {
    multiplier *= chart[defType] ?? 1
  }
  return multiplier
}

// ── Helpers ──────────────────────────────────────────────────

export function extractEnglishEntry(entries, language = 'en') {
  return entries?.find(e => e.language.name === language)?.flavor_text?.replace(/\f/g, ' ') || ''
}

export function extractEnglishName(names, language = 'en') {
  return names?.find(n => n.language.name === language)?.name || ''
}

export function formatStatTotal(stats) {
  return stats?.reduce((sum, s) => sum + s.base_stat, 0) || 0
}

export function pokemonIdFromUrl(url) {
  const parts = url.replace(/\/$/, '').split('/')
  return parseInt(parts[parts.length - 1], 10)
}

export function getGenerationName(id) {
  const gens = {
    1: 'Generation I — Kanto',
    2: 'Generation II — Johto',
    3: 'Generation III — Hoenn',
    4: 'Generation IV — Sinnoh',
    5: 'Generation V — Unova',
    6: 'Generation VI — Kalos',
    7: 'Generation VII — Alola',
    8: 'Generation VIII — Galar',
    9: 'Generation IX — Paldea',
  }
  return gens[id] || `Generation ${id}`
}

export const GENERATIONS = [
  { id: 1, name: 'Gen I', range: [1, 151], region: 'Kanto' },
  { id: 2, name: 'Gen II', range: [152, 251], region: 'Johto' },
  { id: 3, name: 'Gen III', range: [252, 386], region: 'Hoenn' },
  { id: 4, name: 'Gen IV', range: [387, 493], region: 'Sinnoh' },
  { id: 5, name: 'Gen V', range: [494, 649], region: 'Unova' },
  { id: 6, name: 'Gen VI', range: [650, 721], region: 'Kalos' },
  { id: 7, name: 'Gen VII', range: [722, 809], region: 'Alola' },
  { id: 8, name: 'Gen VIII', range: [810, 905], region: 'Galar' },
  { id: 9, name: 'Gen IX', range: [906, 1025], region: 'Paldea' },
]

export function getPokemonGeneration(id) {
  return GENERATIONS.find(g => id >= g.range[0] && id <= g.range[1]) || GENERATIONS[0]
}
