import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { TrendingUp, AlertCircle } from 'lucide-react';

export default function MetricCard({ title, value, subtext, icon: Icon, trend, trendValue, isAlert }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={clsx(
                    "p-2 rounded-xl flex items-center justify-center",
                    isAlert ? "bg-rose-50 text-rose-500" : "bg-slate-50 text-slate-700"
                )}>
                    {Icon && <Icon size={20} />}
                </div>

                {trend && (
                    <div className={clsx(
                        "flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full",
                        trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                        <TrendingUp size={12} className={trend === 'down' ? "rotate-180" : ""} />
                        {trendValue}
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</h3>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
                {subtext && (
                    <p className="text-xs text-slate-500 font-medium tracking-wide mt-2 flex items-center gap-1.5">
                        {isAlert && <AlertCircle size={14} className="text-rose-500" />}
                        {subtext}
                    </p>
                )}
            </div>
        </motion.div>
    );
}
