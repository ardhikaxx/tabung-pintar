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
      className="flex flex-col flex-1 items-center justify-center font-sans min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
    >
      <main className="flex flex-1 w-full max-w-2xl flex-col items-start py-20 px-6">
        <div className="text-center mb-10 w-full">
          <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">
            Aturan 50/30/20
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Standar pengelolaan keuangan yang populer
          </p>
        </div>

        <div className="w-full rounded-2xl shadow-xl p-8 mb-6 bg-white dark:bg-gray-800">
          <div className="mb-6">
            <label
              htmlFor="income"
              className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
            >
              Penghasilan Bersih (per bulan)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-500 dark:text-gray-400">
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
                className="w-full pl-12 pr-4 py-4 text-lg border rounded-xl focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <button
            onClick={calculateStandard}
            disabled={!income || isCalculating}
            className="w-full py-4 text-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors disabled:opacity-50"
          >
            {isCalculating ? "Menghitung..." : "Hitung 50/30/20"}
          </button>
        </div>

        {result && (
          <div className="w-full rounded-2xl shadow-xl p-8 mb-6 bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
              Hasil Perhitungan 50/30/20
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl p-6 text-center bg-red-50 dark:bg-red-900/30">
                <p className="text-sm mb-1 text-red-600 dark:text-red-400">
                  Kebutuhan (50%)
                </p>
                <p className="text-xl font-bold text-red-700 dark:text-red-300">
                  {formatCurrency(result.needs)}
                </p>
              </div>

              <div className="rounded-xl p-6 text-center bg-orange-50 dark:bg-orange-900/30">
                <p className="text-sm mb-1 text-orange-600 dark:text-orange-400">
                  Keinginan (30%)
                </p>
                <p className="text-xl font-bold text-orange-700 dark:text-orange-300">
                  {formatCurrency(result.wants)}
                </p>
              </div>

              <div className="rounded-xl p-6 text-center bg-emerald-50 dark:bg-emerald-900/30">
                <p className="text-sm mb-1 text-emerald-600 dark:text-emerald-400">
                  Tabungan (20%)
                </p>
                <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                  {formatCurrency(result.savings)}
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                <span className="font-medium">Total Penghasilan:</span>{" "}
                {formatCurrency(result.income)}
              </p>
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}