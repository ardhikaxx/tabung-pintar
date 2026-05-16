"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import BottomNav from "./components/BottomNav";
import { useSwipeNavigation } from "./hooks/useSwipeNavigation";

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

  const swipeHandlers = useSwipeNavigation();

  const chartData = result
    ? [
        { name: "Menabung", value: result.savings, color: "#3b82f6" },
        { name: "Keperluan", value: result.needs, color: "#22c55e" },
      ]
    : [];

  return (
    <div
      {...swipeHandlers}
      className="flex flex-col flex-1 items-center justify-center font-sans min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
    >
      <main className="flex flex-1 w-full max-w-2xl flex-col items-start py-20 px-6">
        <div className="text-center mb-10 w-full">
          <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">
            TabungPintar
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Hitung berapa persen yang ideal untuk menabung dari penghasilan Anda
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
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-4 text-lg border rounded-xl focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
              Pilih Mode Menabung
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(["conservative", "balanced", "aggressive"] as const).map((m) => (
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
            <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
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
                className="px-6 py-4 text-lg font-medium rounded-xl transition-colors text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {result && (
          <div className="w-full rounded-2xl shadow-xl p-8 mb-6 animate-fadeIn bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
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
                      backgroundColor: "#1f2937",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                    formatter={(value: unknown) => formatCurrency(Number(value))}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl p-6 text-center bg-blue-50 dark:bg-blue-900/30">
                <p className="text-sm mb-1 text-blue-600 dark:text-blue-400">
                  Disarankan Menabung
                </p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {formatCurrency(result.savings)}
                </p>
                <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                  {result.percentage}% dari penghasilan
                </p>
              </div>

              <div className="rounded-xl p-6 text-center bg-green-50 dark:bg-green-900/30">
                <p className="text-sm mb-1 text-green-600 dark:text-green-400">
                  Untuk Keperluan
                </p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {formatCurrency(result.needs)}
                </p>
                <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                  {100 - result.percentage}% dari penghasilan
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