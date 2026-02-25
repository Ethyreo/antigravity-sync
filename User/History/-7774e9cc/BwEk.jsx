import React, { useState } from 'react';
import BulkDataEntry from './components/BulkDataEntry';
import AuthGate from './components/AuthGate';
import Dashboard from './components/Dashboard';
import FilterBar from './components/FilterBar';
import BuildingVisualMap from './components/BuildingVisualMap';
import UnitDetailModal from './components/UnitDetailModal';
import RentAlert from './components/RentAlert';
import { FilterProvider } from './context/FilterContext';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'bulk'

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
          {currentView === 'home' ? (
            <>
              {/* Active Alerts */}
              <RentAlert updateTrigger={updateTrigger} onSelectUnit={setSelectedUnit} />

              {/* Top Visual Anchor */}
              <BuildingVisualMap key={`bg-${updateTrigger}`} onSelectUnit={setSelectedUnit} />

              {/* Navigation & Controls */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setCurrentView('bulk')}
                  className="bg-slate-900 text-white font-bold py-2.5 px-6 rounded-xl shadow-md hover:bg-slate-800 transition-colors"
                >
                  Open Bulk Entry Menu
                </button>
              </div>

              <FilterBar key={`fb-${updateTrigger}`} />
              <Dashboard key={`db-${updateTrigger}`} />
            </>
          ) : (
            <BulkDataEntry
              key={`bulk-${updateTrigger}`}
              triggerUpdate={() => setUpdateTrigger(prev => prev + 1)}
              onBack={() => setCurrentView('home')}
            />
          )}
        </main>

        <AnimatePresence>
          {selectedUnit && (
            <UnitDetailModal
              unit={selectedUnit}
              onClose={() => setSelectedUnit(null)}
              onUpdate={() => setUpdateTrigger(prev => prev + 1)}
            />
          )}
        </AnimatePresence>
      </div>
    </FilterProvider>
  );
}

export default App;
