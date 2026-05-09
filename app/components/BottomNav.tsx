"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { 
      href: "/", 
      label: "Kalkulator", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 01 2-2h10a2 2 0 01 2 2v6" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 01 2-2h10a2 2 0 01 2 2v6H5V5z" />
        </svg>
      )
    },
    { 
      href: "/standard", 
      label: "50/30/20", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 11 21 12c0-5.523-4.477-10-10-10" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12c0 5.523-4.477 10-10 10S1 17.523 1 12" />
          <circle cx="12" cy="12" r="3" strokeWidth="2" />
        </svg>
      )
    },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 px-4 py-3 rounded-full backdrop-blur-lg bg-white/20 dark:bg-gray-800/30 border border-white/30 dark:border-gray-600/50 shadow-lg">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              pathname === item.href
                ? "bg-blue-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/30"
            }`}
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}