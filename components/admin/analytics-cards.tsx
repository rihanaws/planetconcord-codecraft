"use client"

import { DollarSign, Users, Package, TrendingUp } from "lucide-react"

interface AnalyticsCardsProps {
  totalRevenueAllTime: number
  totalRevenueThisMonth: number
  activeCustomers: number
  totalProducts: number
}

export function AnalyticsCards({
  totalRevenueAllTime,
  totalRevenueThisMonth,
  activeCustomers,
  totalProducts,
}: AnalyticsCardsProps) {
  const stats = [
    {
      label: "Total Revenue",
      value: `$${totalRevenueAllTime.toFixed(2)}`,
      subLabel: `$${totalRevenueThisMonth.toFixed(2)} this month`,
      icon: DollarSign,
      gradient: "from-chart-1/20 to-transparent",
      iconColor: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      label: "This Month",
      value: `$${totalRevenueThisMonth.toFixed(2)}`,
      subLabel: "monthly revenue",
      icon: TrendingUp,
      gradient: "from-chart-2/20 to-transparent",
      iconColor: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "Active Customers",
      value: activeCustomers.toString(),
      subLabel: "with active access",
      icon: Users,
      gradient: "from-chart-3/20 to-transparent",
      iconColor: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      label: "Products",
      value: totalProducts.toString(),
      subLabel: "in your catalog",
      icon: Package,
      gradient: "from-chart-4/20 to-transparent",
      iconColor: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="relative group overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50`} />

            <div className="relative flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-3xl font-semibold tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stat.subLabel}
                </p>
              </div>

              <div className={`${stat.bgColor} p-3 rounded-xl transition-transform duration-300 group-hover:scale-110`}>
                <Icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </div>
        )
      })}
    </div>
  )
}
