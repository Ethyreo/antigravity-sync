import React from 'react';
import { useFilters } from '../context/FilterContext';
import { buildingData } from '../config/buildingLayout';
import { Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MultiSelectPopover = ({ label, options = [], selected = [], onChange, isDropOpen, onToggle }) => {
    const toggleOption = (optValue) => {
        const safeSelected = Array.isArray(selected) ? selected : [];
        if (safeSelected.includes(optValue)) {
            onChange(safeSelected.filter(val => val !== optValue));
        } else {
            onChange([...safeSelected, optValue]);
        }
    };

    const safeSelected = Array.isArray(selected) ? selected : [];
    const safeOptions = Array.isArray(options) ? options : [];

    const displayLabel = safeSelected.length === 0
        ? `All ${label}s`
        : safeSelected.length === 1
            ? safeOptions.find(o => o.value === safeSelected[0])?.label || safeSelected[0]
            : `${safeSelected.length} Selected`;

    return (
        <div className="relative flex-1">
            <button
                onClick={onToggle}
                className="flex items-center gap-2 w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-sm text-slate-700 font-medium transition-colors shadow-sm justify-between"
            >
                <div className="flex flex-col items-start gap-1 w-full overflow-hidden">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</span>
                    <span className="truncate w-full text-left leading-none font-bold">{displayLabel}</span>
                </div>
            </button>

            {isDropOpen && (
                <>
                    {/* Invisible Backdrop to catch outside clicks */}
                    <div className="fixed inset-0 z-40" onClick={onToggle}></div>

                    <div className="absolute flex flex-col top-full left-0 mt-2 min-w-[220px] bg-white border border-slate-200 shadow-xl rounded-xl z-50 overflow-hidden py-1">
                        <div className="px-3 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mr-3">{label}s Filter</span>
                            {selected.length > 0 && (
                                <button
                                    onClick={() => onChange([])}
                                    className="text-[10px] font-bold text-blue-600 hover:text-blue-800 shrink-0"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        <div className="max-h-[240px] overflow-y-auto p-2 space-y-1 bg-white">
                            {safeOptions.map(opt => {
                                const isSelected = safeSelected.includes(opt.value);
                                return (
                                    <label key={opt.value} className="flex items-center gap-3 px-2 py-2 hover:bg-slate-50 rounded-lg cursor-pointer group transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleOption(opt.value)}
                                            className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-500 cursor-pointer"
                                        />
                                        <span className={`text-sm ${isSelected ? 'font-bold text-slate-900' : 'font-medium text-slate-600 group-hover:text-slate-900'}`}>
                                            {opt.label}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default function FilterBar() {
    const { filters, updateFilter, resetFilters } = useFilters();
    const [isOpen, setIsOpen] = React.useState(false);
    const [openDropdown, setOpenDropdown] = React.useState(null);

    // Derive unique options
    const allUnits = buildingData.floors.flatMap(f => f.units).filter(u => !u.isPrivate);
    const elecMeters = [...new Set(allUnits.map(u => u.elecUnit))];
    const waterConns = [...new Set(allUnits.map(u => u.waterConn))];

    const hasActiveFilters = Object.values(filters).some(arr => arr && arr.length > 0);

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
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="relative z-30"
                    >
                        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">

                            <MultiSelectPopover
                                label="Floor"
                                options={buildingData.floors.filter(f => f.level < 5).map(f => ({ value: f.level.toString(), label: f.name }))}
                                selected={filters.floor || []}
                                onChange={(val) => updateFilter('floor', val)}
                                isDropOpen={openDropdown === 'floor'}
                                onToggle={() => setOpenDropdown(openDropdown === 'floor' ? null : 'floor')}
                            />

                            <MultiSelectPopover
                                label="Unit"
                                options={allUnits.map(u => ({ value: u.id, label: `${u.name} (${u.id})` }))}
                                selected={filters.unit || []}
                                onChange={(val) => updateFilter('unit', val)}
                                isDropOpen={openDropdown === 'unit'}
                                onToggle={() => setOpenDropdown(openDropdown === 'unit' ? null : 'unit')}
                            />

                            <MultiSelectPopover
                                label="Elec. Meter"
                                options={elecMeters.map(m => ({ value: m, label: m }))}
                                selected={filters.elec || []}
                                onChange={(val) => updateFilter('elec', val)}
                                isDropOpen={openDropdown === 'elec'}
                                onToggle={() => setOpenDropdown(openDropdown === 'elec' ? null : 'elec')}
                            />

                            <MultiSelectPopover
                                label="Water Conn"
                                options={waterConns.map(w => ({ value: w, label: w }))}
                                selected={filters.water || []}
                                onChange={(val) => updateFilter('water', val)}
                                isDropOpen={openDropdown === 'water'}
                                onToggle={() => setOpenDropdown(openDropdown === 'water' ? null : 'water')}
                            />

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
