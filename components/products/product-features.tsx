import { Check } from "lucide-react"

interface ProductFeaturesProps {
  features: string[]
}

export function ProductFeatures({ features }: ProductFeaturesProps) {
  if (!features || features.length === 0) {
    return null
  }

  return (
    <section className="relative py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="p-8 md:p-10 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-xl shadow-primary/5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8">
            <span className="bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              Key Features
            </span>
          </h2>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3 group">
                <div className="flex-shrink-0 mt-1">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-lg blur-sm group-hover:blur-md transition-all duration-200" />
                    <div className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-primary/10 border border-primary/20">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>
                <span className="text-base text-foreground/90 leading-relaxed">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
