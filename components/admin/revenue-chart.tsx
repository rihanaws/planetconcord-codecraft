"use client"

import { Package } from "lucide-react"

interface ProductSalesStat {
  productId: string
  productName: string
  totalRevenue: number
  salesCount: number
}

interface RevenueChartProps {
  productStats: ProductSalesStat[]
}

export function RevenueChart({ productStats }: RevenueChartProps) {
  if (productStats.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-12 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-transparent opacity-50" />
        <div className="relative space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">No Sales Data Yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Product sales breakdown will appear here once purchases are completed.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const maxRevenue = Math.max(...productStats.map((s) => s.totalRevenue), 1)

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-chart-1/10 to-transparent opacity-50" />

      <div className="relative p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Product Sales Breakdown</h3>
            <p className="text-sm text-muted-foreground">Revenue by product</p>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="space-y-4">
          {productStats.map((stat, index) => {
            const chartColors = [
              "bg-chart-1",
              "bg-chart-2",
              "bg-chart-3",
              "bg-chart-4",
              "bg-chart-5",
            ]
            const barColor = chartColors[index % chartColors.length]
            const widthPercent = (stat.totalRevenue / maxRevenue) * 100

            return (
              <div key={stat.productId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate mr-4">{stat.productName}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground">{stat.salesCount} sales</span>
                    <span className="text-sm font-semibold font-mono">${stat.totalRevenue.toFixed(2)}</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all duration-700`}
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
