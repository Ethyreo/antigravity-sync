import React, { useState } from 'react';
import VerticalMap from './components/VerticalMap';
import AuthGate from './components/AuthGate';

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  if (!isUnlocked) {
    return <AuthGate onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-10 px-6 py-4">
        <h1 className="text-xl font-bold tracking-widest uppercase text-slate-800">
          Shimla Building
        </h1>
        <p className="text-xs text-slate-500 font-medium tracking-wider uppercase mt-0.5">
          Property Management
        </p>
      </header>

      <main className="pt-24 px-4 sm:px-6 max-w-lg mx-auto">
        <VerticalMap />
      </main>
    </div>
  );
}

export default App;
