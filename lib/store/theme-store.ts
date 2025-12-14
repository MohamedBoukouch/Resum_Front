import { create } from "zustand"

interface ThemeStore {
  isDark: boolean
  toggleTheme: () => void
  setTheme: (isDark: boolean) => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
  isDark: typeof window !== "undefined" ? document.documentElement.classList.contains("dark") : false,
  toggleTheme: () => {
    set((state) => {
      const newIsDark = !state.isDark
      if (typeof window !== "undefined") {
        if (newIsDark) {
          document.documentElement.classList.add("dark")
          localStorage.setItem("theme", "dark")
        } else {
          document.documentElement.classList.remove("dark")
          localStorage.setItem("theme", "light")
        }
      }
      return { isDark: newIsDark }
    })
  },
  setTheme: (isDark) => {
    if (typeof window !== "undefined") {
      if (isDark) {
        document.documentElement.classList.add("dark")
        localStorage.setItem("theme", "dark")
      } else {
        document.documentElement.classList.remove("dark")
        localStorage.setItem("theme", "light")
      }
    }
    set({ isDark })
  },
}))
