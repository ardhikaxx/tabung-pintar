"use client";

import { useState, useEffect } from "react";
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
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

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
      className={`flex flex-col flex-1 items-center justify-center font-sans min-h-screen ${
        darkMode
          ? "bg-linear-to-br from-gray-900 to-gray-800"
          : "bg-linear-to-br from-blue-50 to-indigo-100"
      }`}
    >
      <main className="flex flex-1 w-full max-w-2xl flex-col items-start py-20 px-6">
        <div className="w-full flex justify-end mb-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
              darkMode ? "bg-gray-800 text-yellow-400" : "bg-white text-gray-700"
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>

        <div className="text-center mb-10 w-full">
          <h1 className={`text-4xl font-bold mb-3 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}>
            Aturan 50/30/20
          </h1>
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
            Standar pengelolaan keuangan yang populer
          </p>
        </div>

        <div className={`w-full rounded-2xl shadow-xl p-8 mb-6 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}>
          <div className="mb-6">
            <label
              htmlFor="income"
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Penghasilan Bersih (per bulan)
            </label>
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>
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
                className={`w-full pl-12 pr-4 py-4 text-lg border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? "border-gray-600 bg-gray-700 text-white" 
                    : "border-gray-300 bg-gray-50 text-gray-900"
                }`}
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
          <div className={`w-full rounded-2xl shadow-xl p-8 mb-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <h2 className={`text-2xl font-bold mb-6 text-center ${
              darkMode ? "text-white" : "text-gray-900"
            }`}>
              Hasil Perhitungan 50/30/20
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`rounded-xl p-6 text-center ${
                darkMode ? "bg-red-900/30" : "bg-red-50"
              }`}>
                <p className={`text-sm mb-1 ${darkMode ? "text-red-400" : "text-red-600"}`}>
                  Kebutuhan (50%)
                </p>
                <p className={`text-xl font-bold ${darkMode ? "text-red-300" : "text-red-700"}`}>
                  {formatCurrency(result.needs)}
                </p>
              </div>

              <div className={`rounded-xl p-6 text-center ${
                darkMode ? "bg-orange-900/30" : "bg-orange-50"
              }`}>
                <p className={`text-sm mb-1 ${darkMode ? "text-orange-400" : "text-orange-600"}`}>
                  Keinginan (30%)
                </p>
                <p className={`text-xl font-bold ${darkMode ? "text-orange-300" : "text-orange-700"}`}>
                  {formatCurrency(result.wants)}
                </p>
              </div>

              <div className={`rounded-xl p-6 text-center ${
                darkMode ? "bg-emerald-900/30" : "bg-emerald-50"
              }`}>
                <p className={`text-sm mb-1 ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                  Tabungan (20%)
                </p>
                <p className={`text-xl font-bold ${darkMode ? "text-emerald-300" : "text-emerald-700"}`}>
                  {formatCurrency(result.savings)}
                </p>
              </div>
            </div>

            <div className={`mt-6 p-4 rounded-xl ${
              darkMode ? "bg-gray-700" : "bg-gray-50"
            }`}>
              <p className={`text-sm text-center ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
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