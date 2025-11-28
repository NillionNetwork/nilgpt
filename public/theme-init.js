// Theme initialization script - runs before React hydration
(function () {
  try {
    var theme = sessionStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    }
  } catch (e) {
    // Silently fail if sessionStorage is not available
  }
})();
