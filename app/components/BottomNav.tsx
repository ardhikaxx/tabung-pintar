"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, PieChart, Target, Shield } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Kalkulator", icon: Calculator },
    { href: "/standard", label: "50/30/20", icon: PieChart },
    { href: "/target", label: "Target", icon: Target },
    { href: "/emergency", label: "Darurat", icon: Shield },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 px-4 py-3 rounded-full backdrop-blur-lg bg-white/20 dark:bg-gray-800/30 border border-white/30 dark:border-gray-600/50 shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              pathname === item.href
                ? "bg-blue-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/30"
            }`}
            >
            <Icon className="w-5 h-5" />
            <span className={`text-sm font-medium ${pathname === item.href ? "" : "hidden"}`}>
              {item.label}
            </span>
            </Link>          );
        })}
      </div>
    </nav>
  );
}