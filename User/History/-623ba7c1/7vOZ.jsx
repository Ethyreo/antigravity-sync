import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

export default function AuthGate({ onUnlock }) {
    const [pin, setPin] = useState(['', '', '', '']);
    const [error, setError] = useState(false);

    // Hardcoded for mock. Will change later.
    const CORRECT_PIN = "1994";

    const handleInput = (index, value) => {
        setError(false);
        if (!/^\d*$/.test(value)) return;

        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        // Auto focus next
        if (value && index < 3) {
            document.getElementById(`pin-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            document.getElementById(`pin-${index - 1}`).focus();
        }
    };

    const verifyPin = (e) => {
        e.preventDefault();
        const enteredPin = pin.join('');
        if (enteredPin === CORRECT_PIN) {
            onUnlock();
        } else {
            setError(true);
            setPin(['', '', '', '']);
            document.getElementById('pin-0').focus();
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 sm:p-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-slate-200 via-slate-400 to-slate-200"></div>

                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-slate-50 text-slate-800 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                        <Lock size={28} />
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Access Securely</h1>
                    <p className="text-sm text-slate-500 font-medium tracking-wide mt-2">
                        Enter the building management PIN to view real-time data.
                    </p>
                </div>

                <form onSubmit={verifyPin}>
                    <div className="flex justify-center gap-3 md:gap-4 mb-4">
                        {pin.map((digit, index) => (
                            <input
                                key={index}
                                id={`pin-${index}`}
                                type="password"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleInput(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className={clsx(
                                    "w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 transition-all outline-none",
                                    error ? "border-rose-400 bg-rose-50 text-rose-600" :
                                        digit ? "border-slate-800 bg-slate-50" : "border-slate-200 bg-white focus:border-slate-400"
                                )}
                            />
                        ))}
                    </div>

                    <div className="h-6 mb-8 text-center text-sm font-bold tracking-wider text-rose-500 uppercase">
                        {error ? "Incorrect PIN" : ""}
                    </div>

                    <button
                        type="submit"
                        disabled={pin.join('').length < 4}
                        className="w-full bg-slate-900 text-white rounded-xl py-4 flex items-center justify-center gap-2 font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Unlock <ArrowRight size={18} />
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
