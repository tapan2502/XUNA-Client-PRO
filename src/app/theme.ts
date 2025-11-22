export function applyPrimaryColor(hex: string) {
  document.documentElement.style.setProperty("--primary", hex);
}
export function applyTheme(mode: "light" | "dark" | "system") {
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldBeDark = mode === "dark" || (mode === "system" && systemDark);
  root.classList.toggle("dark", shouldBeDark);
}
