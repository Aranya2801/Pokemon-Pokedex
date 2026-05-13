import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from '@components/Navbar'
import LoadingScreen from '@components/LoadingScreen'
import { PokemonProvider } from '@context/PokemonContext'
import { TeamProvider } from '@context/TeamContext'

// Lazy-loaded pages for performance
const Home = lazy(() => import('@pages/Home'))
const Pokedex = lazy(() => import('@pages/Pokedex'))
const PokemonDetail = lazy(() => import('@pages/PokemonDetail'))
const TeamBuilder = lazy(() => import('@pages/TeamBuilder'))
const BattleSimulator = lazy(() => import('@pages/BattleSimulator'))
const TypeChart = lazy(() => import('@pages/TypeChart'))
const MovesDex = lazy(() => import('@pages/MovesDex'))
const Compare = lazy(() => import('@pages/Compare'))
const Favorites = lazy(() => import('@pages/Favorites'))

export default function App() {
  return (
    <PokemonProvider>
      <TeamProvider>
        <div className="app-wrapper">
          <Navbar />
          <main className="main-content">
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pokedex" element={<Pokedex />} />
                <Route path="/pokemon/:id" element={<PokemonDetail />} />
                <Route path="/team-builder" element={<TeamBuilder />} />
                <Route path="/battle" element={<BattleSimulator />} />
                <Route path="/type-chart" element={<TypeChart />} />
                <Route path="/moves" element={<MovesDex />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/favorites" element={<Favorites />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </TeamProvider>
    </PokemonProvider>
  )
}
