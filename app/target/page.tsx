"use client";

import { useState, useEffect } from "react";
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
      className={`flex flex-col flex-1 items-center justify-center font-sans min-h-screen ${
        darkMode
          ? "bg-linear-to-br from-gray-900 to-gray-800"
          : "bg-linear-to-br from-purple-50 to-pink-100"
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
            Target Tabungan
          </h1>
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
            Hitung berapa lama untuk mencapai target tabungan Anda
          </p>
        </div>

        <div
          className={`w-full rounded-2xl shadow-xl p-8 mb-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="mb-6">
            <label
              htmlFor="target"
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Target Tabungan
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
                className={`w-full pl-12 pr-4 py-4 text-lg border rounded-xl focus:ring-2 focus:ring-purple-500 ${
                  darkMode
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-300 bg-gray-50 text-gray-900"
                }`}
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="monthlySaving"
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Tabungan per Bulan
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
                className={`w-full pl-12 pr-4 py-4 text-lg border rounded-xl focus:ring-2 focus:ring-purple-500 ${
                  darkMode
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-300 bg-gray-50 text-gray-900"
                }`}
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
              Hasil Perhitungan
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className={`rounded-xl p-6 text-center ${
                  darkMode ? "bg-purple-900/30" : "bg-purple-50"
                }`}
              >
                <p
                  className={`text-sm mb-1 ${
                    darkMode ? "text-purple-400" : "text-purple-600"
                  }`}
                >
                  Waktu yang Dibutuhkan
                </p>
                <p
                  className={`text-3xl font-bold ${
                    darkMode ? "text-purple-300" : "text-purple-700"
                  }`}
                >
                  {result.formattedMonths}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {result.monthsNeeded} bulan.total
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
                  Tabungan per Bulan
                </p>
                <p
                  className={`text-3xl font-bold ${
                    darkMode ? "text-blue-300" : "text-blue-700"
                  }`}
                >
                  {formatCurrency(result.monthlySaving)}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  needed to reach target
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