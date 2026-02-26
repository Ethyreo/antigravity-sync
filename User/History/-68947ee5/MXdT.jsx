import React, { useState, useMemo } from 'react';
import { Download, FileText, Filter, Search } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { buildingData } from '../config/buildingLayout';

const LedgerTable = ({ ledgerData }) => {
    const [filterMonth, setFilterMonth] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Extract unique months for the dropdown
    const availableMonths = useMemo(() => {
        const months = new Set(ledgerData.map(row => row.BillingMonth));
        return Array.from(months).sort().reverse();
    }, [ledgerData]);

    // Combine Ledger Data with Static Unit Types for filtering
    const enrichedData = useMemo(() => {
        // Build a map of UnitType from buildingData
        const unitTypes = {};
        buildingData.floors.forEach(f => {
            f.units.forEach(u => {
                unitTypes[u.id] = u.type || 'Standard';
            });
        });

        return ledgerData.map(row => ({
            ...row,
            UnitType: unitTypes[row.UnitID] || 'Unknown'
        }));
    }, [ledgerData]);

    // Apply active filters
    const filteredData = useMemo(() => {
        return enrichedData.filter(row => {
            const matchMonth = filterMonth === 'All' || row.BillingMonth === filterMonth;
            const matchStatus = filterStatus === 'All' || row.RentStatus === filterStatus;
            const matchType = filterType === 'All' || row.UnitType.toLowerCase() === filterType.toLowerCase();

            const searchStr = `${row.UnitName} ${row.UnitID} ${row.TenantName}`.toLowerCase();
            const matchSearch = searchQuery === '' || searchStr.includes(searchQuery.toLowerCase());

            return matchMonth && matchStatus && matchType && matchSearch;
        }).sort((a, b) => {
            // Sort by Month descending, then UnitID
            if (a.BillingMonth !== b.BillingMonth) return b.BillingMonth.localeCompare(a.BillingMonth);
            return a.UnitID.localeCompare(b.UnitID);
        });
    }, [enrichedData, filterMonth, filterStatus, filterType, searchQuery]);

    // Calculate Totals for the footer
    const totals = useMemo(() => {
        return filteredData.reduce((acc, row) => ({
            rent: acc.rent + (row.RentStatus === 'paid' ? (Number(row.RentAmount) || 0) : 0),
            elec: acc.elec + (Number(row.Electricity) || 0),
            water: acc.water + (Number(row.Water) || 0),
            garbage: acc.garbage + (Number(row.Garbage) || 0)
        }), { rent: 0, elec: 0, water: 0, garbage: 0 });
    }, [filteredData]);

    const handleExportCSV = () => {
        if (filteredData.length === 0) return;

        const headers = ['Billing Month', 'Unit ID', 'Unit Name', 'Tenant', 'Type', 'Rent Status', 'Rent Amount', 'Electricity', 'Water', 'Garbage'];
        const rows = filteredData.map(r => [
            r.BillingMonth, r.UnitID, r.UnitName, r.TenantName, r.UnitType,
            r.RentStatus, r.RentAmount, r.Electricity, r.Water, r.Garbage
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(e => e.map(item => `"${item || ''}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `oak_lodge_ledger_${filterMonth === 'All' ? 'all' : filterMonth}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => {
        if (filteredData.length === 0) return;

        const doc = new jsPDF('landscape');

        // Title
        doc.setFontSize(18);
        doc.text('Oak Lodge Monthly Ledger', 14, 22);

        // Subtitle / Filters
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated: ${new Date().toLocaleDateString()} | Month: ${filterMonth} | Status: ${filterStatus} | Type: ${filterType}`, 14, 30);

        const tableColumns = ['Month', 'Unit', 'Name', 'Tenant', 'Status', 'Rent', 'Elec', 'Water', 'Garbage'];
        const tableRows = filteredData.map(r => [
            r.BillingMonth,
            r.UnitID,
            r.UnitName,
            r.TenantName,
            r.RentStatus.toUpperCase(),
            `Rs ${r.RentAmount.toLocaleString()}`,
            `Rs ${r.Electricity.toLocaleString()}`,
            `Rs ${r.Water.toLocaleString()}`,
            `Rs ${r.Garbage.toLocaleString()}`
        ]);

        // Add Totals Row at the bottom
        tableRows.push([
            'TOTALS', '', '', '', '',
            `Rs ${totals.rent.toLocaleString()}`,
            `Rs ${totals.elec.toLocaleString()}`,
            `Rs ${totals.water.toLocaleString()}`,
            `Rs ${totals.garbage.toLocaleString()}`
        ]);

        doc.autoTable({
            head: [tableColumns],
            body: tableRows,
            startY: 35,
            theme: 'grid',
            styles: { fontSize: 9, cellPadding: 3 },
            headStyles: { fillColor: [15, 23, 42] }, // Slate 900
            alternateRowStyles: { fillColor: [248, 250, 252] }, // Slate 50
            columnStyles: {
                4: { fontStyle: 'bold' }, // Status
                5: { halign: 'right' }, // Rent
                6: { halign: 'right' }, // Elec
                7: { halign: 'right' }, // Water
                8: { halign: 'right' }  // Garbage
            },
            didParseCell: function (data) {
                // Highlight Paid vs Unpaid strictly in the Status column
                if (data.section === 'body' && data.column.index === 4) {
                    if (data.cell.raw === 'PAID') {
                        data.cell.styles.textColor = [22, 163, 74]; // Green 600
                    } else if (data.cell.raw === 'UNPAID') {
                        data.cell.styles.textColor = [220, 38, 38]; // Red 600
                    } else if (data.cell.raw === 'OVERDUE') {
                        data.cell.styles.textColor = [234, 88, 12]; // Orange 600
                    }
                }
                // Bold the Totals row
                if (data.row.index === tableRows.length - 1) {
                    data.cell.styles.fontStyle = 'bold';
                    data.cell.styles.fillColor = [241, 245, 249]; // Slate 100
                }
            }
        });

        doc.save(`oak_lodge_ledger_${filterMonth === 'All' ? 'all' : filterMonth}.pdf`);
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Header & Controls */}
                <div className="p-6 border-b border-slate-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-slate-900">Financial Ledger</h2>
                            <p className="text-sm text-slate-500 mt-1">Exportable tabular view of the active master database.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleExportCSV}
                                disabled={filteredData.length === 0}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
                            >
                                <FileText className="w-4 h-4" />
                                Excel / CSV
                            </button>
                            <button
                                onClick={handleExportPDF}
                                disabled={filteredData.length === 0}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors shadow-sm text-sm disabled:opacity-50"
                            >
                                <Download className="w-4 h-4" />
                                Export PDF
                            </button>
                        </div>
                    </div>

                    {/* Filters Bar */}
                    <div className="mt-6 flex flex-wrap items-center gap-4">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search unit, unit id, or tenant..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all font-medium"
                            />
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                            <select
                                value={filterMonth}
                                onChange={e => setFilterMonth(e.target.value)}
                                className="pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all font-medium appearance-none min-w-[140px]"
                            >
                                <option value="All">All Months</option>
                                {availableMonths.map(m => (
                                    <option key={m} value={m}>{window.formatMonthYear ? window.formatMonthYear(m) : m}</option>
                                ))}
                            </select>
                        </div>

                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all font-medium min-w-[140px]"
                        >
                            <option value="All">All Statuses</option>
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="overdue">Overdue</option>
                        </select>

                        <select
                            value={filterType}
                            onChange={e => setFilterType(e.target.value)}
                            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all font-medium min-w-[140px]"
                        >
                            <option value="All">All Types</option>
                            <option value="commercial">Commercial</option>
                            <option value="residential">Residential</option>
                        </select>
                    </div>
                </div>

                {/* Table View */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left align-middle border-collapse">
                        <thead className="text-xs text-slate-500 bg-slate-50/80 border-b border-slate-200 sticky top-0 uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="px-6 py-4 whitespace-nowrap">Month</th>
                                <th className="px-6 py-4 whitespace-nowrap">Unit</th>
                                <th className="px-6 py-4">Tenant</th>
                                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 text-right whitespace-nowrap">Rent</th>
                                <th className="px-6 py-4 text-right whitespace-nowrap">Electric</th>
                                <th className="px-6 py-4 text-right whitespace-nowrap">Water</th>
                                <th className="px-6 py-4 text-right whitespace-nowrap">Garbage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-slate-500">
                                        No ledger records match the current filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((row, idx) => (
                                    <tr key={`${row.BillingMonth}_${row.UnitID}_${idx}`} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-medium">
                                            {window.formatMonthYear ? window.formatMonthYear(row.BillingMonth) : row.BillingMonth}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-semibold text-slate-900">{row.UnitID}</div>
                                            <div className="text-xs text-slate-500 mt-0.5 max-w-[120px] truncate">{row.UnitName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900 max-w-[160px] truncate">{row.TenantName}</div>
                                            <div className="text-xs text-slate-500 mt-0.5 capitalize">{row.UnitType}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${row.RentStatus === 'paid' ? 'bg-green-50 text-green-700 border border-green-200/50' :
                                                    row.RentStatus === 'overdue' ? 'bg-orange-50 text-orange-700 border border-orange-200/50' :
                                                        'bg-red-50 text-red-700 border border-red-200/50'
                                                }`}>
                                                {row.RentStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-slate-900 whitespace-nowrap">
                                            ₹{Number(row.RentAmount).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-600 whitespace-nowrap">
                                            ₹{Number(row.Electricity).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-600 whitespace-nowrap">
                                            ₹{Number(row.Water).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-600 whitespace-nowrap">
                                            ₹{Number(row.Garbage).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {/* Table Footer - Totals Sticky */}
                        {filteredData.length > 0 && (
                            <tfoot className="bg-slate-50 font-bold text-slate-900 border-t-2 border-slate-200">
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-right uppercase tracking-wider text-xs text-slate-500">
                                        Filtered Totals
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap text-emerald-600">
                                        ₹{totals.rent.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        ₹{totals.elec.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        ₹{totals.water.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        ₹{totals.garbage.toLocaleString()}
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>

        </div>
    );
};

export default LedgerTable;
