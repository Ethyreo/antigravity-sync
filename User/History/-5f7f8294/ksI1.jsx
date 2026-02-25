import React, { useState } from 'react';
import { buildingData } from '../config/buildingLayout';
import { getCurrentRentAmount } from '../utils/rentUtils';
import { Save, CalendarDays, IndianRupee, Zap, Droplet, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function BulkDataEntry({ triggerUpdate }) {
    // 1. Global Month Picker State
    const [selectedMonth, setSelectedMonth] = useState("2026-02");

    // 2. Local Table State Engine
    // Flatten the building data into a working draft dictionary keyed by Unit ID
    const [draftData, setDraftData] = useState({});

    // Initialize/Reset the draft grid when the month changes
    const loadDraftData = (month) => {
        const initialDraft = {};
        buildingData.floors.forEach(floor => {
            floor.units.forEach(unit => {
                if (unit.isPrivate) return;

                const records = unit.monthlyRecords?.[month] || {};
                const currentRent = getCurrentRentAmount(unit, month);

                initialDraft[unit.id] = {
                    rentStatus: records.rentStatus || 'unknown',
                    rentAmount: currentRent, // Pre-fill with calculated amount
                    elecBill: records.elecBill || 0,
                    waterBill: records.waterBill || 0,
                    garbageBill: records.garbageBill || 0
                };
            });
        });
        setDraftData(initialDraft);
    };

    // Load initial data on mount or month change
    React.useEffect(() => {
        loadDraftData(selectedMonth);
    }, [selectedMonth]);

    // Handle individual cell edits
    const handleCellChange = (unitId, field, value) => {
        setDraftData(prev => ({
            ...prev,
            [unitId]: {
                ...prev[unitId],
                [field]: value
            }
        }));
    };

    // 3. Mass Submit Engine
    const handleMassSave = () => {
        buildingData.floors.forEach(floor => {
            floor.units.forEach(unit => {
                if (unit.isPrivate) return;

                const draft = draftData[unit.id];
                if (!draft) return;

                // Ensure the month object exists
                if (!unit.monthlyRecords) unit.monthlyRecords = {};
                if (!unit.monthlyRecords[selectedMonth]) unit.monthlyRecords[selectedMonth] = {};

                // Mutate the mock config
                unit.monthlyRecords[selectedMonth].rentStatus = draft.rentStatus;
                unit.monthlyRecords[selectedMonth].elecBill = Number(draft.elecBill) || 0;
                unit.monthlyRecords[selectedMonth].waterBill = Number(draft.waterBill) || 0;
                unit.monthlyRecords[selectedMonth].garbageBill = Number(draft.garbageBill) || 0;

                // Note: Rent Amount changes in bulk update only affect the actual current rent history cycle if the user edits it here,
                // but usually, it's just a display field for what is expected. If we wanted bulk rent renegotiation it would be complex 
                // in this simple view, so we treat rent amount tracking here as a visual confirmation of the calculated rent.
            });
        });

        // Trigger global dashboard re-render
        triggerUpdate();
    };

    // Flatten units for generating the view rows
    const allUnits = buildingData.floors.flatMap(f => f.units).filter(u => !u.isPrivate);

    return (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 mt-8 shadow-sm relative overflow-hidden">

            {/* Header section with Month Picker and Save */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Bulk Data Entry</h2>
                    <p className="text-xs text-slate-500 font-medium tracking-wide mt-1">Rapidly update the ledger for the target month</p>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <CalendarDays size={16} className="text-slate-400" />
                        </div>
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl block w-full pl-10 pr-3 py-2.5 outline-none focus:border-slate-800 transition-colors"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleMassSave}
                        className="bg-slate-900 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-md hover:bg-slate-800 transition-colors shrink-0"
                    >
                        <Save size={18} />
                        Save All
                    </motion.button>
                </div>
            </div>

            {/* The Entry Table Grid */}
            <div className="overflow-x-auto pb-4 -mx-6 px-6 sm:mx-0 sm:px-0">
                <div className="min-w-[800px]">

                    {/* Table Header */}
                    <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr] gap-3 mb-3 pb-3 border-b border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Unit</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center flex items-center justify-center gap-1"><IndianRupee size={12} /> Rent</div>
                        <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest text-center flex items-center justify-center gap-1"><Zap size={12} /> Elec</div>
                        <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest text-center flex items-center justify-center gap-1"><Droplet size={12} /> Water</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center flex items-center justify-center gap-1"><Trash2 size={12} /> Trash</div>
                    </div>

                    {/* Table Rows */}
                    <div className="space-y-3">
                        {allUnits.map(unit => {
                            const draft = draftData[unit.id];
                            if (!draft) return null;

                            return (
                                <div key={unit.id} className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr] gap-3 items-center hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-colors">
                                    {/* Unit Name & Info */}
                                    <div className="truncate">
                                        <p className="text-sm font-bold text-slate-900 truncate">{unit.name}</p>
                                        <p className="text-[10px] font-medium text-slate-500 mt-0.5">Unit {unit.id}</p>
                                    </div>

                                    {/* Status Dropdown */}
                                    <div>
                                        <select
                                            value={draft.rentStatus}
                                            onChange={(e) => handleCellChange(unit.id, 'rentStatus', e.target.value)}
                                            className={clsx(
                                                "w-full text-xs font-bold uppercase tracking-wider rounded-lg px-2 py-2 outline-none border appearance-none text-center cursor-pointer",
                                                draft.rentStatus === 'paid' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                    draft.rentStatus === 'overdue' ? "bg-rose-50 text-rose-700 border-rose-200" :
                                                        "bg-amber-50 text-amber-700 border-amber-200"
                                            )}
                                        >
                                            <option value="paid">Paid</option>
                                            <option value="unpaid">Unpaid</option>
                                            <option value="overdue">Overdue</option>
                                        </select>
                                    </div>

                                    {/* Rent Fixed Amount (Read Only visual for collection) */}
                                    <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-center">
                                        <span className="text-sm font-bold text-slate-800">{draft.rentAmount}</span>
                                    </div>

                                    {/* Elec Input */}
                                    <div>
                                        <input
                                            type="number"
                                            value={draft.elecBill}
                                            onChange={(e) => handleCellChange(unit.id, 'elecBill', e.target.value)}
                                            className="w-full bg-white border border-slate-200 focus:border-amber-400 rounded-lg px-3 py-2 text-sm font-bold text-center outline-none transition-colors"
                                        />
                                    </div>

                                    {/* Water Input */}
                                    <div>
                                        <input
                                            type="number"
                                            value={draft.waterBill}
                                            onChange={(e) => handleCellChange(unit.id, 'waterBill', e.target.value)}
                                            className="w-full bg-white border border-slate-200 focus:border-blue-400 rounded-lg px-3 py-2 text-sm font-bold text-center outline-none transition-colors"
                                        />
                                    </div>

                                    {/* Garbage Input */}
                                    <div>
                                        <input
                                            type="number"
                                            value={draft.garbageBill}
                                            onChange={(e) => handleCellChange(unit.id, 'garbageBill', e.target.value)}
                                            className="w-full bg-white border border-slate-200 focus:border-slate-800 rounded-lg px-3 py-2 text-sm font-bold text-center outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

        </div>
    );
}
