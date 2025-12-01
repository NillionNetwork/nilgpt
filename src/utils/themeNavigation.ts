/**
 * Utility functions for handling theme-aware navigation
 */

export function navigateWithTheme(url: string, theme: "light" | "dark") {
  if (typeof window === "undefined") return;

  // Set theme in sessionStorage
  sessionStorage.setItem("theme", theme);

  // Navigate to the URL
  window.location.href = url;
}

export function getThemeNavigationHandler(
  url: string,
  theme: "light" | "dark",
) {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithTheme(url, theme);
  };
}
