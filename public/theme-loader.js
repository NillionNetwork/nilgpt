(() => {
  try {
    const savedTheme = localStorage.getItem("nilgpt-theme") || "light";
    document.documentElement.classList.remove(
      "theme-light",
      "theme-dark-blue",
      "theme-dark-sepia",
    );
    document.documentElement.classList.add(`theme-${savedTheme}`);
  } catch (_e) {
    // Fallback to light theme if localStorage fails
    document.documentElement.classList.add("theme-light");
  }
})();
