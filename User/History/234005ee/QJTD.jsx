import React from 'react';
import { motion } from 'framer-motion';
import { X, Phone, IndianRupee, Zap, Droplet, Trash2 } from 'lucide-react';
import clsx from 'clsx';

export default function UnitDetailModal({ unit, onClose }) {
    if (!unit) return null;

    const currentMonth = "2026-02";
    const records = unit.monthlyRecords?.[currentMonth] || {};
    const isOverdue = records.rentStatus === 'overdue';

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null || amount === "N/A") return "N/A";
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            />
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-0 inset-x-0 bg-white rounded-t-[2rem] z-50 p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border-t border-slate-200"
            >
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{unit.name}</h2>
                        <p className="text-slate-500 font-medium tracking-wide mt-1">{unit.type} • Unit {unit.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {unit.isPrivate ? (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                        <p className="text-slate-500 italic">This is a private residence. Management details are hidden.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* 1 & 2: Contact & Status Header */}
                        <div className="flex flex-wrap gap-4 mb-2">
                            <a href={`tel:${unit.contact}`} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide hover:bg-slate-800 transition-colors flex-1 justify-center">
                                <Phone size={16} />
                                {unit.contact}
                            </a>
                            <div className={clsx(
                                "flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest flex-1",
                                isOverdue ? "bg-rose-50 text-rose-600 border border-rose-100" :
                                    records.rentStatus === 'paid' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                            )}>
                                {records.rentStatus || 'Unknown'} status
                            </div>
                        </div>

                        {/* 3: Rent */}
                        <div className="bg-[#F8FAFC] border border-slate-100 p-4 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-700">
                                    <IndianRupee size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Rent</p>
                                    <p className="text-lg font-bold text-slate-900">{formatCurrency(unit.rent)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Utilities Grid */}
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pt-4 pb-1">Utilities ({currentMonth})</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {/* 5 & 6: Electricity */}
                            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                                        <Zap size={18} />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">{unit.elecUnit}</span>
                                </div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Electricity</p>
                                <p className="text-lg font-bold text-slate-900">{formatCurrency(records.elecBill)}</p>
                            </div>

                            {/* 7 & 8: Water */}
                            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                                        <Droplet size={18} />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">{unit.waterConn}</span>
                                </div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Water</p>
                                <p className="text-lg font-bold text-slate-900">{formatCurrency(records.waterBill)}</p>
                            </div>

                            {/* 9: Garbage */}
                            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm col-span-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-50 text-slate-600 rounded-lg border border-slate-100">
                                            <Trash2 size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Garbage Collection</p>
                                            <p className="text-lg font-bold text-slate-900">{formatCurrency(records.garbageBill)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </motion.div>
        </>
    );
}
