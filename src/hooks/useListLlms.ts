import { useAppSelector } from "@/app/hooks"

export function useListLlms() {
  const user = useAppSelector((state) => state.auth.user)

  async function listLlms(xiApiKey: string) {
    if (!user) throw new Error("User is not available yet")

    const res = await fetch("https://api.elevenlabs.io/v1/convai/llm-usage/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": xiApiKey,
        "X-Impersonate-User": user.uid,
      },
      body: JSON.stringify({
        prompt_length: 1,
        number_of_pages: 1,
        rag_enabled: false,
      }),
    })

    if (!res.ok) throw new Error(await res.text())
    const data = await res.json()
    return data.llm_prices.map((p: any) => p.llm)
  }

  return { listLlms }
}
