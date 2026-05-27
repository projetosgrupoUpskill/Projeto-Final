import { createContext, useState, useEffect } from 'react'

export const PreferencesContext = createContext()

export function PreferencesProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('currency') || 'EUR'
  })

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || ''
  })

  useEffect(() => {
    localStorage.setItem('currency', currency)
  }, [currency])

  useEffect(() => {
    localStorage.setItem('userName', userName)
  }, [userName])

  return (
    <PreferencesContext.Provider value={{ currency, setCurrency, userName, setUserName}}>
      {children}
    </PreferencesContext.Provider>
  )
}