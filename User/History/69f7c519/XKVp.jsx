import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, ChevronRight } from 'lucide-react';
import { getExpiringRentCycles } from '../utils/rentUtils';
import { buildingData } from '../config/buildingLayout';

export default function RentAlert({ onSelectUnit, updateTrigger }) {
    const [expiringUnits, setExpiringUnits] = useState([]);
    const [isVisible, setIsVisible] = useState(true);

    const currentMonth = "2026-02"; // Mock system time

    useEffect(() => {
        // Find units whose rent cycle ends within 1 month
        const expiring = getExpiringRentCycles(buildingData, currentMonth, 1);
        setExpiringUnits(expiring);
        if (expiring.length > 0) setIsVisible(true);
    }, [updateTrigger]); // Re-run whenever data updates

    if (expiringUnits.length === 0) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 shadow-sm relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400"></div>

                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-amber-100/50 text-amber-600 rounded-xl shrink-0 mt-0.5">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-amber-900 tracking-tight">Rent Cycle Expiring</h3>
                                <p className="text-xs text-amber-700 font-medium mt-1 mb-3">
                                    {expiringUnits.length} unit{expiringUnits.length > 1 ? 's have' : ' has a'} rent cycle ending within 1 month. Please update the agreements.
                                </p>

                                <div className="flex flex-col gap-2">
                                    {expiringUnits.map(({ unit, record }, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => onSelectUnit(unit)}
                                            className="flex items-center justify-between bg-white/60 hover:bg-white inset-0 px-3 py-2 rounded-lg border border-amber-200/50 transition-colors text-left"
                                        >
                                            <div>
                                                <span className="text-xs font-bold text-slate-800">{unit.name}</span>
                                                <span className="text-[10px] text-slate-500 font-medium ml-2">Ends {record.endMonth}</span>
                                            </div>
                                            <ChevronRight size={14} className="text-amber-500" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-1.5 text-amber-500 hover:bg-amber-100 rounded-full transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
