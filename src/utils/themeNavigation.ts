/**
 * Utility functions for handling theme-aware navigation
 */

/**
 * Navigate to a URL with a specific theme
 * Sets the theme in sessionStorage before navigation
 */
export function navigateWithTheme(url: string, theme: "light" | "dark") {
  if (typeof window === "undefined") return;

  // Set theme in sessionStorage
  sessionStorage.setItem("theme", theme);

  // Navigate to the URL
  window.location.href = url;
}

/**
 * Get click handler for theme-aware navigation
 * Returns a function that can be used as onClick handler
 */
export function getThemeNavigationHandler(
  url: string,
  theme: "light" | "dark",
) {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithTheme(url, theme);
  };
}
