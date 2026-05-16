"use client";

import { useState } from "react";
import BottomNav from "../components/BottomNav";
import { useSwipeNavigation } from "../hooks/useSwipeNavigation";

interface EmergencyResult {
  monthlyIncome: number;
  monthsCoverage: number;
  emergencyFund: number;
  suggestedMonthlySaving: number;
}

export default function EmergencyPage() {
  const [monthlyIncome, setMonthlyIncome] = useState<string>("");
  const [monthsCoverage, setMonthsCoverage] = useState<number>(6);
  const [result, setResult] = useState<EmergencyResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const swipeHandlers = useSwipeNavigation();

  const calculateEmergency = () => {
    const income = parseFloat(monthlyIncome.replace(/[^0-9]/g, ""));

    if (!income || income <= 0) return;

    setIsCalculating(true);

    setTimeout(() => {
      const emergencyFund = income * monthsCoverage;
      const suggestedMonthlySaving = Math.ceil(emergencyFund / 12);

      setResult({
        monthlyIncome: income,
        monthsCoverage,
        emergencyFund,
        suggestedMonthlySaving,
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
      calculateEmergency();
    }
  };

  const resetCalculator = () => {
    setMonthlyIncome("");
    setMonthsCoverage(6);
    setResult(null);
  };

  const coverageOptions = [3, 6, 9, 12];

  return (
    <div
      {...swipeHandlers}
      className="flex flex-col flex-1 items-center justify-center font-sans min-h-screen bg-linear-to-br from-orange-50 to-red-100 dark:from-gray-900 dark:to-gray-800"
    >
      <main className="flex flex-1 w-full max-w-2xl flex-col items-start py-20 px-6">
        <div className="text-center mb-10 w-full">
          <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">
            Dana Darurat
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Hitung kebutuhan dana darurat untuk keamanan finansial
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
                placeholder="Contoh: 5.000.000"
                value={monthlyIncome}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "");
                  if (raw) {
                    const formatted = new Intl.NumberFormat("id-ID").format(parseInt(raw));
                    setMonthlyIncome(formatted);
                  } else {
                    setMonthlyIncome("");
                  }
                }}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-4 text-lg border rounded-xl focus:ring-2 focus:ring-orange-500 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Cakupan Periode (bulan)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {coverageOptions.map((months) => (
                <button
                  key={months}
                  onClick={() => {
                    setMonthsCoverage(months);
                    setTimeout(calculateEmergency, 100);
                  }}
                  className={`py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                    monthsCoverage === months
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {months} bln
                </button>
              ))}
            </div>
            <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
              3 bulan: minimal, 6 bulan: standar, 12 bulan: aman
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={calculateEmergency}
              disabled={!monthlyIncome || isCalculating}
              className="flex-1 py-4 text-lg font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCalculating ? "Menghitung..." : "Hitung Dana Darurat"}
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
              Dana Darurat Anda
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-xl p-6 text-center bg-red-50 dark:bg-red-900/30">
                <p className="text-sm mb-1 text-red-600 dark:text-red-400">
                  Total Dana Darurat
                </p>
                <p className="text-4xl font-bold text-red-700 dark:text-red-300">
                  {formatCurrency(result.emergencyFund)}
                </p>
                <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                  Untuk {result.monthsCoverage} bulan pengeluaran
                </p>
              </div>

              <div className="rounded-xl p-6 text-center bg-orange-50 dark:bg-orange-900/30">
                <p className="text-sm mb-1 text-orange-600 dark:text-orange-400">
                  Saran Tabungan per Bulan
                </p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                  {formatCurrency(result.suggestedMonthlySaving)}
                </p>
                <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                  Bisa capai dalam 12 bulan
                </p>
              </div>

              <div className="rounded-xl p-6 text-center bg-blue-50 dark:bg-blue-900/30">
                <p className="text-sm mb-1 text-blue-600 dark:text-blue-400">
                  Berdasarkan Penghasilan
                </p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                  {formatCurrency(result.monthlyIncome)}
                </p>
                <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                  per bulan
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                💡 Dana darurat adalah cadangan untuk keperluan mendesak
                seperti sakit, kehilangan pekerjaan, atau perbaikan darurat.
                Simpan di rekening terpisah yang mudah diakses.
              </p>
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}