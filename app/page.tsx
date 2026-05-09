"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface SavingsResult {
  income: number;
  savings: number;
  needs: number;
  percentage: number;
}

function roundToNearest(amount: number, base: number = 10000): number {
  return Math.round(amount / base) * base;
}

const modeConfig = {
  conservative: { label: "Konservatif", percentage: 0.2 },
  balanced: { label: "Seimbang", percentage: 0.4 },
  aggressive: { label: "Agresif", percentage: 0.6 },
};

export default function Home() {
  const [income, setIncome] = useState<string>("");
  const [result, setResult] = useState<SavingsResult | null>(null);
  const [mode, setMode] = useState<"conservative" | "balanced" | "aggressive">(
    "balanced"
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      if (saved !== null) return JSON.parse(saved);
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const calculateSavings = () => {
    const incomeValue = parseFloat(income.replace(/[^0-9]/g, ""));
    if (!incomeValue || incomeValue <= 0) return;

    setIsCalculating(true);

    setTimeout(() => {
      const config = modeConfig[mode];
      const idealSavings = incomeValue * config.percentage;
      const roundedSavings = roundToNearest(idealSavings);
      const roundedNeeds = incomeValue - roundedSavings;

      setResult({
        income: incomeValue,
        savings: roundedSavings,
        needs: roundedNeeds,
        percentage: Math.round((roundedSavings / incomeValue) * 100),
      });
      setIsCalculating(false);
    }, 300);
  };

  const resetCalculator = () => {
    setIncome("");
    setResult(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      calculateSavings();
    }
  };

  const chartData = result
    ? [
        { name: "Menabung", value: result.savings, color: "#3b82f6" },
        { name: "Keperluan", value: result.needs, color: "#22c55e" },
      ]
    : [];

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 font-sans min-h-screen">
      <main className="flex flex-1 w-full max-w-2xl flex-col items-start py-20 px-6">
        <div className="w-full flex justify-end mb-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg
                className="w-6 h-6 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-gray-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>

        <div className="text-center mb-10 w-full">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            TabungPintar
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Hitung berapa persen yang ideal untuk menabung dari penghasilan Anda
          </p>
        </div>

        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
          <div className="mb-6">
            <label
              htmlFor="income"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Penghasilan Bersih (per bulan)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-lg">
                Rp
              </span>
              <input
                id="income"
                type="text"
                inputMode="numeric"
                placeholder="Contoh: 2000000"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Pilih Mode Menabung
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(
                ["conservative", "balanced", "aggressive"] as const
              ).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    mode === m
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {modeConfig[m].label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {mode === "conservative"
                ? "20% untuk menabung, cocok untuk pemula"
                : mode === "balanced"
                ? "40% untuk menabung, rekomendasi ideal"
                : "60% untuk menabung, untuk target finansial besar"}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={calculateSavings}
              disabled={!income || isCalculating}
              className="flex-1 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCalculating ? "Menghitung..." : "Mulai Hitung"}
            </button>
            {result && (
              <button
                onClick={resetCalculator}
                className="px-6 py-4 text-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-xl transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {result && (
          <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Hasil Perhitungan
            </h2>

            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                    }}
                    formatter={(value: unknown) => formatCurrency(Number(value))}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6 text-center">
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                  Disarankan Menabung
                </p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {formatCurrency(result.savings)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {result.percentage}% dari penghasilan
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-6 text-center">
                <p className="text-sm text-green-600 dark:text-green-400 mb-1">
                  Untuk Keperluan
                </p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {formatCurrency(result.needs)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {100 - result.percentage}% dari penghasilan
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                <span className="font-medium">Total Penghasilan:</span>{" "}
                {formatCurrency(result.income)}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}