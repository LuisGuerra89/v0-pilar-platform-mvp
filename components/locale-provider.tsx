"use client"

import * as React from "react"
import type { Locale } from "@/lib/i18n"

type LocaleProviderProps = {
  children: React.ReactNode
  defaultLocale?: Locale
}

type LocaleProviderState = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const initialState: LocaleProviderState = {
  locale: "en",
  setLocale: () => null,
}

const LocaleProviderContext = React.createContext<LocaleProviderState>(initialState)

export function LocaleProvider({ children, defaultLocale = "en" }: LocaleProviderProps) {
  const [locale, setLocale] = React.useState<Locale>(
    () =>
      (typeof window !== "undefined" ? (localStorage.getItem("pilar-locale") as Locale) : defaultLocale) ||
      defaultLocale,
  )

  const value = {
    locale,
    setLocale: (locale: Locale) => {
      localStorage.setItem("pilar-locale", locale)
      setLocale(locale)
    },
  }

  return <LocaleProviderContext.Provider value={value}>{children}</LocaleProviderContext.Provider>
}

export const useLocale = () => {
  const context = React.useContext(LocaleProviderContext)

  if (context === undefined) throw new Error("useLocale must be used within a LocaleProvider")

  return context
}
