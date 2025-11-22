import { useState } from "react"
import { Phone } from "lucide-react"

export default function SidebarScheduleCall() {
  const [countryCode, setCountryCode] = useState("+1")
  const [phoneNumber, setPhoneNumber] = useState("")

  const handleCall = () => {
    console.log(`Calling ${countryCode} ${phoneNumber}`)
    // Implement call logic here
  }

  return (
    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--divider))] rounded-lg p-3 space-y-3">
      <p className="text-sm font-semibold text-foreground">Schedule a Call</p>
      <div className="flex items-center gap-1 w-full">
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="bg-background border border-input rounded-md text-xs h-9 px-1 focus:outline-none focus:ring-2 focus:ring-ring w-[65px] shrink-0"
        >
          <option value="+1">🇺🇸 +1</option>
          <option value="+44">🇬🇧 +44</option>
          <option value="+91">🇮🇳 +91</option>
          {/* Add more country codes as needed */}
        </select>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone number"
          className="flex-1 bg-background border border-input rounded-md text-sm h-9 px-2 focus:outline-none focus:ring-2 focus:ring-ring min-w-0"
        />
      </div>
      <button 
        onClick={handleCall}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <Phone className="w-4 h-4" />
        Call Me
      </button>
    </div>
  )
}
