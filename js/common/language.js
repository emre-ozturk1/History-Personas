// js/services/language.js
export const LanguageService = {
  translations: {},

  getCurrentLanguage() {
    try {
      return JSON.parse(localStorage.getItem("dil")) || "tr";
    } catch {
      return "tr";
    }
  },

  async loadTranslations() {
    if (Object.keys(this.translations).length > 0) return;
    try {
      const res = await fetch("/translations.json");
      if (!res.ok) throw new Error("Çeviri dosyası yüklenemedi: " + res.status);
      this.translations = await res.json();
    } catch (err) {
      console.error("Çeviri yükleme hatası:", err);
      this.translations = {};
    }
  },

  translatePage() {
    const lang = this.getCurrentLanguage();
    document.querySelectorAll("[key], [key-placeholder]").forEach((el) => {
      const key = el.getAttribute("key");
      const placeholderKey = el.getAttribute("key-placeholder");

      if (key && this.translations?.[lang]?.[key]) {
        if (el.tagName === "TITLE") {
          document.title = this.translations[lang][key];
        } else {
          el.textContent = this.translations[lang][key];
        }
      }
      if (placeholderKey && this.translations?.[lang]?.[placeholderKey]) {
        el.placeholder = this.translations[lang][placeholderKey];
      }
    });
  },

  async init() {
    await this.loadTranslations();
    this.translatePage();
  },
};

// 🌍 Diğer sayfalar da dil değişikliğini otomatik algılasın:
window.addEventListener("storage", (event) => {
  if (event.key === "dil") {
    LanguageService.translatePage();
  }
});
