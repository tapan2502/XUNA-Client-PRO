import type React from "react"
import {
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { selectEffectiveUser, logout } from "@/store/authSlice"
import { useNavigate } from "react-router-dom"

export default function NavbarUserMenu() {
  const user = useAppSelector(selectEffectiveUser)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleAction = async (key: React.Key) => {
    if (key === "profile") {
      navigate("/dashboard/profile")
    } else if (key === "settings") {
      navigate("/dashboard/settings")
    } else if (key === "logout") {
      try {
        await dispatch(logout()).unwrap()
      } finally {
        navigate("/login")
      }
    }
  }

  const displayName = user?.displayName || user?.email || "User"
  const photoURL = user?.photoURL ?? ""
  const hasValidPhoto = /^https?:\/\//i.test(photoURL) || photoURL.startsWith("data:")

  // 👇 Add a default dummy female avatar here
  const dummyFemaleAvatar =
    "https://randomuser.me/api/portraits/women/44.jpg"

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          as="button"
          size="sm"
          src={hasValidPhoto ? photoURL : dummyFemaleAvatar}
          showFallback
          fallback={
            <div className="flex items-center justify-center w-full h-full text-xs font-medium bg-muted text-foreground/80">
              {initials || "U"}
            </div>
          }
          className="cursor-pointer size-8"
          name={displayName}
          aria-label="Open user menu"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User menu" onAction={handleAction}>
        <DropdownItem key="profile">Profile</DropdownItem>
        <DropdownItem key="settings">Settings</DropdownItem>
        <DropdownItem key="logout" color="danger">
          Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
