import React from 'react';
import { useFilters } from '../context/FilterContext';
import { buildingData } from '../config/buildingLayout';
import { Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FilterBar() {
    const { filters, updateFilter, resetFilters } = useFilters();
    const [isOpen, setIsOpen] = React.useState(false);

    // Derive unique options
    const allUnits = buildingData.floors.flatMap(f => f.units).filter(u => !u.isPrivate);
    const elecMeters = [...new Set(allUnits.map(u => u.elecUnit))];
    const waterConns = [...new Set(allUnits.map(u => u.waterConn))];

    const hasActiveFilters = Object.values(filters).some(v => v !== 'all');

    return (
        <div className="mb-6 z-20 relative">
            <div className="flex items-center justify-between mb-2">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <Filter size={16} />
                    Filters
                </button>

                {hasActiveFilters && (
                    <button
                        onClick={resetFilters}
                        className="text-[10px] font-bold uppercase tracking-widest text-rose-500 bg-rose-50 px-3 py-1.5 rounded-full hover:bg-rose-100 transition-colors flex items-center gap-1"
                    >
                        Clear All <X size={12} />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Floor</label>
                                <select
                                    value={filters.floor}
                                    onChange={(e) => updateFilter('floor', e.target.value)}
                                    className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-slate-400 focus:border-slate-400 block w-full p-2.5 outline-none font-medium"
                                >
                                    <option value="all">All Floors</option>
                                    {buildingData.floors.filter(f => f.level < 5).map(f => (
                                        <option key={f.level} value={f.level}>{f.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Unit</label>
                                <select
                                    value={filters.unit}
                                    onChange={(e) => updateFilter('unit', e.target.value)}
                                    className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-slate-400 focus:border-slate-400 block w-full p-2.5 outline-none font-medium"
                                >
                                    <option value="all">All Units</option>
                                    {allUnits.map(u => (
                                        <option key={u.id} value={u.id}>{u.name} ({u.id})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Elec. Meter</label>
                                <select
                                    value={filters.elec}
                                    onChange={(e) => updateFilter('elec', e.target.value)}
                                    className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-slate-400 focus:border-slate-400 block w-full p-2.5 outline-none font-medium"
                                >
                                    <option value="all">All Meters</option>
                                    {elecMeters.map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Water Conn.</label>
                                <select
                                    value={filters.water}
                                    onChange={(e) => updateFilter('water', e.target.value)}
                                    className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-slate-400 focus:border-slate-400 block w-full p-2.5 outline-none font-medium"
                                >
                                    <option value="all">All Connections</option>
                                    {waterConns.map(w => (
                                        <option key={w} value={w}>{w}</option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
