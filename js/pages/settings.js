import { LanguageService } from "../common/language.js";
import { initThemeSettings } from "../common/cookies.js";

export async function initSettingsPage() {
  console.log("Settings sayfası başlatılıyor...");

  await LanguageService.init();
  initThemeSettings();

  const languageSwitcher = document.getElementById("language-switcher");
  if (!languageSwitcher) return;

  const langButtons = languageSwitcher.querySelectorAll(".lang-btn");
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
}
