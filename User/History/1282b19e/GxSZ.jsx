import React from 'react';
import { buildingData } from '../config/buildingLayout';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useFilters } from '../context/FilterContext';

export default function BuildingVisualMap({ onSelectUnit }) {
    const { filters } = useFilters();

    // A helper to figure out structure classes based on the floor level
    const getFloorWidthClass = (level) => {
        if (level >= 5) return "max-w-[45%]"; // Owners res is small
        if (level === 4) return "max-w-[75%]"; // Silver Oak
        return "max-w-[90%]"; // Base floors
    };

    return (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-10 mb-8 flex flex-col items-center shadow-sm relative overflow-hidden min-h-[500px] justify-end">



            {/* Decorative ambient lighting */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-10 left-0 w-48 h-48 bg-slate-200/40 rounded-full blur-3xl -ml-10 pointer-events-none"></div>

            <h2 className="absolute top-8 left-8 text-xs font-bold text-slate-400 uppercase tracking-widest z-10 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-100">
                Live Architecture
            </h2>

            {/* The Physical Building Structure */}
            <div className="w-full max-w-sm flex flex-col items-center relative z-10 mt-16">

                {/* Roof Structure */}
                <div className="w-[40%] h-4 bg-slate-100 border-t border-x border-slate-200 rounded-t-lg mb-1 shadow-inner z-20"></div>
                <div className="w-[48%] h-3 bg-slate-200 border-t border-x border-slate-300 rounded-t-md mb-2 shadow-sm z-20"></div>

                {/* Building Core */}
                <div className="w-full flex flex-col items-center bg-slate-50/80 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-slate-200/60 shadow-xl">
                    {buildingData.floors.map((floor) => (
                        <div
                            key={floor.level}
                            className={clsx(
                                "w-full flex gap-2 justify-center mb-2 last:mb-0 relative",
                                getFloorWidthClass(floor.level)
                            )}
                        >
                            {/* Balcony/Ledge Accent */}
                            <div className="absolute -bottom-1 inset-x-2 h-1 bg-slate-200/50 rounded-full pointer-events-none"></div>

                            {floor.units.map(unit => {
                                const isFilteredOut =
                                    (filters.floor !== 'all' && filters.floor !== floor.level.toString()) ||
                                    (filters.unit !== 'all' && filters.unit !== unit.id) ||
                                    (filters.elec !== 'all' && filters.elec !== unit.elecUnit) ||
                                    (filters.water !== 'all' && filters.water !== unit.waterConn);

                                return (
                                    <motion.button
                                        key={unit.id}
                                        whileHover={{ scale: 1.05, zIndex: 10 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => onSelectUnit(unit)}
                                        className={clsx(
                                            "group flex-1 h-12 sm:h-14 rounded-lg border backdrop-blur-sm relative overflow-hidden transition-all duration-500",
                                            unit.isProminent
                                                ? "bg-slate-800/90 border-slate-700 text-white shadow-lg"
                                                : "bg-white/90 border-slate-200 text-slate-700 shadow-sm hover:shadow-md",
                                            unit.isPrivate
                                                ? "opacity-80 bg-slate-200/80 border-slate-300/50"
                                                : "",
                                            isFilteredOut
                                                ? "opacity-20 grayscale scale-95"
                                                : "opacity-100"
                                        )}
                                    >
                                        {/* Glass glare effect */}
                                        <div className="absolute top-0 left-0 right-[-50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:animate-[glare_1.5s_ease-in-out]"></div>

                                        <span className={clsx(
                                            "absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-bold uppercase tracking-wider z-10",
                                            unit.isProminent ? "text-slate-100" : "text-slate-600"
                                        )}>
                                            {unit.isPrivate ? 'PRIVATE' : unit.id}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Foundation & Base */}
                <div className="w-[95%] h-6 bg-slate-200 border border-slate-300 rounded-b-md mt-2 shadow-inner z-20 flex justify-center items-center">
                    <div className="w-16 h-3 bg-slate-300/50 rounded-full"></div>
                </div>
                <div className="w-full h-8 bg-gradient-to-b from-slate-100 to-transparent flex justify-center mt-1 -mb-6 relative z-10">
                    <div className="w-32 h-full bg-slate-100/50 skew-x-12"></div>
                </div>
            </div>

            {/* Street Line */}
            <div className="mt-8 w-full max-w-lg h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent z-10"></div>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-2 font-bold z-10">Street Level Foundation</p>
        </div>
    );
}
