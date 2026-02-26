import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, UserMinus, ArrowRightLeft, Calendar, IndianRupee, AlertCircle } from 'lucide-react';
import { buildingData } from '../config/buildingLayout';
import { pushBuildingStateToCloud } from '../utils/cloudSync';
import { getActiveTenant, getTodayDateString, isUnitOccupied } from '../utils/tenantLogic';

export default function TenantManagementModal({ onClose, onUpdate }) {
    // Gather all valid active units
    const allUnits = buildingData.floors.flatMap(f => f.units).filter(u => !u.isPrivate);

    const [selectedUnitId, setSelectedUnitId] = useState('');
    const unit = allUnits.find(u => u.id === selectedUnitId);

    // Core Chronological Evaluation
    const isOccupied = unit ? isUnitOccupied(unit.tenantHistory) : false;
    const currentTenant = unit ? getActiveTenant(unit.tenantHistory) : null;

    // View State (Add, Replace, Evict)
    const [activeTab, setActiveTab] = useState('add');

    // Shared Form State
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [rent, setRent] = useState('');
    const [actionDate, setActionDate] = useState(getTodayDateString());

    // Auto-switch tabs based on occupancy
    useEffect(() => {
        if (unit) {
            if (isOccupied) setActiveTab('replace');
            else setActiveTab('add');

            // Suggest previous rent if vacant
            if (!isOccupied && unit.rentHistory && unit.rentHistory.length > 0) {
                setRent(unit.rentHistory[unit.rentHistory.length - 1].amount);
            }
        }
    }, [selectedUnitId, isOccupied, unit]);

    const handleTransaction = async (e) => {
        e.preventDefault();
        if (!unit) return;

        if (!unit.tenantHistory) unit.tenantHistory = [];
        if (!unit.rentHistory) unit.rentHistory = [];

        const monthString = actionDate.substring(0, 7); // YYYY-MM

        if (activeTab === 'add') {
            // 1. Add new tenant profile
            unit.tenantHistory.push({
                name: name,
                company: contact,
                joinDate: actionDate,
                leaveDate: null // Active indefinitely
            });

            // Start new lease tracking
            unit.rentHistory.push({
                amount: Number(rent),
                startMonth: monthString,
                endMonth: null // Active
            });
        }

        else if (activeTab === 'replace') {
            // Cut off the current tenant exactly on the handover date
            if (currentTenant) currentTenant.leaveDate = actionDate;

            // Tie off old financial records
            if (unit.rentHistory.length > 0) {
                unit.rentHistory[unit.rentHistory.length - 1].endMonth = monthString;
            }

            // Immediately weave in the new tenant on that exact date
            unit.tenantHistory.push({
                name: name,
                company: contact,
                joinDate: actionDate,
                leaveDate: null // Active indefinitely
            });

            // Start new financial record
            unit.rentHistory.push({
                amount: Number(rent),
                startMonth: monthString,
                endMonth: null
            });
        }

        else if (activeTab === 'evict') {
            // Cap off the tenant profile
            if (currentTenant) currentTenant.leaveDate = actionDate;

            // Cap off financial loop
            if (unit.rentHistory.length > 0) {
                unit.rentHistory[unit.rentHistory.length - 1].endMonth = monthString;
            }
        }

        // --- Phase 13: Push Chronological Shift to Cloud ---
        await pushBuildingStateToCloud(monthString);
        onUpdate();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Box */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
            >
                {/* Header */}
                <div className="bg-slate-900 px-6 py-5 flex items-center justify-between">
                    <h2 className="text-white font-bold text-lg tracking-wide flex items-center gap-2">
                        <Calendar size={20} className="text-emerald-400" />
                        Tenant Lifecycle
                    </h2>
                    <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 pb-2 border-b border-slate-100">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Select Target Unit</label>
                    <select
                        value={selectedUnitId}
                        onChange={(e) => setSelectedUnitId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-xl px-4 py-3 outline-none focus:border-slate-400 transition-colors"
                    >
                        <option value="" disabled>-- Choose a Unit --</option>
                        {allUnits.map(u => (
                            <option key={u.id} value={u.id}>{u.name} (Unit {u.id})</option>
                        ))}
                    </select>
                </div>

                {unit && (
                    <div className="bg-slate-50 p-2 mx-4 mt-4 rounded-xl flex gap-1">
                        <button
                            onClick={() => setActiveTab(isOccupied ? 'replace' : 'add')}
                            className={`flex-1 flex flex-col items-center py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'add' || activeTab === 'replace'
                                    ? 'bg-white shadow-sm text-slate-900 border border-slate-200'
                                    : 'text-slate-400 hover:bg-slate-100'
                                }`}
                        >
                            {isOccupied ? <ArrowRightLeft size={16} className="mb-1 text-blue-500" /> : <UserPlus size={16} className="mb-1 text-emerald-500" />}
                            {isOccupied ? 'Replace Tenant' : 'Add New'}
                        </button>

                        <button
                            disabled={!isOccupied}
                            onClick={() => setActiveTab('evict')}
                            className={`flex-1 flex flex-col items-center py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors ${!isOccupied ? 'opacity-30 cursor-not-allowed text-slate-400' : ''} ${activeTab === 'evict'
                                    ? 'bg-white shadow-sm text-rose-600 border border-rose-200'
                                    : 'text-slate-400 hover:bg-slate-100'
                                }`}
                        >
                            <UserMinus size={16} className={`mb-1 ${activeTab === 'evict' ? 'text-rose-500' : ''}`} />
                            Evict / Vacate
                        </button>
                    </div>
                )}


                {unit && (
                    <div className="p-6 pt-4">
                        <form onSubmit={handleTransaction} className="space-y-4">

                            {/* Contextual Banner */}
                            {isOccupied && activeTab === 'replace' && (
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 flex gap-3 text-sm font-medium text-blue-800">
                                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                    <p>The outgoing tenant <strong>{currentTenant.name}</strong> will be cleanly archived exactly on the date you select below.</p>
                                </div>
                            )}

                            {isOccupied && activeTab === 'evict' && (
                                <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 mb-4 flex gap-3 text-sm font-medium text-rose-800">
                                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                    <p>Schedule <strong>{currentTenant.name}</strong> for eviction. They will remain the Active tenant until midnight of the date selected below.</p>
                                </div>
                            )}

                            {(activeTab === 'add' || activeTab === 'replace') && (
                                <>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 pl-1">Incoming Tenant Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g. John Doe"
                                            className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 pl-1">Company / Contact (Optional)</label>
                                        <input
                                            type="text"
                                            value={contact}
                                            onChange={(e) => setContact(e.target.value)}
                                            placeholder="e.g. Acme Corp or Phone Num"
                                            className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 pl-1">Initial Rent Amount ₹</label>
                                        <div className="relative">
                                            <IndianRupee size={14} className="absolute left-3 top-3 text-slate-400" />
                                            <input
                                                type="number"
                                                required
                                                value={rent}
                                                onChange={(e) => setRent(e.target.value)}
                                                placeholder="Amount"
                                                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-400 rounded-xl pl-8 pr-3 py-2.5 text-sm font-bold text-slate-800 outline-none transition-colors"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 pl-1">
                                    {activeTab === 'add' ? 'Move-In Date' : activeTab === 'replace' ? 'Handover Date' : 'Scheduled Eviction Date'}
                                </label>
                                <div className="relative">
                                    <Calendar size={14} className="absolute left-3 top-3 text-slate-400" />
                                    <input
                                        type="date"
                                        required
                                        value={actionDate}
                                        onChange={(e) => setActionDate(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl pl-8 pr-3 py-2.5 text-sm font-bold text-slate-800 outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`w-full text-white font-bold py-3.5 rounded-xl mt-4 flex justify-center items-center gap-2 shadow-md transition-colors ${activeTab === 'evict' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-slate-900 hover:bg-slate-800'
                                    }`}
                            >
                                {activeTab === 'add' ? <><UserPlus size={18} /> Embed New Tenant</> :
                                    activeTab === 'replace' ? <><ArrowRightLeft size={18} /> Process Handover</> :
                                        <><UserMinus size={18} /> Finalize Eviction</>}
                            </button>
                        </form>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
