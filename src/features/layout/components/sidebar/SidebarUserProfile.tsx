import { 
  ChevronDown, 
  Sparkles, 
  Zap, 
  Settings, 
  HelpCircle, 
  LogOut,
  User
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { auth } from "@/lib/firebase"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { logout, selectCurrentUserData, fetchUserDetails } from "@/store/authSlice"
import { useNavigate } from "react-router-dom"

export default function SidebarUserProfile({ isCollapsed }: { isCollapsed?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  
  const userData = useAppSelector(selectCurrentUserData)

  useEffect(() => {
    if (auth.currentUser && !userData) {
      dispatch(fetchUserDetails());
    }
  }, [dispatch, userData]);

  const displayName = userData?.name || "User"
  const displayEmail = userData?.email || ""
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const menuItems = [
    { icon: Sparkles, label: "Upgrade plan", onClick: () => console.log("Upgrade clicked") },
    { icon: Zap, label: "Personalization", onClick: () => console.log("Personalization clicked") },
    { icon: Settings, label: "Settings", onClick: () => navigate("/settings") },
  ]

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
    } finally {
      navigate("/login")
    }
  }

  const bottomItems = [
    { icon: LogOut, label: "Log out", onClick: handleLogout },
  ]

  return (
    <div className="relative" ref={menuRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full left-0 w-[260px] mb-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-lg">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{displayName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{displayEmail}</p>
                </div>
              </div>
            </div>

            {/* Main Menu */}
            <div className="p-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick()
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors group"
                >
                  <item.icon className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 dark:bg-white/5 mx-2" />

            {/* Bottom Menu */}
            <div className="p-2">
              {bottomItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick()
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                    item.label === "Log out" 
                      ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-300" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.label === "Help" && (
                    <ChevronDown className="w-4 h-4 ml-auto -rotate-90 opacity-50" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-[hsl(var(--sidebar-hover))] transition-colors ${isCollapsed ? "justify-center" : ""}`}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shrink-0 shadow-sm">
          <span className="text-white text-xs font-bold">{initials}</span>
        </div>
        {!isCollapsed && (
          <>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{userData?.role === 'super-admin' ? 'Admin Workspace' : 'User Workspace'}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </>
        )}
      </button>
    </div>
  )
}
