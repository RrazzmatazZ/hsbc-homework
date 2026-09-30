"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/estimator", label: "Property Value Estimator" },
  { href: "/market", label: "Property Market Analysis" },
] as const;

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-6">
        <nav aria-label="Primary navigation" className="flex items-center gap-4 sm:gap-6">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`border-b-2 px-0 py-2 text-sm font-medium ${
                  isActive ? "border-brand text-slate-950" : "border-transparent text-slate-500 hover:text-slate-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
