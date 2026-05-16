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
      className="flex flex-col flex-1 items-center justify-center font-sans min-h-screen bg-[var(--background)] text-[var(--foreground)]"
    >
      <main className="flex flex-1 w-full max-w-2xl flex-col items-start py-20 px-6">
        <div className="text-center mb-10 w-full">
          <h1 className="text-5xl font-black mb-3 tracking-tighter uppercase italic text-[var(--foreground)]">
            Dana Darurat
          </h1>
          <p className="font-mono tracking-widest text-sm uppercase opacity-70">
            Hitung cadangan finansial Anda
          </p>
        </div>

        <div className="w-full glass-card p-8 mb-6 brutal-shadow">
          <div className="mb-6">
            <label
              htmlFor="income"
              className="block text-sm font-black mb-2 uppercase tracking-wider"
            >
              Penghasilan Bersih (per bulan)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold">
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
                className="w-full pl-12 pr-4 py-4 text-lg brutal-border bg-[var(--background)] font-bold placeholder-opacity-50 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-black mb-2 uppercase tracking-wider">
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
                  className={`py-3 px-4 brutal-border transition-all font-black uppercase text-xs ${
                    monthsCoverage === months
                      ? "bg-[var(--foreground)] text-[var(--background)]"
                      : "bg-transparent hover:bg-[var(--foreground)] hover:text-[var(--background)]"
                  }`}
                >
                  {months}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={calculateEmergency}
            disabled={!monthlyIncome || isCalculating}
            className="w-full py-4 text-xl font-black bg-[var(--accent)] text-[var(--accent-text)] brutal-shadow border-2 border-[var(--foreground)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed uppercase italic tracking-tighter"
          >
            {isCalculating ? "Menghitung..." : "Hitung Dana Darurat"}
          </button>
        </div>

        {result && (
          <div className="w-full glass-card p-8 mb-6 animate-fadeIn brutal-shadow">
            <h2 className="text-3xl font-black mb-6 text-center uppercase italic tracking-tighter">
              Dana Darurat
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <div className="brutal-border p-6 text-center">
                <p className="text-xs font-black uppercase tracking-widest text-[var(--foreground)]">
                  Total Dana Darurat
                </p>
                <p className="text-4xl font-black italic tracking-tighter">
                  {formatCurrency(result.emergencyFund)}
                </p>
              </div>

              <div className="brutal-border p-6 text-center">
                <p className="text-xs font-black uppercase tracking-widest text-[var(--foreground)]">
                  Saran Tabungan per Bulan
                </p>
                <p className="text-3xl font-black italic tracking-tighter">
                  {formatCurrency(result.suggestedMonthlySaving)}
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