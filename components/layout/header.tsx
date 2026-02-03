"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Menu,
  X,
  Moon,
  Sun,
  LogIn,
  UserPlus,
  Code2,
  ChevronRight
} from "lucide-react"
import { NAVIGATION, SITE_CONFIG } from "@/lib/constants"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()

  // Handle scroll effect for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }, [pathname, isMobileMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  const isActivePath = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Fixed header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-primary/5"
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 group transition-all duration-200 hover:opacity-80"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md group-hover:blur-lg transition-all duration-300" />
                <Code2 className="h-7 w-7 text-primary relative" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold tracking-tight leading-none">
                  {SITE_CONFIG.shortName}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium leading-none">
                  by TechSci
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {NAVIGATION.main.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group",
                    isActivePath(item.href)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {/* Active indicator */}
                  {isActivePath(item.href) && (
                    <span className="absolute inset-0 bg-accent/50 rounded-lg" />
                  )}

                  {/* Hover effect */}
                  <span className="absolute inset-0 bg-accent/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                  <span className="relative">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Theme toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative group overflow-hidden"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* Auth buttons */}
              {session ? (
                <Link href="/dashboard">
                  <Button
                    size="sm"
                    className="group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative">Dashboard</span>
                    <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="group"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      <span>Login</span>
                    </Button>
                  </Link>

                  <Link href="/signup">
                    <Button
                      size="sm"
                      className="group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <UserPlus className="h-4 w-4 mr-2 relative" />
                      <span className="relative">Sign Up</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Mobile menu panel */}
          <div className="fixed top-16 left-0 right-0 bottom-0 z-40 md:hidden animate-in slide-in-from-top-4 duration-300">
            <div className="bg-card/95 backdrop-blur-xl border-b border-border/50 shadow-2xl shadow-primary/10 h-full overflow-y-auto">
              <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Navigation links */}
                <nav className="space-y-2">
                  {NAVIGATION.main.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200",
                        isActivePath(item.href)
                          ? "bg-accent/50 text-foreground font-medium"
                          : "text-muted-foreground hover:bg-accent/30 hover:text-foreground"
                      )}
                    >
                      <span>{item.label}</span>
                      {isActivePath(item.href) && (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Link>
                  ))}
                </nav>

                {/* Divider */}
                <div className="h-px bg-border/50" />

                {/* Theme toggle */}
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <span className="font-medium">Theme</span>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="h-4 w-4 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </div>
                </Button>

                {/* Auth buttons */}
                {session ? (
                  <Link href="/dashboard" className="block">
                    <Button size="lg" className="w-full group relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <span className="relative font-medium">Go to Dashboard</span>
                      <ChevronRight className="h-4 w-4 ml-2 relative transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link href="/login" className="block">
                      <Button variant="outline" size="lg" className="w-full">
                        <LogIn className="h-4 w-4 mr-2" />
                        <span className="font-medium">Login</span>
                      </Button>
                    </Link>

                    <Link href="/signup" className="block">
                      <Button size="lg" className="w-full group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <UserPlus className="h-4 w-4 mr-2 relative" />
                        <span className="relative font-medium">Create Account</span>
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-16" />
    </>
  )
}
