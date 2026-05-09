"use client";

import { useState, useEffect } from "react";
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
      className={`flex flex-col flex-1 items-center justify-center font-sans min-h-screen ${
        darkMode
          ? "bg-linear-to-br from-gray-900 to-gray-800"
          : "bg-linear-to-br from-orange-50 to-red-100"
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
          <h1
            className={`text-4xl font-bold mb-3 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Dana Darurat
          </h1>
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
            Hitung kebutuhan dana darurat untuk keamanan finansial
          </p>
        </div>

        <div
          className={`w-full rounded-2xl shadow-xl p-8 mb-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
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
              <span
                className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
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
                className={`w-full pl-12 pr-4 py-4 text-lg border rounded-xl focus:ring-2 focus:ring-orange-500 ${
                  darkMode
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-300 bg-gray-50 text-gray-900"
                }`}
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
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
                      : darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {months} bln
                </button>
              ))}
            </div>
            <p className={`text-xs mt-2 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}>
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
                className={`px-6 py-4 text-lg font-medium rounded-xl transition-colors ${
                  darkMode
                    ? "text-gray-300 bg-gray-700 hover:bg-gray-600"
                    : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {result && (
          <div
            className={`w-full rounded-2xl shadow-xl p-8 mb-6 animate-fadeIn ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-6 text-center ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Dana Darurat Anda
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <div
                className={`rounded-xl p-6 text-center ${
                  darkMode ? "bg-red-900/30" : "bg-red-50"
                }`}
              >
                <p
                  className={`text-sm mb-1 ${
                    darkMode ? "text-red-400" : "text-red-600"
                  }`}
                >
                  Total Dana Darurat
                </p>
                <p
                  className={`text-4xl font-bold ${
                    darkMode ? "text-red-300" : "text-red-700"
                  }`}
                >
                  {formatCurrency(result.emergencyFund)}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Untuk {result.monthsCoverage} bulan pengeluaran
                </p>
              </div>

              <div
                className={`rounded-xl p-6 text-center ${
                  darkMode ? "bg-orange-900/30" : "bg-orange-50"
                }`}
              >
                <p
                  className={`text-sm mb-1 ${
                    darkMode ? "text-orange-400" : "text-orange-600"
                  }`}
                >
                  Saran Tabungan per Bulan
                </p>
                <p
                  className={`text-2xl font-bold ${
                    darkMode ? "text-orange-300" : "text-orange-700"
                  }`}
                >
                  {formatCurrency(result.suggestedMonthlySaving)}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Bisa capai dalam 12 bulan
                </p>
              </div>

              <div
                className={`rounded-xl p-6 text-center ${
                  darkMode ? "bg-blue-900/30" : "bg-blue-50"
                }`}
              >
                <p
                  className={`text-sm mb-1 ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  Berdasarkan Penghasilan
                </p>
                <p
                  className={`text-xl font-bold ${
                    darkMode ? "text-blue-300" : "text-blue-700"
                  }`}
                >
                  {formatCurrency(result.monthlyIncome)}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  per bulan
                </p>
              </div>
            </div>

            <div
              className={`mt-6 p-4 rounded-xl ${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <p
                className={`text-sm text-center ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
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