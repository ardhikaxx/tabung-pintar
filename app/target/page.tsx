"use client";

import { useState } from "react";
import BottomNav from "../components/BottomNav";
import { useSwipeNavigation } from "../hooks/useSwipeNavigation";

interface TargetResult {
  targetAmount: number;
  monthlySaving: number;
  monthsNeeded: number;
  yearsNeeded: number;
  remainingMonths: number;
  formattedMonths: string;
}

export default function TargetPage() {
  const [targetAmount, setTargetAmount] = useState<string>("");
  const [monthlySaving, setMonthlySaving] = useState<string>("");
  const [result, setResult] = useState<TargetResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const swipeHandlers = useSwipeNavigation();

  const calculateTarget = () => {
    const target = parseFloat(targetAmount.replace(/[^0-9]/g, ""));
    const saving = parseFloat(monthlySaving.replace(/[^0-9]/g, ""));

    if (!target || target <= 0 || !saving || saving <= 0) return;

    setIsCalculating(true);

    setTimeout(() => {
      const totalMonths = Math.ceil(target / saving);
      const years = Math.floor(totalMonths / 12);
      const months = totalMonths % 12;

      const formattedMonths =
        years > 0
          ? `${years} tahun ${months} bulan`
          : `${months} bulan`;

      setResult({
        targetAmount: target,
        monthlySaving: saving,
        monthsNeeded: totalMonths,
        yearsNeeded: years,
        remainingMonths: months,
        formattedMonths,
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      calculateTarget();
    }
  };

  const resetCalculator = () => {
    setTargetAmount("");
    setMonthlySaving("");
    setResult(null);
  };

  return (
    <div
      {...swipeHandlers}
      className="flex flex-col flex-1 items-center justify-center font-sans min-h-screen bg-linear-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800"
    >
      <main className="flex flex-1 w-full max-w-2xl flex-col items-start py-20 px-6">
        <div className="text-center mb-10 w-full">
          <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">
            Target Tabungan
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Hitung berapa lama untuk mencapai target tabungan Anda
          </p>
        </div>

        <div className="w-full rounded-2xl shadow-xl p-8 mb-6 bg-white dark:bg-gray-800">
          <div className="mb-6">
            <label
              htmlFor="target"
              className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
            >
              Target Tabungan
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-500 dark:text-gray-400">
                Rp
              </span>
              <input
                id="target"
                type="text"
                inputMode="numeric"
                placeholder="Contoh: 10.000.000"
                value={targetAmount}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "");
                  if (raw) {
                    const formatted = new Intl.NumberFormat("id-ID").format(parseInt(raw));
                    setTargetAmount(formatted);
                  } else {
                    setTargetAmount("");
                  }
                }}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-4 text-lg border rounded-xl focus:ring-2 focus:ring-purple-500 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="monthlySaving"
              className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
            >
              Tabungan per Bulan
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-500 dark:text-gray-400">
                Rp
              </span>
              <input
                id="monthlySaving"
                type="text"
                inputMode="numeric"
                placeholder="Contoh: 500.000"
                value={monthlySaving}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "");
                  if (raw) {
                    const formatted = new Intl.NumberFormat("id-ID").format(parseInt(raw));
                    setMonthlySaving(formatted);
                  } else {
                    setMonthlySaving("");
                  }
                }}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-4 text-lg border rounded-xl focus:ring-2 focus:ring-purple-500 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={calculateTarget}
              disabled={!targetAmount || !monthlySaving || isCalculating}
              className="flex-1 py-4 text-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCalculating ? "Menghitung..." : "Hitung Waktu"}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl p-6 text-center bg-purple-50 dark:bg-purple-900/30">
                <p className="text-sm mb-1 text-purple-600 dark:text-purple-400">
                  Waktu yang Dibutuhkan
                </p>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                  {result.formattedMonths}
                </p>
                <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                  {result.monthsNeeded} bulan total
                </p>
              </div>

              <div className="rounded-xl p-6 text-center bg-blue-50 dark:bg-blue-900/30">
                <p className="text-sm mb-1 text-blue-600 dark:text-blue-400">
                  Tabungan per Bulan
                </p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {formatCurrency(result.monthlySaving)}
                </p>
                <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                  needed to reach target
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                <span className="font-medium">Target Total:</span>{" "}
                {formatCurrency(result.targetAmount)}
              </p>
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}