"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  Receipt,
  User,
  Menu,
  X,
  LogOut,
  Moon,
  Sun,
  ChevronRight,
  Code2,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const DASHBOARD_NAV = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    label: "Purchases",
    href: "/dashboard/purchases",
    icon: Receipt,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isSidebarOpen])

  const isActivePath = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  const getUserInitials = (name: string | null | undefined) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed top-0 left-0 z-40 w-64 h-screen hidden lg:block border-r border-sidebar-border bg-sidebar">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
            <Link
              href="/"
              className="flex items-center space-x-2 group transition-all duration-200 hover:opacity-80"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-sidebar-primary/20 rounded-lg blur-md group-hover:blur-lg transition-all duration-300" />
                <Code2 className="h-6 w-6 text-sidebar-primary relative" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-semibold tracking-tight leading-none text-sidebar-foreground">
                  CodeCraft
                </span>
                <span className="text-[10px] text-sidebar-foreground/60 font-medium leading-none">
                  by TechSci
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {DASHBOARD_NAV.map((item) => {
              const Icon = item.icon
              const active = isActivePath(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group relative",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-sidebar-primary rounded-r-full" />
                  )}
                  <Icon className={cn("h-5 w-5 transition-all duration-200", active && "text-sidebar-primary")} />
                  <span className="text-sm">{item.label}</span>
                  {active && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Link>
              )
            })}
          </nav>

          {/* User menu */}
          <div className="p-4 border-t border-sidebar-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent/50 transition-all duration-200 group">
                  <Avatar className="h-9 w-9 ring-2 ring-sidebar-border group-hover:ring-sidebar-primary transition-all duration-200">
                    <AvatarImage src={session?.user?.image || undefined} />
                    <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm font-medium">
                      {getUserInitials(session?.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {session?.user?.name || "User"}
                    </p>
                    <p className="text-xs text-sidebar-foreground/60 truncate">
                      {session?.user?.email}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-sidebar-foreground/40 group-hover:text-sidebar-foreground transition-all duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  Toggle Theme
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between h-full px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center space-x-2">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="font-semibold text-sm">CodeCraft</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <Avatar className="h-8 w-8 ring-2 ring-border">
                  <AvatarImage src={session?.user?.image || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getUserInitials(session?.user?.name)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                Toggle Theme
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="fixed top-0 left-0 z-50 w-64 h-screen lg:hidden border-r border-sidebar-border bg-sidebar animate-in slide-in-from-left duration-300">
            <div className="flex flex-col h-full">
              {/* Mobile header */}
              <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border">
                <Link href="/" className="flex items-center space-x-2">
                  <Code2 className="h-6 w-6 text-sidebar-primary" />
                  <span className="font-semibold text-sidebar-foreground">CodeCraft</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {DASHBOARD_NAV.map((item) => {
                  const Icon = item.icon
                  const active = isActivePath(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 relative",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-sidebar-primary rounded-r-full" />
                      )}
                      <Icon className={cn("h-5 w-5", active && "text-sidebar-primary")} />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  )
}
