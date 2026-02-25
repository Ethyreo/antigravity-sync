import React, { useState } from 'react';
import VerticalMap from './components/VerticalMap';
import AuthGate from './components/AuthGate';
import Dashboard from './components/Dashboard';
import FilterBar from './components/FilterBar';
import BuildingVisualMap from './components/BuildingVisualMap';
import UnitDetailModal from './components/UnitDetailModal';
import { FilterProvider } from './context/FilterContext';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  if (!isUnlocked) {
    return <AuthGate onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <FilterProvider>
      <div className="min-h-screen pb-24 bg-[#F8FAFC]">
        <header className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-30 px-6 py-4">
          <h1 className="text-xl font-bold tracking-widest uppercase text-slate-800">
            Oak Lodge
          </h1>
          <p className="text-xs text-slate-500 font-medium tracking-wider uppercase mt-0.5">
            Property Management
          </p>
        </header>

        <main className="pt-24 px-4 sm:px-6 max-w-5xl mx-auto">
          {/* Top Visual Anchor */}
          <BuildingVisualMap onSelectUnit={setSelectedUnit} />

          <FilterBar />
          <Dashboard />

          {/* Fallback to traditional list for deeper look if needed */}
          <VerticalMap />
        </main>

        <AnimatePresence>
          {selectedUnit && (
            <UnitDetailModal
              unit={selectedUnit}
              onClose={() => setSelectedUnit(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </FilterProvider>
  );
}

export default App;
