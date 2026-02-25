import React, { useState, useMemo } from 'react';
import { buildingData } from '../config/buildingLayout';
import { Search, ArrowLeft, History, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HistoricalTenants({ onBack }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Extract all tenant history from all units into a flat array
    const allTenants = useMemo(() => {
        const tenants = [];
        buildingData.floors.forEach(floor => {
            floor.units.forEach(unit => {
                if (unit.tenantHistory && unit.tenantHistory.length > 0) {
                    unit.tenantHistory.forEach(tenant => {
                        tenants.push({
                            ...tenant,
                            unitId: unit.id,
                            unitName: unit.name,
                            floorLevel: floor.level
                        });
                    });
                }
            });
        });

        // Sort by join date descending (newest first)
        return tenants.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
    }, []);

    // Filter based on search term (Name, Company, or Unit)
    const filteredTenants = useMemo(() => {
        if (!searchTerm) return allTenants;
        const lowerSearch = searchTerm.toLowerCase();

        return allTenants.filter(tenant =>
            tenant.name?.toLowerCase().includes(lowerSearch) ||
            tenant.company?.toLowerCase().includes(lowerSearch) ||
            tenant.unitId?.toLowerCase().includes(lowerSearch) ||
            tenant.unitName?.toLowerCase().includes(lowerSearch)
        );
    }, [searchTerm, allTenants]);

    // Format dates to look nice (e.g. "Jan 2024")
    const formatDate = (dateString) => {
        if (!dateString) return "Current";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    return (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 mt-8 shadow-sm relative overflow-hidden">

            {/* Header section with Search and Return */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">

                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors shrink-0"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            <History size={20} className="text-slate-400" />
                            Tenant Directory
                        </h2>
                        <p className="text-xs text-slate-500 font-medium tracking-wide mt-1">Archived intelligence on unit occupation</p>
                    </div>
                </div>

                <div className="relative w-full sm:w-64">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search Name or Unit..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl block w-full pl-10 pr-3 py-2.5 outline-none focus:border-slate-800 transition-colors"
                    />
                </div>
            </div>

            {/* The Entry Table Grid */}
            <div className="overflow-x-auto pb-4 -mx-6 px-6 sm:mx-0 sm:px-0">
                <div className="min-w-[600px]">

                    {/* Table Header */}
                    <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr] gap-4 mb-3 pb-3 border-b border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-1"><Users size={12} /> Tenant Profile</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unit Location</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Move In Date</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Move Out Date</div>
                    </div>

                    {/* Table Rows */}
                    <div className="space-y-3">
                        {filteredTenants.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 text-sm font-medium">No tenants found matching your search.</div>
                        ) : (
                            filteredTenants.map((tenant, index) => {
                                const isCurrent = tenant.leaveDate === null;

                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        key={`${tenant.unitId}-${index}`}
                                        className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr] gap-4 items-center hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-colors"
                                    >

                                        {/* Name & Company */}
                                        <div className="truncate pl-2">
                                            <p className="text-sm font-bold text-slate-900 truncate">{tenant.name}</p>
                                            {tenant.company && (
                                                <p className="text-[10px] font-medium text-slate-500 mt-0.5 truncate">{tenant.company}</p>
                                            )}
                                        </div>

                                        {/* Location */}
                                        <div className="truncate">
                                            <p className="text-sm font-bold text-slate-700 truncate">{tenant.unitName}</p>
                                            <p className="text-[10px] font-medium text-slate-400 mt-0.5">Unit {tenant.unitId}</p>
                                        </div>

                                        {/* Join Date */}
                                        <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-center">
                                            <span className="text-sm font-bold text-slate-600">{formatDate(tenant.joinDate)}</span>
                                        </div>

                                        {/* Leave Date */}
                                        <div className={`border rounded-lg px-3 py-2 text-center ${isCurrent ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                                            <span className={`text-sm font-bold ${isCurrent ? 'text-emerald-600' : 'text-slate-500'}`}>
                                                {formatDate(tenant.leaveDate)}
                                            </span>
                                        </div>

                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
