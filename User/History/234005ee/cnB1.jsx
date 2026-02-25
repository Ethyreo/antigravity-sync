import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Phone, IndianRupee, Zap, Droplet, Trash2, Edit2, Save } from 'lucide-react';
import clsx from 'clsx';
import { getCurrentRentRecord, getCurrentRentAmount } from '../utils/rentUtils';

export default function UnitDetailModal({ unit, onClose, onUpdate }) {
    if (!unit) return null;

    const currentMonth = "2026-02";
    const records = unit.monthlyRecords?.[currentMonth] || {};

    // Get the active rent cycle explicitly
    const activeRentCycle = getCurrentRentRecord(unit, currentMonth) || {};
    const displayRent = getCurrentRentAmount(unit, currentMonth);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: unit.name || '',
        type: unit.type || '',
        contact: unit.contact || '',
        rentAmount: activeRentCycle.amount || '',
        rentStart: activeRentCycle.startMonth || currentMonth,
        rentEnd: activeRentCycle.endMonth || currentMonth,
        rentStatus: records.rentStatus || 'unknown',
        elecUnit: unit.elecUnit || '',
        elecBill: records.elecBill || 0,
        waterConn: unit.waterConn || '',
        waterBill: records.waterBill || 0,
        garbageBill: records.garbageBill || 0
    });

    const isOverdue = records.rentStatus === 'overdue';

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null || amount === "N/A" || amount === "") return "N/A";
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        unit.name = formData.name;
        unit.type = formData.type;
        unit.contact = formData.contact;
        unit.elecUnit = formData.elecUnit;
        unit.waterConn = formData.waterConn;

        // Mutate rent history
        if (!unit.rentHistory) unit.rentHistory = [];

        // Try to update current cycle, or push a new one if it didn't exist
        const cycleIndex = unit.rentHistory.findIndex(r => r === activeRentCycle);
        if (cycleIndex !== -1) {
            unit.rentHistory[cycleIndex].amount = Number(formData.rentAmount) || 0;
            unit.rentHistory[cycleIndex].startMonth = formData.rentStart;
            unit.rentHistory[cycleIndex].endMonth = formData.rentEnd;
        } else {
            unit.rentHistory.push({
                amount: Number(formData.rentAmount) || 0,
                startMonth: formData.rentStart,
                endMonth: formData.rentEnd
            });
        }

        if (!unit.monthlyRecords) unit.monthlyRecords = {};
        if (!unit.monthlyRecords[currentMonth]) unit.monthlyRecords[currentMonth] = {};

        unit.monthlyRecords[currentMonth].rentStatus = formData.rentStatus;
        unit.monthlyRecords[currentMonth].elecBill = Number(formData.elecBill) || 0;
        unit.monthlyRecords[currentMonth].waterBill = Number(formData.waterBill) || 0;
        unit.monthlyRecords[currentMonth].garbageBill = Number(formData.garbageBill) || 0;

        setIsEditing(false);
        if (onUpdate) onUpdate(); // Trigger parent re-render
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
                    <div className="flex-1 mr-4">
                        {isEditing ? (
                            <div className="space-y-2">
                                <input name="name" value={formData.name} onChange={handleChange} className="w-full text-2xl font-bold text-slate-900 tracking-tight border-b-2 border-slate-300 focus:border-slate-800 outline-none bg-transparent pb-1" placeholder="Unit Name" />
                                <div className="flex gap-2">
                                    <input name="type" value={formData.type} onChange={handleChange} className="flex-1 text-slate-500 font-medium tracking-wide border-b border-slate-200 focus:border-slate-500 outline-none bg-transparent pb-1" placeholder="Unit Type" />
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{unit.name}</h2>
                                <p className="text-slate-500 font-medium tracking-wide mt-1">{unit.type} • Unit {unit.id}</p>
                            </>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {!unit.isPrivate && (
                            <button
                                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                                className={clsx("p-2 rounded-full transition-colors", isEditing ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200" : "bg-blue-50 text-blue-600 hover:bg-blue-100")}
                            >
                                {isEditing ? <Save size={20} /> : <Edit2 size={20} />}
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {unit.isPrivate ? (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                        <p className="text-slate-500 italic">This is a private residence. Management details are hidden.</p>
                    </div>
                ) : (
                    <div className="space-y-4 pb-4">
                        {/* 1 & 2: Contact & Status Header */}
                        {isEditing ? (
                            <div className="flex flex-col gap-3 mb-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Contact Details</label>
                                    <input name="contact" value={formData.contact} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400" placeholder="+91 XXXX XXXX" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Rent Status</label>
                                    <select name="rentStatus" value={formData.rentStatus} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400">
                                        <option value="paid">Paid</option>
                                        <option value="unpaid">Unpaid</option>
                                        <option value="overdue">Overdue</option>
                                    </select>
                                </div>
                            </div>
                        ) : (
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
                        )}

                        {/* 3: Rent */}
                        <div className="bg-[#F8FAFC] border border-slate-100 p-4 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3 w-full">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-700 shrink-0">
                                    <IndianRupee size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-end mb-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rent Cycle</p>
                                        {!isEditing && activeRentCycle.startMonth && (
                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                                {activeRentCycle.startMonth} to {activeRentCycle.endMonth}
                                            </span>
                                        )}
                                    </div>

                                    {isEditing ? (
                                        <div className="flex flex-col gap-2 mt-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-slate-400 w-12">Amt:</span>
                                                <input type="number" name="rentAmount" value={formData.rentAmount} onChange={handleChange} className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold outline-none focus:border-slate-400" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-slate-400 w-12">Start:</span>
                                                <input type="month" name="rentStart" value={formData.rentStart} onChange={handleChange} className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1 text-xs font-bold outline-none text-slate-600" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-slate-400 w-12">End:</span>
                                                <input type="month" name="rentEnd" value={formData.rentEnd} onChange={handleChange} className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1 text-xs font-bold outline-none text-slate-600" />
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-lg font-bold text-slate-900">{formatCurrency(displayRent)}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Utilities Grid */}
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pt-4 pb-1">Utilities ({currentMonth})</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Electricity */}
                            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg shrink-0">
                                        <Zap size={18} />
                                    </div>
                                    {isEditing ? (
                                        <input name="elecUnit" value={formData.elecUnit} onChange={handleChange} className="w-full text-right bg-slate-50 border border-slate-200 rounded-md px-2 py-1 ml-2 text-[10px] font-bold uppercase outline-none" placeholder="Meter Name" />
                                    ) : (
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md text-right truncate max-w-[100px]">{unit.elecUnit}</span>
                                    )}
                                </div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 mt-auto">Electricity</p>
                                {isEditing ? (
                                    <input type="number" name="elecBill" value={formData.elecBill} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold outline-none" />
                                ) : (
                                    <p className="text-lg font-bold text-slate-900">{formatCurrency(records.elecBill)}</p>
                                )}
                            </div>

                            {/* Water */}
                            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-2 bg-blue-50 text-blue-500 rounded-lg shrink-0">
                                        <Droplet size={18} />
                                    </div>
                                    {isEditing ? (
                                        <input name="waterConn" value={formData.waterConn} onChange={handleChange} className="w-full text-right bg-slate-50 border border-slate-200 rounded-md px-2 py-1 ml-2 text-[10px] font-bold uppercase outline-none" placeholder="Conn. Name" />
                                    ) : (
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md text-right truncate max-w-[100px]">{unit.waterConn}</span>
                                    )}
                                </div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 mt-auto">Water</p>
                                {isEditing ? (
                                    <input type="number" name="waterBill" value={formData.waterBill} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold outline-none" />
                                ) : (
                                    <p className="text-lg font-bold text-slate-900">{formatCurrency(records.waterBill)}</p>
                                )}
                            </div>

                            {/* Garbage */}
                            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm col-span-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="p-2 bg-slate-50 text-slate-600 rounded-lg border border-slate-100 shrink-0">
                                            <Trash2 size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Garbage Collection</p>
                                            {isEditing ? (
                                                <input type="number" name="garbageBill" value={formData.garbageBill} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold outline-none" />
                                            ) : (
                                                <p className="text-lg font-bold text-slate-900">{formatCurrency(records.garbageBill)}</p>
                                            )}
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
