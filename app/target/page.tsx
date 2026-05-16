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
      className="flex flex-col flex-1 items-center justify-center font-sans min-h-screen bg-[var(--background)] text-[var(--foreground)]"
    >
      <main className="flex flex-1 w-full max-w-2xl flex-col items-start py-20 px-6">
        <div className="text-center mb-10 w-full">
          <h1 className="text-5xl font-black mb-3 tracking-tighter uppercase italic text-[var(--foreground)]">
            Target
          </h1>
          <p className="font-mono tracking-widest text-sm uppercase opacity-70">
            Capai target tabungan impian
          </p>
        </div>

        <div className="w-full glass-card p-8 mb-6 brutal-shadow">
          <div className="mb-6">
            <label
              htmlFor="target"
              className="block text-sm font-black mb-2 uppercase tracking-wider"
            >
              Target Tabungan
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold">
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
                className="w-full pl-12 pr-4 py-4 text-lg brutal-border bg-[var(--background)] font-bold placeholder-opacity-50 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="monthlySaving"
              className="block text-sm font-black mb-2 uppercase tracking-wider"
            >
              Tabungan per Bulan
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold">
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
                className="w-full pl-12 pr-4 py-4 text-lg brutal-border bg-[var(--background)] font-bold placeholder-opacity-50 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={calculateTarget}
            disabled={!targetAmount || !monthlySaving || isCalculating}
            className="w-full py-4 text-xl font-black bg-[var(--accent)] text-[var(--accent-text)] brutal-shadow border-2 border-[var(--foreground)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed uppercase italic tracking-tighter"
          >
            {isCalculating ? "Menghitung..." : "Hitung Waktu"}
          </button>
        </div>

        {result && (
          <div className="w-full glass-card p-8 mb-6 animate-fadeIn brutal-shadow">
            <h2 className="text-3xl font-black mb-6 text-center uppercase italic tracking-tighter">
              Hasil
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="brutal-border p-6 text-center">
                <p className="text-xs font-black uppercase tracking-widest text-[var(--foreground)]">
                  Waktu Dibutuhkan
                </p>
                <p className="text-2xl font-black italic tracking-tighter">
                  {result.formattedMonths}
                </p>
              </div>

              <div className="brutal-border p-6 text-center">
                <p className="text-xs font-black uppercase tracking-widest text-[var(--foreground)]">
                  Tabungan per Bulan
                </p>
                <p className="text-2xl font-black italic tracking-tighter">
                  {formatCurrency(result.monthlySaving)}
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