import { createContext, useContext } from "react";
import useTheme from "../hooks/useTheme";

// Create a Context for theme data
const ThemeContext = createContext(null);

// Custom hook to access theme context values
export const useThemeContext = () => useContext(ThemeContext);

// ThemeProvider wraps the app and provides theme state
export default function ThemeProvider({ children }) {
  // useTheme returns { toggle, theme } to switch and read current theme
  const value = useTheme();

  // Provide theme values to child components
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}