import React, { useState } from 'react';
import BulkDataEntry from './components/BulkDataEntry';
import HistoricalTenants from './components/HistoricalTenants';
import AuthGate from './components/AuthGate';
import Dashboard from './components/Dashboard';
import FilterBar from './components/FilterBar';
import BuildingVisualMap from './components/BuildingVisualMap';
import UnitDetailModal from './components/UnitDetailModal';
import RentAlert from './components/RentAlert';
import TenantManagementModal from './components/TenantManagementModal';
import { FilterProvider } from './context/FilterContext';
import { buildingData } from './config/buildingLayout';
import { fetchBuildingStateFromCloud } from './utils/cloudSync';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isHydrating, setIsHydrating] = useState(false);  // Phase 8: Cloud Status
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'bulk' | 'history'

  // --- Phase 8 Cloud Hydration Engine ---
  const hydrateAppFromCloud = async () => {
    setIsHydrating(true);
    try {
      console.log("Fetching Master Cloud Database from Firestore...");
      const cloudDb = await fetchBuildingStateFromCloud();

      if (cloudDb.success === false) {
        console.error("Firestore DB initialization empty or failed:", cloudDb.error);
        setIsHydrating(false);
        return;
      }

      console.log("Cloud payload received. Mapping to physical skeleton...");

      // Inject Cloud Data into the local blank skeleton (buildingData)
      buildingData.floors.forEach(floor => {
        floor.units.forEach(unit => {

          // 1. Map Ledger (Rent & Bills) to unit.monthlyRecords
          if (!unit.monthlyRecords) unit.monthlyRecords = {};
          if (!unit.rentHistory) unit.rentHistory = [];

          const unitLedgerRows = cloudDb.ledger.filter(row => row.UnitID === unit.id);
          unitLedgerRows.forEach(row => {
            unit.monthlyRecords[row.BillingMonth] = {
              rentStatus: row.RentStatus,
              elecBill: row.Electricity,
              waterBill: row.Water,
              garbageBill: row.Garbage
            };

            // Synthesize rentHistory state for UI backward combability
            // If the unit has rent set, populate it
            if (row.RentAmount) {
              // Only keep the latest one for simplicity in the current mockup, in prod you trace all
              unit.rentHistory = [{ amount: row.RentAmount, startMonth: "2026-01", endMonth: null }];
            }
          });

          // 2. Map Tenant Profiles to unit.tenantHistory
          const unitTenants = cloudDb.tenants.filter(row => row.UnitID === unit.id);
          unit.tenantHistory = unitTenants.map(t => ({
            name: t.TenantName,
            company: t.Company,
            joinDate: t.JoinDate,
            leaveDate: t.LeaveDate === 'Current' ? null : t.LeaveDate
          }));
        });
      });

      console.log("Hydration Complete.");

    } catch (err) {
      console.error("Critical Hydration Crash:", err);
    }

    // Release UI Lock
    setIsHydrating(false);
    setUpdateTrigger(prev => prev + 1);
  };

  // Trigger hydration the moment the gate unlocks
  React.useEffect(() => {
    if (isUnlocked) {
      hydrateAppFromCloud();
    }
  }, [isUnlocked]);
  // ----------------------------------------

  if (!isUnlocked) {
    return <AuthGate onUnlock={() => setIsUnlocked(true)} />;
  }

  // Blocking System Loader Phase
  if (isHydrating) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 sm:p-8">
        <Loader2 size={48} className="text-emerald-400 animate-spin mb-6" />
        <h2 className="text-xl font-bold text-white tracking-widest uppercase mb-2">Syncing with Cloud</h2>
        <p className="text-slate-400 font-medium tracking-wide text-sm text-center max-w-sm">
          Fetching master tenant and ledger databases securely from Google servers...
        </p>
      </div>
    );
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
              <div className="flex justify-end gap-3 mb-4 flex-wrap">
                <button
                  onClick={() => setCurrentView('history')}
                  className="bg-white border border-slate-200 text-slate-700 font-bold py-2.5 px-6 rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
                >
                  Tenant Directory
                </button>
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
          ) : currentView === 'bulk' ? (
            <BulkDataEntry
              key={`bulk-${updateTrigger}`}
              triggerUpdate={() => setUpdateTrigger(prev => prev + 1)}
              onBack={() => setCurrentView('home')}
            />
          ) : (
            <HistoricalTenants
              onBack={() => setCurrentView('home')}
              onManageTenants={() => setShowTenantModal(true)}
            />
          )}
        </main>

        <ErrorBoundary>
          <AnimatePresence>
            {showTenantModal && (
              <TenantManagementModal
                key="tenant-manager-modal"
                onClose={() => setShowTenantModal(false)}
                onUpdate={() => {
                  // Upon modifying a tenant local hook, flush to cloud by repushing payload?
                  // Right now TenantModal only mutates local Data.
                  // To adhere to Phase 8, it must hit Cloud first.
                  // As a quick sync, let's just trigger a UI reload for now.
                  setUpdateTrigger(prev => prev + 1);
                }}
              />
            )}

            {selectedUnit && !showTenantModal && (
              <UnitDetailModal
                key={`unit-detail-${selectedUnit.id}`}
                unit={selectedUnit}
                onClose={() => setSelectedUnit(null)}
                onUpdate={() => setUpdateTrigger(prev => prev + 1)}
              />
            )}
          </AnimatePresence>
        </ErrorBoundary>
      </div>
    </FilterProvider>
  );
}

export default App;
