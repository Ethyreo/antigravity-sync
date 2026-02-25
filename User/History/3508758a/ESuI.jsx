import React, { useMemo } from 'react';
import { buildingData } from '../config/buildingLayout';
import MetricCard from './MetricCard';
import { IndianRupee, Zap, Droplet, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { useFilters } from '../context/FilterContext';

export default function Dashboard() {
    const { filters } = useFilters();
    const currentMonth = "2026-02";

    // Calculate Aggregates based on filters
    const metrics = useMemo(() => {
        let totalRent = 0;
        let totalElec = 0;
        let totalWater = 0;
        let overdueCount = 0;

        // Graph Data
        const floorData = [];

        buildingData.floors.forEach(floor => {
            // Basic Filter skip
            if (filters.floor !== 'all' && filters.floor !== floor.level.toString()) return;

            let floorRent = 0;
            let floorElec = 0;

            floor.units.forEach(unit => {
                if (unit.isPrivate) return;
                if (filters.unit !== 'all' && filters.unit !== unit.id) return;
                if (filters.elec !== 'all' && filters.elec !== unit.elecUnit) return;
                if (filters.water !== 'all' && filters.water !== unit.waterConn) return;

                const records = unit.monthlyRecords?.[currentMonth] || {};

                const rentAmount = parseInt(unit.rent) || 0;
                totalRent += rentAmount;
                floorRent += rentAmount;

                totalElec += records.elecBill || 0;
                floorElec += records.elecBill || 0;
                totalWater += records.waterBill || 0;

                if (records.rentStatus === 'overdue') overdueCount++;
            });

            if (floorRent > 0 || floorElec > 0) {
                floorData.unshift({
                    name: floor.name,
                    rent: floorRent,
                    elec: floorElec
                }); // unshift to order ground -> top
            }
        });

        const runRate = totalRent * 12;

        return { totalRent, totalElec, totalWater, runRate, overdueCount, floorData };
    }, [filters]);

    const formatIN = (num) => new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(num);

    const formatShortIN = (num) => {
        if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
        if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
        return `₹${num}`;
    };

    return (
        <div className="mb-10 space-y-6">
            {/* Top Level Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Monthly Rent"
                    value={formatIN(metrics.totalRent)}
                    icon={IndianRupee}
                    subtext={metrics.overdueCount > 0 ? `${metrics.overdueCount} units overdue` : "All paid up to date"}
                    isAlert={metrics.overdueCount > 0}
                />
                <MetricCard
                    title="Annual Run Rate"
                    value={formatIN(metrics.runRate)}
                    icon={TrendingUp}
                    trend="up"
                    trendValue="+12%"
                    subtext="Based on latest month"
                />
                <MetricCard
                    title="Total Electricity"
                    value={formatIN(metrics.totalElec)}
                    icon={Zap}
                />
                <MetricCard
                    title="Total Water"
                    value={formatIN(metrics.totalWater)}
                    icon={Droplet}
                />
            </div>

            {/* Visual Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Floor breakdown Bar Chart */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-6">Revenue & Energy by Floor</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.floorData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                                <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tickFormatter={formatShortIN} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tickFormatter={formatShortIN} tick={{ fontSize: 10, fill: '#f59e0b' }} />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => formatIN(value)}
                                />
                                <Bar yAxisId="left" dataKey="rent" name="Rent Collection" radius={[4, 4, 0, 0]}>
                                    {metrics.floorData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill="#0f172a" />
                                    ))}
                                </Bar>
                                <Bar yAxisId="right" dataKey="elec" name="Electricity Usage" radius={[4, 4, 0, 0]}>
                                    {metrics.floorData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill="#fcd34d" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Financial Flow Area Chart (Mock Data) */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm text-white">
                    <h3 className="text-sm font-bold text-white tracking-tight mb-6">6-Month Collection Trend</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { month: 'Sep', rec: 180000 }, { month: 'Oct', rec: 195000 }, { month: 'Nov', rec: 200000 },
                                { month: 'Dec', rec: 220000 }, { month: 'Jan', rec: 245000 }, { month: 'Feb', rec: 254000 }
                            ]} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={formatShortIN} tick={{ fontSize: 10, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#10b981' }}
                                    formatter={(value) => formatIN(value)}
                                />
                                <Area type="monotone" dataKey="rec" name="Received" stroke="#10b981" fillOpacity={1} fill="url(#colorRec)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}
