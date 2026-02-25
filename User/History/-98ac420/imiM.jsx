import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export default function UnitCard({ unit, onSelect }) {
    const isPrivate = unit.isPrivate;
    const isProminent = unit.isProminent;

    // Logic to determine status based on current month (mocking Feb 2026)
    const currentMonth = "2026-02";
    const records = unit.monthlyRecords?.[currentMonth] || {};
    const status = records.rentStatus || 'unknown';
    const isOverdue = status === 'overdue';

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onSelect}
            className={clsx(
                "w-full text-left bg-white rounded-2xl p-4 border transition-all duration-200",
                "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-300",
                isProminent ? "border-slate-800 shadow-sm" : "border-slate-200 shadow-sm",
                isPrivate ? "opacity-80 grayscale" : ""
            )}
        >
            <div className="flex items-start justify-between">
                <div>
                    <h3 className={clsx(
                        "font-semibold text-lg tracking-tight",
                        isProminent ? "text-slate-900" : "text-slate-800"
                    )}>
                        {unit.name}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium mt-0.5 tracking-wide">
                        {unit.type}
                    </p>
                </div>

                {!isPrivate && (
                    <div className="flex flex-col items-end gap-2">
                        {status === 'paid' && (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                <CheckCircle2 size={12} />
                                Paid
                            </span>
                        )}
                        {isOverdue && (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-1 rounded-full animate-pulse">
                                <AlertCircle size={12} />
                                Overdue
                            </span>
                        )}
                        {status === 'unpaid' && (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                <AlertCircle size={12} />
                                Unpaid
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-4 flex items-center justify-between text-slate-400 border-t border-slate-100 pt-3">
                <span className="text-xs font-medium uppercase tracking-wider">
                    {isPrivate ? 'Restricted Access' : `Unit ${unit.id}`}
                </span>
                <ChevronRight size={16} className={clsx("transition-transform", isProminent && "text-slate-800")} />
            </div>
        </motion.button>
    );
}
