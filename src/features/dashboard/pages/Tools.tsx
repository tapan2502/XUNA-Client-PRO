import { Wrench } from "lucide-react"

export default function Tools() {
  return (
    <div className="flex flex-col gap-6 h-full p-6 max-w-7xl mx-auto w-full text-foreground">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-foreground">Tools</h1>
          <span className="px-2 py-0.5 text-xs font-medium bg-[#3b82f6]/10 text-[#3b82f6] rounded">
            Beta
          </span>
        </div>
        <p className="text-muted-foreground text-sm mt-1">Integrations & Tools</p>
      </div>

      {/* Tools Configuration Card */}
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-card border border-border rounded-xl p-12 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-xl bg-[#dbeafe] text-[#3b82f6] dark:bg-[#1e40af] dark:text-[#dbeafe] flex items-center justify-center mx-auto mb-4">
            <Wrench size={32} />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Tools Configuration</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Configure your integration settings below.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-[#3b82f6] rounded-lg hover:bg-[#3b82f6]/10 transition-colors">
              Connected to GHL
            </button>
            <button className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-accent transition-colors">
              Connect to Cal.com
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
