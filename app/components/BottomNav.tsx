"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Kalkulator", icon: "📊" },
    { href: "/standard", label: "50/30/20", icon: "📈" },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 px-4 py-3 rounded-full backdrop-blur-lg bg-white/20 dark:bg-gray-800/30 border border-white/30 dark:border-gray-600/50 shadow-lg">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center px-4 py-2 rounded-full transition-all ${
              pathname === item.href
                ? "bg-blue-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/30"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}