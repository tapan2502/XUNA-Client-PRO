import { useAppSelector } from "@/app/hooks"
import { selectEffectiveUser, selectEffectiveUserData } from "@/store/authSlice"

export default function Profile() {
  const user = useAppSelector(selectEffectiveUser)
  const userData = useAppSelector(selectEffectiveUserData as any)

  return (
    <main className="p-6">
      <section className="max-w-3xl">
        <h1 className="text-2xl font-semibold text-foreground text-balance">Profile</h1>
        <p className="text-foreground-600 mt-1">This is a placeholder profile page.</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-divider bg-card p-4">
            <div className="text-sm text-foreground-600">Name</div>
            <div className="mt-1 text-foreground">{user?.displayName || userData?.name || "—"}</div>
          </div>
          <div className="rounded-lg border border-divider bg-card p-4">
            <div className="text-sm text-foreground-600">Email</div>
            <div className="mt-1 text-foreground">{user?.email || userData?.email || "—"}</div>
          </div>
          <div className="rounded-lg border border-divider bg-card p-4">
            <div className="text-sm text-foreground-600">Role</div>
            <div className="mt-1 text-foreground">{userData?.role || "user"}</div>
          </div>
          <div className="rounded-lg border border-divider bg-card p-4">
            <div className="text-sm text-foreground-600">Plan</div>
            <div className="mt-1 text-foreground">{userData?.entitlements?.name || "Free Plan"}</div>
          </div>
        </div>
      </section>
    </main>
  )
}
