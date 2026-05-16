"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, PieChart, Target, Shield } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Calc", icon: Calculator },
    { href: "/standard", label: "50/30/20", icon: PieChart },
    { href: "/target", label: "Goal", icon: Target },
    { href: "/emergency", label: "Fund", icon: Shield },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 px-4 py-3 glass-card brutal-border">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 transition-all font-black uppercase text-xs ${
                isActive
                  ? "bg-white text-black"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className={`${isActive ? "" : "hidden"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}