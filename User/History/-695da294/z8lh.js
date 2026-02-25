import React from 'react';
import { renderToString } from 'react-dom/server';
import UnitDetailModal from './src/components/UnitDetailModal.jsx';
import { buildingData } from './src/config/buildingLayout.js';

// Mock Lucide Icons so they don't break SSR
jest.mock('lucide-react', () => ({
    X: () => 'X', Copy: () => 'Copy', CheckCircle2: () => 'Check', History: () => 'History', Banknote: () => 'Banknote', Bolt: () => 'Bolt', Droplet: () => 'Droplet', Trash2: () => 'Trash2', IndianRupee: () => 'Rupee', AlertCircle: () => 'Alert', Edit2: () => 'Edit2', Save: () => 'Save', Phone: () => 'Phone', Zap: () => 'Zap'
}));

try {
    const testUnit = buildingData.floors.find(f => f.level === 4).units[0]; // 401
    const html = renderToString(React.createElement(UnitDetailModal, { unit: testUnit, onClose: () => { }, onUpdate: () => { } }));
    console.log("Rendered Successfully! Length:", html.length);
} catch (err) {
    console.error("REACT RENDER CRASH DETECTED:");
    console.error(err);
}
