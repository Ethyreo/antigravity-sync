import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, UserPlus, UserMinus, Building, Calendar, IndianRupee } from 'lucide-react';
import { buildingData } from '../config/buildingLayout';
import { pushBuildingStateToCloud } from '../utils/cloudSync';

export default function TenantManagementModal({ onClose, onUpdate }) {
    // Gather all valid active units
    const allUnits = buildingData.floors.flatMap(f => f.units).filter(u => !u.isPrivate);

    const [selectedUnitId, setSelectedUnitId] = useState('');

    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [rent, setRent] = useState('');
    const [joinDate, setJoinDate] = useState(new Date().toISOString().split('T')[0]);

    const unit = allUnits.find(u => u.id === selectedUnitId);

    const isOccupied = unit && unit.tenantHistory && unit.tenantHistory.length > 0 && unit.tenantHistory[unit.tenantHistory.length - 1].leaveDate === null;
    const currentTenant = isOccupied ? unit.tenantHistory[unit.tenantHistory.length - 1] : null;

    // Prefill form if replacing a tenant
    useEffect(() => {
        if (!isOccupied && unit) {
            // Suggest the previous rent amount if available
            if (unit.rentHistory && unit.rentHistory.length > 0) {
                setRent(unit.rentHistory[unit.rentHistory.length - 1].amount);
            }
        }
    }, [selectedUnitId, isOccupied, unit]);

    const handleAddTenant = (e) => {
        e.preventDefault();
        if (!unit || !name || !rent || !joinDate) return;

        if (!unit.tenantHistory) unit.tenantHistory = [];
        if (!unit.rentHistory) unit.rentHistory = [];

        // If someone is actively living there, this action intrinsically kicks them out today
        if (isOccupied) {
            unit.tenantHistory[unit.tenantHistory.length - 1].leaveDate = joinDate;
        }

        // 1. Add new tenant profile
        unit.tenantHistory.push({
            name: name,
            company: contact,
            joinDate: joinDate,
            leaveDate: null // Active
        });

        // 2. Adjust financial rent history block
        const startMonth = joinDate.substring(0, 7); // YYYY-MM

        // Terminate old lease
        if (unit.rentHistory.length > 0) {
            unit.rentHistory[unit.rentHistory.length - 1].endMonth = startMonth;
        }

        // Start new lease tracking
        unit.rentHistory.push({
            amount: Number(rent),
            startMonth: startMonth,
            endMonth: null // Active
        });

        // --- Phase 8: Dynamic Cloud Sync Hook ---
        // Push the entire updated physical map to the cloud
        pushBuildingStateToCloud(startMonth).then(() => {
            onUpdate();
            onClose();
        });
    };

    const handleRemoveTenant = () => {
        if (!unit || !isOccupied) return;

        const leaveDate = new Date().toISOString().split('T')[0];
        const leaveMonth = leaveDate.substring(0, 7);

        // Terminate tenant residency
        unit.tenantHistory[unit.tenantHistory.length - 1].leaveDate = leaveDate;

        // Terminate rent collection cycle but leave amount for "potential calculations"
        if (unit.rentHistory && unit.rentHistory.length > 0) {
            unit.rentHistory[unit.rentHistory.length - 1].endMonth = leaveMonth;
        }

        // --- Phase 8: Dynamic Cloud Sync Hook ---
        pushBuildingStateToCloud(leaveMonth).then(() => {
            onUpdate();
            onClose();
        });
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
                        <UserPlus size={20} className="text-emerald-400" />
                        Manage Tenant
                    </h2>
                    <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6">
                    {/* 1. Unit Selection Engine */}
                    <div className="mb-6">
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
                        <div className="space-y-6">

                            {/* Overwrite / Remove Block */}
                            {isOccupied && (
                                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Currently Occupied By</p>
                                            <p className="text-base font-bold text-slate-900">{currentTenant.name}</p>
                                            {currentTenant.company && <p className="text-xs font-medium text-slate-500">{currentTenant.company}</p>}
                                        </div>
                                        <button
                                            onClick={handleRemoveTenant}
                                            className="bg-rose-100 text-rose-700 hover:bg-rose-200 text-xs font-bold px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            <UserMinus size={14} /> Remove
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-amber-700 font-medium">Adding a new tenant below will instantly archive this active tenant.</p>
                                </div>
                            )}

                            {/* New Tenant Form */}
                            <form onSubmit={handleAddTenant} className="space-y-4 pt-2 border-t border-slate-100">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 pl-1">Tenant Full Name</label>
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
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 pl-1">Company / Contact Info (Optional)</label>
                                    <input
                                        type="text"
                                        value={contact}
                                        onChange={(e) => setContact(e.target.value)}
                                        placeholder="e.g. Acme Corp or Phone Num"
                                        className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none transition-colors"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 pl-1">Joined Date</label>
                                        <div className="relative">
                                            <Calendar size={14} className="absolute left-3 top-3 text-slate-400" />
                                            <input
                                                type="date"
                                                required
                                                value={joinDate}
                                                onChange={(e) => setJoinDate(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl pl-8 pr-3 py-2.5 text-sm font-bold text-slate-800 outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 pl-1">Rent Amount ₹</label>
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
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl mt-4 flex justify-center items-center gap-2 shadow-md hover:bg-slate-800 transition-colors"
                                >
                                    <UserPlus size={18} /> Embed New Tenant
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
