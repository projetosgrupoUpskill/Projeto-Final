import { createContext, useState, useEffect } from 'react'

export const PreferencesContext = createContext()

export function PreferencesProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('currency') || 'EUR'
  })

  useEffect(() => {
    localStorage.setItem('currency', currency)
  }, [currency])

  return (
    <PreferencesContext.Provider value={{ currency, setCurrency }}>
      {children}
    </PreferencesContext.Provider>
  )
}