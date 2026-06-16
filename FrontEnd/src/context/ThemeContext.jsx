import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
 
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    const resolved = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    if (resolved === "dark") document.body.classList.add("dark");
    return resolved;
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);

    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}