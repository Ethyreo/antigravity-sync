```
import React from 'react';
import { buildingData } from '../config/buildingLayout';
import FloorSection from './FloorSection';
import { useFilters } from '../context/FilterContext';

export default function VerticalMap() {
  const { filters } = useFilters();

  return (
    <div className="flex flex-col gap-6 relative max-w-lg mx-auto pt-8 border-t border-slate-200 mt-8">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest w-full text-center">
        Detailed Directory
      </h2>
      {buildingData.floors.map((floor) => {
        // Hide entire floor from list if filtered out
        if (filters.floor !== 'all' && filters.floor !== floor.level.toString()) return null;
        
        // At the list level, we don't need to rebuild the units, FloorSection will render them all,
        // but let's pass down a filter flag to UnitCard inside FloorSection
        return (
          <FloorSection 
            key={floor.level} 
            floor={floor} 
          />
        );
      })}
    </div>
  );
}
```
