import { useThemeContext } from "../context/ThemeContext";

// SwitchViewButton renders a button that toggles between themes
export default function SwitchViewButton({ className = "" }) {
  // Get the toggle function from theme context
  const { toggle } = useThemeContext();

  return (
    <button
      onClick={toggle}                // Call toggle to switch theme
      className={`switch-btn ${className}`}  // Apply default and additional classes
      aria-label="Toggle theme"      // Accessibility label for screen readers
    >
      Switch&nbsp;View              {/* Display text for the button */}
    </button>
  );
}