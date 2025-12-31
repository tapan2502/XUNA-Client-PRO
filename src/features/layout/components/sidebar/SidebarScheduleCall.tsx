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
    <div className="bg-default-50/50 border border-default-200 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-sm">
      <p className="text-[13px] font-bold text-foreground">Schedule a Call</p>
      <div className="flex items-center gap-2 w-full">
        <div className="relative flex-1 flex items-center bg-white dark:bg-default-100 border border-default-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="bg-transparent border-none text-xs h-10 pl-3 pr-1 focus:outline-none appearance-none cursor-pointer font-medium"
          >
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
            <option value="+91">🇮🇳 +91</option>
          </select>
          <div className="w-[1px] h-4 bg-default-200" />
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone number"
            className="flex-1 bg-transparent border-none text-sm h-10 px-3 focus:outline-none min-w-0"
          />
        </div>
      </div>
      <button 
        onClick={handleCall}
        className="w-full bg-[#0070f3] hover:bg-[#0060df] text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
      >
        Call Me
      </button>
    </div>
  )
}
