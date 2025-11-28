// Theme initialization script - runs before React hydration
(() => {
  var theme;
  try {
    theme = sessionStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    }
  } catch (_e) {
    // Silently fail if sessionStorage is not available
  }
})();
