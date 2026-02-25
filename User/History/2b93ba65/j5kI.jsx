import React from 'react';
import UnitCard from './UnitCard';

export default function FloorSection({ floor, onSelectUnit }) {
    return (
        <section className="relative">
            <div className="sticky top-[72px] z-10 bg-[#F8FAFC]/95 backdrop-blur-md py-2 -mx-4 px-4 sm:mx-0 sm:px-0 mb-2">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-4 h-px bg-slate-300"></span>
                    {floor.name}
                    <span className="flex-1 h-px bg-slate-200"></span>
                </h2>
            </div>

            <div className="flex flex-col gap-3">
                {floor.units.map((unit) => (
                    <UnitCard
                        key={unit.id}
                        unit={unit}
                        onSelect={() => onSelectUnit(unit)}
                    />
                ))}
            </div>
        </section>
    );
}
