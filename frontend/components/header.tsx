"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface HeaderProps {
  userName: string
}

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Readiness", href: "/my-readiness" },
  { label: "My Plan", href: "/plan" },
  { label: "Learn", href: "/learn" },
]

export function Header({ userName }: HeaderProps) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-emerald-500" fill="currentColor">
              <path
                d="M12 2L12 8M12 8L8 4M12 8L16 4M12 22L12 16M12 16L8 20M12 16L16 20M2 12H8M8 12L4 8M8 12L4 16M22 12H16M16 12L20 8M16 12L20 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          <span className="text-lg font-semibold text-foreground">WealthWiz</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-emerald-600",
                pathname === item.href ? "text-emerald-600 underline underline-offset-4" : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
          <span className="text-sm text-foreground">Hi, {userName}</span>
          <span className="text-lg">👋</span>
        </div>
      </div>
    </header>
  )
}
