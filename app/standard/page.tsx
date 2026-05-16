"use client";

import { useState } from "react";
import BottomNav from "../components/BottomNav";
import { useSwipeNavigation } from "../hooks/useSwipeNavigation";

interface StandardResult {
  income: number;
  needs: number;
  wants: number;
  savings: number;
}

function roundToNearest(amount: number, base: number = 10000): number {
  return Math.round(amount / base) * base;
}

export default function StandardPage() {
  const [income, setIncome] = useState<string>("");
  const [result, setResult] = useState<StandardResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const swipeHandlers = useSwipeNavigation();

  const calculateStandard = () => {
    const incomeValue = parseFloat(income.replace(/[^0-9]/g, ""));
    if (!incomeValue || incomeValue <= 0) return;

    setIsCalculating(true);

    setTimeout(() => {
      const needs = roundToNearest(incomeValue * 0.5);
      const wants = roundToNearest(incomeValue * 0.3);
      const savings = incomeValue - needs - wants;

      setResult({
        income: incomeValue,
        needs,
        wants,
        savings,
      });
      setIsCalculating(false);
    }, 300);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      {...swipeHandlers}
      className="flex flex-col flex-1 items-center justify-center font-sans min-h-screen bg-neutral-900"
    >
      <main className="flex flex-1 w-full max-w-2xl flex-col items-start py-20 px-6">
        <div className="text-center mb-10 w-full">
          <h1 className="text-5xl font-black mb-3 tracking-tighter text-white uppercase italic">
            50/30/20
          </h1>
          <p className="text-neutral-400 font-mono tracking-widest text-sm uppercase">
            Aturan alokasi keuangan klasik
          </p>
        </div>

        <div className="w-full glass-card brutal-border p-8 mb-6">
          <div className="mb-6">
            <label
              htmlFor="income"
              className="block text-sm font-black mb-2 text-white uppercase tracking-wider"
            >
              Penghasilan Bersih (per bulan)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-white">
                Rp
              </span>
              <input
                id="income"
                type="text"
                inputMode="numeric"
                placeholder="Contoh: 2.000.000"
                value={income}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "");
                  if (raw) {
                    const formatted = new Intl.NumberFormat("id-ID").format(parseInt(raw));
                    setIncome(formatted);
                  } else {
                    setIncome("");
                  }
                }}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-white bg-transparent text-white font-bold placeholder-neutral-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={calculateStandard}
            disabled={!income || isCalculating}
            className="w-full py-4 text-xl font-black text-black bg-purple-500 hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase italic tracking-tighter"
          >
            {isCalculating ? "Menghitung..." : "Hitung 50/30/20"}
          </button>
        </div>

        {result && (
          <div className="w-full glass-card brutal-border p-8 mb-6 animate-fadeIn">
            <h2 className="text-3xl font-black mb-6 text-center text-white uppercase italic tracking-tighter">
              Hasil
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border-2 border-red-500 p-6 text-center">
                <p className="text-xs font-black text-red-400 uppercase tracking-widest">
                  Kebutuhan
                </p>
                <p className="text-lg font-black text-white italic tracking-tighter">
                  {formatCurrency(result.needs)}
                </p>
              </div>

              <div className="border-2 border-orange-500 p-6 text-center">
                <p className="text-xs font-black text-orange-400 uppercase tracking-widest">
                  Keinginan
                </p>
                <p className="text-lg font-black text-white italic tracking-tighter">
                  {formatCurrency(result.wants)}
                </p>
              </div>

              <div className="border-2 border-emerald-500 p-6 text-center">
                <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                  Tabungan
                </p>
                <p className="text-lg font-black text-white italic tracking-tighter">
                  {formatCurrency(result.savings)}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}