import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const themeGuardado = localStorage.getItem("helpdesk-theme");

    if (themeGuardado) {
      return themeGuardado;
    }

    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("helpdesk-theme", theme);
  }, [theme]);

  const cambiarTema = () => {
    setTheme((actual) => (actual === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, cambiarTema }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme debe usarse dentro de ThemeProvider");
  }

  return context;
}