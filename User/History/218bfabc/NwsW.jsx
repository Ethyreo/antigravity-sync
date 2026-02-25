import React, { useState } from 'react';
import { buildingData } from '../config/buildingLayout';
import FloorSection from './FloorSection';
import UnitDetailModal from './UnitDetailModal';
import { AnimatePresence } from 'framer-motion';

export default function VerticalMap() {
    const [selectedUnit, setSelectedUnit] = useState(null);

    return (
        <div className="flex flex-col gap-6 relative">
            {buildingData.floors.map((floor) => (
                <FloorSection
                    key={floor.level}
                    floor={floor}
                    onSelectUnit={setSelectedUnit}
                />
            ))}

            <AnimatePresence>
                {selectedUnit && (
                    <UnitDetailModal
                        unit={selectedUnit}
                        onClose={() => setSelectedUnit(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
