import { useState, useEffect } from 'react';

// Define available theme names for basic pages and dashboard pages
const BASIC_THEMES = ['day', 'night'];
const DASH_THEMES  = ['dashd', 'dashn'];

// useTheme hook manages theme index and applies CSS classes
export default function useTheme() {
  // Check current route to decide which theme set to use
  const isDashboard = window.location.pathname.startsWith('/dashboard');
  const THEMES = isDashboard ? DASH_THEMES : BASIC_THEMES;

  // Initialize theme index from localStorage or default to 0
  const [idx, setIdx] = useState(() => {
    const saved = parseInt(localStorage.getItem('bb-theme-index'), 10);
    if (isNaN(saved)) return 0;
    return saved % THEMES.length;
  });

  // Apply theme class to body and save index whenever it changes
  useEffect(() => {
    // Remove all theme classes first
    [...BASIC_THEMES, ...DASH_THEMES].forEach(t => {
      document.body.classList.remove(`theme-${t}`);
    });
    // Add the current theme class to body
    document.body.classList.add(`theme-${THEMES[idx]}`);
    // Save the selected index so it persists on reload
    localStorage.setItem('bb-theme-index', idx);
  }, [idx, THEMES]);

  // Function to cycle through available themes
  const toggle = () => {
    setIdx(i => (i + 1) % THEMES.length);
  };

  // Return toggle function and current theme name
  return { toggle, theme: THEMES[idx] };
}
