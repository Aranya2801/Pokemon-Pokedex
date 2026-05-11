<div align="center">

<img src="pokeball.svg" width="80" alt="PokéDex Pro Logo"/>

# 🔴 PokéDex Pro — Advanced Pokémon Encyclopedia

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![PokeAPI](https://img.shields.io/badge/PokeAPI-v2-EF5350?style=for-the-badge)](https://pokeapi.co/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

> **A production-grade, MIT-level Pokémon Encyclopedia** built with cutting-edge React architecture, live PokeAPI data, a battle simulator, team builder, full type chart, and much more — designed for competitive players and casual fans alike.

[🚀 Live Demo](#) • [📖 Docs](#documentation) • [🐛 Issues](../../issues) • [⭐ Star this repo](#)

---

<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" width="100" />
<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png" width="100" />
<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png" width="100" />
<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png" width="100" />
<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/800.png" width="100" />

</div>

---

## ✨ Features

### 🗺️ Full National Pokédex
- **1,025+ Pokémon** from all 9 generations (Kanto → Paldea)
- Live data powered by [PokeAPI v2](https://pokeapi.co/) — no static files needed
- Advanced **fuzzy search** using Fuse.js (search by name, ID)
- Multi-filter: **Type × Generation × Sort** combinations
- Virtualized grid rendering for smooth 60fps scrolling
- Toggle between **Normal** and **Shiny** sprites
- Instant **Load More** pagination (40 per page)

### 📋 Pokémon Detail Pages
- **6 tabs**: Overview · Stats · Moves · Evolution · Abilities · Locations
- Official artwork + shiny, home, dream world, front/back sprite variants
- Full **type effectiveness chart** (4× / 2× / 1× / ½× / 0× incoming damage)
- **Interactive stat radar chart** (Recharts)
- Animated **stat bars** with percentage visualization
- Complete **evolution chain** with level/item triggers
- Flavor text, genus, height, weight, catch rate, happiness, growth rate, egg groups
- Quick links to **Bulbapedia** and **Smogon**
- Keyboard navigation between Pokémon (#prev / #next)

### ⚔️ Team Builder
- Build up to **6-Pokémon teams** with drag-and-drop reordering
- **Multiple saved teams** with create/rename/delete support
- **Persistent storage** via `localStorage` — your teams survive page refresh
- **Type coverage analysis**: Super Effective / Resistances / Immunities / Shared Weaknesses
- **Team stat averages** with colour-coded bar charts (HP, ATK, DEF, SP.ATK, SP.DEF, SPD)
- Quick-add from any Pokémon card in the Pokédex

### 🥊 Battle Simulator
- Simulate battles between **any two Pokémon**
- Configurable **Level** (1–100), **Nature** (all 25 natures with stat multipliers)
- EV/IV–aware **stat calculation** using the official formula
- Real-time **type matchup preview** (0× to 4×)
- Full **turn-by-turn battle log** with HP bars
- Winner declaration with final HP display

### 📊 Type Chart
- Complete **18×18 type effectiveness matrix** (Gen IX)
- Colour-coded cells: 4× (red) · 2× (pink) · 1× · ½× (green) · 0× (grey)
- Hover column highlighting for easy reading
- **Per-type quick lookup cards** — weaknesses, resistances, immunities at a glance

### 💫 Moves Dex
- Browse **920+ moves** with live search
- Searchable by name in real time

### ⚖️ Pokémon Comparator
- Side-by-side **stat comparison** of any two Pokémon
- Colour-coded stat bars showing winners per category
- Base Stat Total comparison

### ❤️ Favourites
- One-click favourite from any card or detail page
- Persistent across sessions via `localStorage`
- Dedicated favourites page with full card grid

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | React 18 + Vite 5 |
| **Routing** | React Router v6 |
| **State** | Zustand + React Context + localStorage |
| **Data Fetching** | React Query v3 (10-min stale, 30-min cache) |
| **Animation** | Framer Motion v11 |
| **Charts** | Recharts (Radar, Bar) |
| **Search** | Fuse.js v7 (fuzzy) |
| **Styling** | CSS Modules + CSS Custom Properties |
| **API** | PokeAPI v2 (free, no key needed) |
| **Notifications** | react-hot-toast |
| **Fonts** | Oxanium (display) + Inter (body) |
| **Build** | Vite with code-splitting (4 chunks) |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or pnpm / yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/Aranya2801/Pokemon-Pokedex.git
cd Pokemon-Pokedex

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app hot-reloads automatically.

### Build for Production

```bash
npm run build       # Creates optimized dist/ bundle
npm run preview     # Preview the production build locally
```

---

## 📁 Project Architecture

```
pokemon-pokedex/
├── public/
│   └── pokeball.svg              # Favicon
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── Navbar.jsx            # Responsive sticky navigation
│   │   ├── Navbar.module.css
│   │   ├── PokemonCard.jsx       # Grid card with hover effects
│   │   ├── PokemonCard.module.css
│   │   ├── LoadingScreen.jsx     # Animated pokeball loader
│   │   └── LoadingScreen.module.css
│   ├── context/                  # Global state
│   │   ├── PokemonContext.jsx    # Favourites, history, settings
│   │   └── TeamContext.jsx       # Multi-team management
│   ├── hooks/                    # Custom React hooks
│   │   └── usePokemon.js         # React Query wrappers
│   ├── pages/                    # Route-level page components
│   │   ├── Home.jsx              # Landing page with spotlight
│   │   ├── Pokedex.jsx           # Full filterable Pokédex
│   │   ├── PokemonDetail.jsx     # Deep dive Pokémon page
│   │   ├── TeamBuilder.jsx       # Team builder + analysis
│   │   ├── BattleSimulator.jsx   # Battle engine + log
│   │   ├── TypeChart.jsx         # Full 18×18 type grid
│   │   ├── MovesDex.jsx          # Move browser
│   │   ├── Compare.jsx           # Side-by-side comparator
│   │   └── Favorites.jsx         # Saved favourites
│   ├── styles/
│   │   └── globals.css           # Design system + CSS variables
│   ├── utils/
│   │   └── pokeapi.js            # API layer, type data, helpers
│   ├── App.jsx                   # Routes + providers
│   └── main.jsx                  # React DOM entry
├── index.html
├── vite.config.js
└── package.json
```

---

## 🎨 Design System

The app uses a dark-first design system with CSS Custom Properties:

```css
/* Core Palette */
--bg-primary:   #0a0a0f    /* page background */
--bg-card:      #13131f    /* card background  */
--accent-red:   #ff3b3b    /* primary accent   */
--accent-gold:  #ffd700    /* secondary accent */
--accent-blue:  #4fc3f7    /* info accent      */

/* Typography */
--font-display: 'Oxanium'  /* headings, badges */
--font-body:    'Inter'    /* body text        */
```

All **18 Pokémon type colours** are defined as CSS variables and applied dynamically to cards, bars, and glows.

---

## 🌐 Data Source

This app uses **[PokeAPI](https://pokeapi.co/)** — a completely free, open REST API with no API key required.

- Base URL: `https://pokeapi.co/api/v2/`
- Sprites: `https://raw.githubusercontent.com/PokeAPI/sprites/master/`
- All data is fetched live and cached via React Query

> **No datasets to download** — everything is fetched from the open PokeAPI in real-time.

---

## ⚡ Performance

| Optimization | Implementation |
|---|---|
| **Code splitting** | 4 Vite chunks (react, animation, chart, query) |
| **Lazy loading** | All 9 page components loaded on demand |
| **API caching** | React Query: 10-min stale · 30-min cache |
| **In-memory cache** | Custom `Map`-based cache in `pokeapi.js` |
| **Image lazy load** | Native `loading="lazy"` on all sprites |
| **Skeleton loaders** | Shimmer skeletons while images load |
| **Debounced search** | Fuse.js fuzzy search on local data |

---

## 📱 Responsive Design

| Breakpoint | Layout |
|---|---|
| **Desktop** (>900px) | Full sidebar navigation, 2-column detail layout |
| **Tablet** (600–900px) | Hamburger menu, stacked detail layout |
| **Mobile** (<600px) | 2-column card grid, compact stats |

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify

```bash
npm run build
# Drag & drop the dist/ folder to netlify.com/drop
```

### Deploy to GitHub Pages

```bash
npm install --save-dev gh-pages

# In package.json, add:
# "homepage": "https://Aranya2801.github.io/Pokemon-Pokedex",
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"

npm run deploy
```

---

## 🗺️ Roadmap

- [ ] **Competitive Sets** — Smogon strategy integration per Pokémon
- [ ] **Pokémon Sound** — Cry audio via PokeAPI
- [ ] **Held Items Dex** — Browse all items with effects
- [ ] **Random Pokémon** — "Surprise me" button
- [ ] **Export Team** — Share team as image or Showdown paste
- [ ] **PWA Support** — Offline mode + installable app
- [ ] **3D Models** — Three.js rotating Pokémon models
- [ ] **Competitive Tier Filter** — OU / UU / Ubers / etc.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📜 License

MIT © [Aranya](https://github.com/Aranya2801)

---

## 🙏 Acknowledgements

- [PokeAPI](https://pokeapi.co/) — Free Pokémon data API
- [Pokémon](https://www.pokemon.com/) — All Pokémon are property of Nintendo / Game Freak / The Pokémon Company
- [Bulbapedia](https://bulbapedia.bulbagarden.net/) — Reference for game mechanics
- [Smogon](https://www.smogon.com/) — Competitive Pokémon strategy

> *This project is a fan-made educational tool and is not affiliated with Nintendo, Game Freak, or The Pokémon Company.*

---

<div align="center">

Made with ❤️ by **Aranya** · ⭐ Star this repo if you find it useful!

<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png" width="60" />

</div>
