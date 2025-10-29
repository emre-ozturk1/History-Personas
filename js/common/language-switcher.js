import { LanguageService } from "./language.js";

export function initLanguageSwitcher() {
  const switcher = document.getElementById("language-switcher");
  if (!switcher) return;

  const langButtons = switcher.querySelectorAll(".lang-btn");
  const currentLang = LanguageService.getCurrentLanguage();

  function updateActive(lang) {
    langButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
  }

  updateActive(currentLang);

  langButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const selected = btn.dataset.lang;
      localStorage.setItem("dil", JSON.stringify(selected));
      LanguageService.translatePage();
      updateActive(selected);
      localStorage.setItem("languageChange", Date.now().toString());
    });
  });

  // 💡 Diğer sekmeler / sayfalar da dinlesin
  window.addEventListener("storage", (event) => {
    if (event.key === "languageChange") {
      const lang = LanguageService.getCurrentLanguage();
      updateActive(lang);
      LanguageService.translatePage();
    }
  });
}
