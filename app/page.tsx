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
      className="flex flex-col flex-1 items-center justify-center font-sans min-h-screen bg-neutral-900"
    >
      <main className="flex flex-1 w-full max-w-2xl flex-col items-start py-20 px-6">
        <div className="text-center mb-10 w-full">
          <h1 className="text-5xl font-black mb-3 tracking-tighter text-white uppercase italic">
            TabungPintar
          </h1>
          <p className="text-neutral-400 font-mono tracking-widest text-sm uppercase">
            Hitung alokasi dana ideal Anda
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
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-white bg-transparent text-white font-bold placeholder-neutral-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-black mb-3 text-white uppercase tracking-wider">
              Mode Menabung
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(["conservative", "balanced", "aggressive"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`py-3 px-3 border-2 transition-all font-black uppercase text-xs ${
                    mode === m
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-white border-neutral-600 hover:border-white"
                  }`}
                >
                  {modeConfig[m].label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={calculateSavings}
            disabled={!income || isCalculating}
            className="w-full py-4 text-xl font-black text-black bg-yellow-400 hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase italic tracking-tighter"
          >
            {isCalculating ? "Menghitung..." : "Mulai Hitung"}
          </button>
        </div>

        {result && (
          <div className="w-full glass-card brutal-border p-8 mb-6 animate-fadeIn">
            <h2 className="text-3xl font-black mb-6 text-center text-white uppercase italic tracking-tighter">
              Hasil
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
                      backgroundColor: "#000",
                      border: "2px solid #fff",
                      borderRadius: "0",
                      color: "#fff",
                    }}
                    formatter={(value: unknown) => formatCurrency(Number(value))}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-blue-500 p-6 text-center">
                <p className="text-xs font-black text-blue-400 uppercase tracking-widest">
                  Tabungan
                </p>
                <p className="text-3xl font-black text-white italic tracking-tighter">
                  {formatCurrency(result.savings)}
                </p>
              </div>

              <div className="border-2 border-green-500 p-6 text-center">
                <p className="text-xs font-black text-green-400 uppercase tracking-widest">
                  Keperluan
                </p>
                <p className="text-3xl font-black text-white italic tracking-tighter">
                  {formatCurrency(result.needs)}
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