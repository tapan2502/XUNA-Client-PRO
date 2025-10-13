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

       
      </section>
    </main>
  )
}
