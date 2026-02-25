import React from 'react';
import { buildingData } from '../config/buildingLayout';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useFilters } from '../context/FilterContext';

export default function BuildingVisualMap({ onSelectUnit }) {
    const { filters } = useFilters();

    // A helper to figure out structure classes based on the floor level
    // Shimla building gets narrower at the top. We'll simulate this with max-widths.
    const getFloorWidthClass = (level) => {
        if (level >= 5) return "max-w-[40%]"; // Owners res is small
        if (level === 4) return "max-w-[70%]"; // Silver Oak
        return "max-w-full"; // Base floors
    };

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 sm:p-8 mb-8 flex flex-col items-center shadow-inner relative overflow-hidden">
            {/* Decorative sky/background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl -mr-10 -mt-10"></div>

            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 w-full text-center">
                Building Architecture
            </h2>

            <div className="w-full flex flex-col gap-2 items-center">
                {buildingData.floors.map((floor) => (
                    <div
                        key={floor.level}
                        className={clsx(
                            "w-full flex gap-2 justify-center",
                            getFloorWidthClass(floor.level)
                        )}
                    >
                        {floor.units.map(unit => {
                            const isFilteredOut =
                                (filters.floor !== 'all' && filters.floor !== floor.level.toString()) ||
                                (filters.unit !== 'all' && filters.unit !== unit.id);

                            return (
                                <motion.button
                                    key={unit.id}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => onSelectUnit(unit)}
                                    className={clsx(
                                        "flex-1 h-14 sm:h-16 rounded-xl border relative overflow-hidden transition-all duration-300",
                                        unit.isProminent ? "bg-slate-800 border-slate-900 text-white shadow-md" : "bg-white border-slate-200 text-slate-700 shadow-sm",
                                        unit.isPrivate ? "opacity-60 bg-slate-100" : "",
                                        isFilteredOut ? "opacity-20 grayscale scale-95" : ""
                                    )}
                                >
                                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/5 to-transparent"></div>
                                    <span className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-bold uppercase tracking-wider z-10">
                                        {unit.id}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="mt-8 w-full max-w-[80%] h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-4 font-semibold">Street Level</p>
        </div>
    );
}
