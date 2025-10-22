// Tüm dil fonksiyonlarını bir obje içinde toplayarak kod tekrarını ve karmaşayı önlüyoruz.
const LanguageService = {
  translations: {}, // Yüklenen çevirileri burada saklayacağız.

  // Mevcut dili localStorage'dan getiren yardımcı fonksiyon.
  getCurrentLanguage: function () {
    return JSON.parse(localStorage.getItem("dil")) || "tr";
  },

  // translations.json dosyasını yükleyen ve saklayan ana fonksiyon.
  loadTranslations: async function () {
    // Eğer çeviriler zaten yüklendiyse tekrar yükleme yapma.
    if (Object.keys(this.translations).length > 0) return;

    try {
      // Projenizin ana dizinindeki translations.json dosyasını hedefliyoruz.
      const response = await fetch("/translations.json");
      if (!response.ok) {
        throw new Error("Çeviri dosyası yüklenirken bir sorun oluştu.");
      }
      this.translations = await response.json();
    } catch (error) {
      console.error("Çeviri yükleme hatası:", error);
    }
  },

  // Sayfadaki [key] attribute'una sahip tüm elementleri çeviren fonksiyon.
  translatePage: function () {
    const lang = this.getCurrentLanguage();

    // TÜM çevrilecek elementleri seçiyoruz
    document.querySelectorAll("[key], [key-placeholder]").forEach((element) => {
      const key = element.getAttribute("key");
      const placeholderKey = element.getAttribute("key-placeholder");

      // Metin içeriğini çevir (Mevcut kod)
      if (key && this.translations[lang] && this.translations[lang][key]) {
        // Eğer element title ise document.title'ı güncelle
        if (element.tagName === "TITLE") {
          document.title = this.translations[lang][key];
        } else {
          element.textContent = this.translations[lang][key];
        }
      }

      // Placeholder'ı çevir (YENİ EKLENEN KOD)
      if (
        placeholderKey &&
        this.translations[lang] &&
        this.translations[lang][placeholderKey]
      ) {
        element.placeholder = this.translations[lang][placeholderKey];
      }
    });
  },

  // Servisi başlatan ana fonksiyon.
  init: async function () {
    await this.loadTranslations(); // Önce çevirileri yükle.
    this.translatePage(); // Sonra sayfayı çevir.
  },
};

// Sayfa yüklendiğinde dil servisini otomatik olarak başlat.
document.addEventListener("DOMContentLoaded", () => {
  LanguageService.init();
});
