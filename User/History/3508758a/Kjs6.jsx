import React, { useMemo } from 'react';
import { buildingData } from '../config/buildingLayout';
import MetricCard from './MetricCard';
import { IndianRupee, Zap, Droplet, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useFilters } from '../context/FilterContext';
import { getCurrentRentAmount } from '../utils/rentUtils';
import { getCurrentBillingMonth } from '../utils/dateUtils';

export default function Dashboard() {
    const { filters } = useFilters();
    // Current System Billing Period
    const currentMonth = getCurrentBillingMonth();

    // Calculate Aggregates based on filters
    const metrics = useMemo(() => {
        let totalRent = 0;
        let totalElec = 0;
        let totalWater = 0;
        let overdueCount = 0;
        let rentCollected = 0;
        let rentDue = 0;

        // Phase 16: Historical Trend Data (Starts Jan 2026)
        const utilityTrendMap = {}; // Key: "YYYY-MM", Value: { elecTotal, waterTotal }

        // Generate baseline months up to current
        const startYear = 2026;
        const startMonth = 1;

        const [currYrStr, currMoStr] = currentMonth.split('-');
        const currentYearNum = parseInt(currYrStr, 10);
        const currentMonthNum = parseInt(currMoStr, 10);

        for (let y = startYear; y <= currentYearNum; y++) {
            const mStart = (y === startYear) ? startMonth : 1;
            const mEnd = (y === currentYearNum) ? currentMonthNum : 12;
            for (let m = mStart; m <= mEnd; m++) {
                const monthStr = `${y}-${String(m).padStart(2, '0')}`;
                utilityTrendMap[monthStr] = { month: monthStr, elecTotal: 0, waterTotal: 0 };
            }
        }

        buildingData.floors.forEach(floor => {
            if (filters.floor !== 'all' && filters.floor !== floor.level.toString()) return;

            floor.units.forEach(unit => {
                if (unit.isPrivate) return;
                if (filters.unit !== 'all' && filters.unit !== unit.id) return;
                if (filters.elec !== 'all' && filters.elec !== unit.elecUnit) return;
                if (filters.water !== 'all' && filters.water !== unit.waterConn) return;

                // Only process current month for KPI tops
                const currentRecords = unit.monthlyRecords?.[currentMonth] || {};
                const rentAmount = getCurrentRentAmount(unit, currentMonth);

                totalRent += rentAmount;

                if (currentRecords.rentStatus === 'paid') {
                    rentCollected += rentAmount;
                } else if (currentRecords.rentStatus === 'unpaid' || currentRecords.rentStatus === 'overdue') {
                    rentDue += rentAmount;
                }

                totalElec += currentRecords.elecBill || 0;
                totalWater += currentRecords.waterBill || 0;
                if (currentRecords.rentStatus === 'overdue') overdueCount++;

                // Process historical records for the graph
                if (unit.monthlyRecords) {
                    Object.entries(unit.monthlyRecords).forEach(([mKey, data]) => {
                        if (utilityTrendMap[mKey]) {
                            utilityTrendMap[mKey].elecTotal += Number(data.elecBill) || 0;
                            utilityTrendMap[mKey].waterTotal += Number(data.waterBill) || 0;
                        }
                    });
                }
            });
        });

        const runRate = totalRent * 12;

        // Convert map to sorted array
        const trendData = Object.values(utilityTrendMap).sort((a, b) => a.month.localeCompare(b.month));

        return { totalRent, totalElec, totalWater, runRate, overdueCount, rentCollected, rentDue, trendData };
    }, [filters, currentMonth]);

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
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard
                    title="Expected Monthly Rent"
                    value={formatIN(metrics.totalRent)}
                    icon={IndianRupee}
                    subtext={metrics.overdueCount > 0 ? `${metrics.overdueCount} units overdue` : "No overdue"}
                    isAlert={metrics.overdueCount > 0}
                />
                <MetricCard
                    title="Rent Collected"
                    value={formatIN(metrics.rentCollected)}
                    icon={IndianRupee}
                    subtext="For this month"
                />
                <MetricCard
                    title="Rent Due"
                    value={formatIN(metrics.rentDue)}
                    icon={IndianRupee}
                    subtext="Unpaid / Overdue"
                    isAlert={metrics.rentDue > 0}
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
            <div className="grid grid-cols-1 gap-6">

                {/* Historical Utility Trend Line Chart */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-6 flex items-center gap-2">
                        <TrendingUp size={16} className="text-blue-500" />
                        Utility Bill Trends (From Jan 2026)
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={metrics.trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#64748b' }}
                                    dy={10}
                                    tickFormatter={(val) => {
                                        const date = new Date(val + '-01');
                                        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                                    }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={formatShortIN}
                                    tick={{ fontSize: 10, fill: '#64748b' }}
                                />
                                <Tooltip
                                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => formatIN(value)}
                                    labelFormatter={(label) => `Billing Month: ${label}`}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />

                                <Line
                                    type="monotone"
                                    dataKey="elecTotal"
                                    name="Electricity Bills"
                                    stroke="#f59e0b"
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2 }}
                                    activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 0 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="waterTotal"
                                    name="Water Bills"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2 }}
                                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}
