"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export function DisputePrintButton() {
  return (
    <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2 shrink-0">
      <Printer className="h-4 w-4" />
      Print / Save PDF
    </Button>
  )
}
