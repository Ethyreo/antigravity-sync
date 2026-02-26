import React, { useState, useMemo } from 'react';
import { buildingData } from '../config/buildingLayout';
import { getCurrentRentAmount } from '../utils/rentUtils';
import { getCurrentBillingMonth } from '../utils/dateUtils';
import { getActiveTenant } from '../utils/tenantLogic';
import { FileText, ArrowLeft, Download, AlertCircle, CheckCircle2, IndianRupee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';

// ─── Constants ──────────────────────────────────────────────────
const PROPERTY = {
    name: 'Oak Lodge',
    address: 'Lower Bharari Road, Near Hotel Radisson, Shimla – 171001',
    owner: 'Avinder Pal Singh',
    ownerPhone: '9418022567',
};

// ─── Utility: number → words ────────────────────────────────────
const numberToWords = (num) => {
    if (num === 0) return 'Zero';
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const convert = (n) => {
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
        if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convert(n % 100) : '');
        if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
        if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
        return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
    };
    return convert(Math.round(num)) + ' Rupees Only';
};

// ─── PDF Generation ─────────────────────────────────────────────
const generateReceiptPDF = (unit, tenant, month, records, rentAmount) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const marginL = 20;
    const marginR = pageW - 20;
    const contentW = marginR - marginL;
    let y = 20;

    // ─── Decorative top bar ─────
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageW, 8, 'F');

    // ─── Header ─────
    y = 22;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text('RENT RECEIPT', pageW / 2, y, { align: 'center' });

    y += 10;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text('Original Copy', pageW / 2, y, { align: 'center' });

    // ─── Horizontal rule ─────
    y += 6;
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.5);
    doc.line(marginL, y, marginR, y);

    // ─── Property Info ─────
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(PROPERTY.name, marginL, y);

    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(PROPERTY.address, marginL, y);

    // ─── Receipt Meta (right side) ─────
    const monthDate = new Date(month + '-01');
    const monthLabel = monthDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    const receiptNo = `OL-${unit.id}-${month.replace('-', '')}`;
    const issueDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`Receipt No: ${receiptNo}`, marginR, y - 6, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Date: ${issueDate}`, marginR, y, { align: 'right' });

    // ─── Section: Billing Period ─────
    y += 12;
    doc.setFillColor(248, 250, 252); // slate-50
    doc.roundedRect(marginL, y, contentW, 22, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('BILLING PERIOD', marginL + 6, y + 8);
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(monthLabel, marginL + 6, y + 17);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('UNIT', marginR - 60, y + 8);
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(`${unit.name} (${unit.id})`, marginR - 60, y + 17);

    // ─── Section: Paid By / Paid To ─────
    y += 32;
    const colW = contentW / 2 - 3;

    // Paid By
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(marginL, y, colW, 30, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('RENT PAID BY (TENANT)', marginL + 6, y + 8);
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(tenant.name, marginL + 6, y + 17);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Contact: ${tenant.company || unit.contact || 'N/A'}`, marginL + 6, y + 24);

    // Paid To
    const col2X = marginL + colW + 6;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(col2X, y, colW, 30, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('RENT PAID TO (OWNER)', col2X + 6, y + 8);
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(PROPERTY.owner, col2X + 6, y + 17);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Contact: ${PROPERTY.ownerPhone}`, col2X + 6, y + 24);

    // ─── Section: Amount Breakup ─────
    y += 40;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('PAYMENT BREAKUP', marginL, y);
    y += 6;

    // Table header
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(marginL, y, contentW, 10, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('DESCRIPTION', marginL + 6, y + 7);
    doc.text('AMOUNT (₹)', marginR - 6, y + 7, { align: 'right' });
    y += 10;

    // Rows
    const elec = Number(records.elecBill) || 0;
    const water = Number(records.waterBill) || 0;
    const garbage = Number(records.garbageBill) || 0;
    const total = rentAmount + elec + water + garbage;

    const rows = [
        { label: 'Monthly Rent', amount: rentAmount },
        { label: 'Electricity Charges', amount: elec },
        { label: 'Water Charges', amount: water },
        { label: 'Garbage / Sanitation', amount: garbage },
    ];

    rows.forEach((row, i) => {
        const bgColor = i % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
        doc.setFillColor(...bgColor);
        doc.rect(marginL, y, contentW, 10, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85); // slate-700
        doc.text(row.label, marginL + 6, y + 7);
        doc.setFont('helvetica', 'bold');
        doc.text(`₹ ${row.amount.toLocaleString('en-IN')}`, marginR - 6, y + 7, { align: 'right' });
        y += 10;
    });

    // Total row
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(marginL, y, contentW, 12, 0, 0, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('TOTAL PAYABLE', marginL + 6, y + 8);
    doc.text(`₹ ${total.toLocaleString('en-IN')}`, marginR - 6, y + 8, { align: 'right' });
    y += 12;

    // ─── Amount in words ─────
    y += 6;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Amount in Words: ${numberToWords(total)}`, marginL, y);

    // ─── Payment Status ─────
    y += 14;
    doc.setFillColor(236, 253, 245); // emerald-50
    doc.roundedRect(marginL, y, contentW, 14, 3, 3, 'F');
    doc.setDrawColor(16, 185, 129); // emerald-500
    doc.setLineWidth(0.3);
    doc.roundedRect(marginL, y, contentW, 14, 3, 3, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(6, 95, 70); // emerald-800
    doc.text('✓  PAYMENT STATUS: PAID', pageW / 2, y + 9, { align: 'center' });

    // ─── Signature Section ─────
    y += 28;
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(0.3);

    // Tenant signature
    doc.line(marginL, y + 15, marginL + 65, y + 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Tenant's Signature", marginL, y + 21);

    // Owner signature
    doc.line(marginR - 65, y + 15, marginR, y + 15);
    doc.text("Property Owner's Signature", marginR - 65, y + 21);

    // ─── Footer ─────
    const footerY = doc.internal.pageSize.getHeight() - 18;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(marginL, footerY, marginR, footerY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text('This is a computer-generated receipt issued by the Oak Lodge Property Management System.', pageW / 2, footerY + 5, { align: 'center' });
    doc.text(`Generated on ${new Date().toLocaleString('en-IN')}`, pageW / 2, footerY + 10, { align: 'center' });

    // ─── Bottom decorative bar ─────
    doc.setFillColor(15, 23, 42);
    doc.rect(0, doc.internal.pageSize.getHeight() - 4, pageW, 4, 'F');

    // ─── Download ─────
    doc.save(`Rent_Receipt_${unit.name}_${month}.pdf`);
};

// ─── Main Component ─────────────────────────────────────────────
export default function RentReceiptGenerator({ onBack }) {
    const [selectedUnitId, setSelectedUnitId] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(getCurrentBillingMonth());

    const allUnits = useMemo(() =>
        buildingData.floors.flatMap(f => f.units).filter(u => !u.isPrivate),
        []
    );

    const selectedUnit = allUnits.find(u => u.id === selectedUnitId);

    // Derive tenant + payment info for the selected unit/month
    const receiptInfo = useMemo(() => {
        if (!selectedUnit) return null;

        const tenant = getActiveTenant(selectedUnit.tenantHistory);
        const records = selectedUnit.monthlyRecords?.[selectedMonth] || {};
        const rentAmount = getCurrentRentAmount(selectedUnit, selectedMonth);
        const isPaid = records.rentStatus === 'paid';

        return { tenant, records, rentAmount, isPaid };
    }, [selectedUnit, selectedMonth]);

    const canGenerate = receiptInfo?.isPaid && receiptInfo?.tenant;

    return (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 mt-8 shadow-sm relative overflow-hidden">

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors shrink-0"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Rent Receipt Generator</h2>
                        <p className="text-xs text-slate-500 font-medium tracking-wide mt-1">Download official rent receipts for paid months</p>
                    </div>
                </div>
            </div>

            {/* Selection Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

                {/* Unit Selector */}
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Select Tenant / Unit</label>
                    <select
                        value={selectedUnitId}
                        onChange={(e) => setSelectedUnitId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl px-4 py-3 outline-none focus:border-slate-800 transition-colors appearance-none cursor-pointer"
                    >
                        <option value="">— Choose a Unit —</option>
                        {allUnits.map(unit => {
                            const tenant = getActiveTenant(unit.tenantHistory);
                            return (
                                <option key={unit.id} value={unit.id}>
                                    {unit.name} ({unit.id}) — {tenant ? tenant.name : 'Vacant'}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* Month Selector */}
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Billing Month</label>
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl px-4 py-3 outline-none focus:border-slate-800 transition-colors"
                    />
                </div>
            </div>

            {/* Preview Card */}
            <AnimatePresence mode="wait">
                {selectedUnit && receiptInfo && (
                    <motion.div
                        key={`${selectedUnitId}-${selectedMonth}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6"
                    >
                        <div className={`border rounded-2xl p-6 transition-colors ${canGenerate ? 'bg-emerald-50/50 border-emerald-200' : 'bg-amber-50/50 border-amber-200'}`}>

                            {/* Status Badge */}
                            <div className="flex items-center gap-2 mb-4">
                                {canGenerate ? (
                                    <>
                                        <CheckCircle2 size={18} className="text-emerald-600" />
                                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Ready to Generate</span>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle size={18} className="text-amber-600" />
                                        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                                            {!receiptInfo.tenant ? 'No Active Tenant' : 'Rent Not Marked as Paid'}
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Preview Details */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tenant</p>
                                    <p className="text-sm font-bold text-slate-900 mt-1">{receiptInfo.tenant?.name || 'Vacant'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rent</p>
                                    <p className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1"><IndianRupee size={12} />{receiptInfo.rentAmount?.toLocaleString('en-IN')}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Electricity</p>
                                    <p className="text-sm font-bold text-slate-900 mt-1">₹{Number(receiptInfo.records.elecBill || 0).toLocaleString('en-IN')}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
                                    <p className="text-sm font-bold text-slate-900 mt-1">
                                        ₹{(receiptInfo.rentAmount + Number(receiptInfo.records.elecBill || 0) + Number(receiptInfo.records.waterBill || 0) + Number(receiptInfo.records.garbageBill || 0)).toLocaleString('en-IN')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Generate Button */}
            <motion.button
                whileHover={{ scale: canGenerate ? 1.02 : 1 }}
                whileTap={{ scale: canGenerate ? 0.98 : 1 }}
                disabled={!canGenerate}
                onClick={() => {
                    if (canGenerate) {
                        generateReceiptPDF(selectedUnit, receiptInfo.tenant, selectedMonth, receiptInfo.records, receiptInfo.rentAmount);
                    }
                }}
                className={`w-full flex items-center justify-center gap-3 font-bold py-3.5 px-6 rounded-xl shadow-md transition-all ${canGenerate
                    ? 'bg-slate-900 text-white hover:bg-slate-800 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
            >
                <Download size={18} />
                {canGenerate ? 'Download Rent Receipt (PDF)' : 'Select a Paid Unit to Generate'}
            </motion.button>
        </div>
    );
}
