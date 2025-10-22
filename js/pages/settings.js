document.addEventListener("DOMContentLoaded", () => {
  const languageSwitcher = document.getElementById("language-switcher");

  // Eğer sayfada dil değiştirme butonu yoksa, bu kodun çalışmasını engelle.
  if (!languageSwitcher) {
    return;
  }

  const langButtons = languageSwitcher.querySelectorAll(".lang-btn");

  // Butonların 'active' durumunu güncelleyen fonksiyon.
  function updateActiveButton(lang) {
    langButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.lang === lang);
    });
  }

  // Her bir dil butonuna tıklama olayı ekle.
  langButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault(); // Sayfanın yenilenmesini engelle.
      const selectedLang = this.dataset.lang;

      // Yeni dili localStorage'a kaydet.
      localStorage.setItem("dil", JSON.stringify(selectedLang));

      // Butonların görünümünü güncelle.
      updateActiveButton(selectedLang);

      // Genel dil servisinden sayfayı yeniden çevirmesini iste.
      // LanguageService objesi, önce eklediğimiz language.js dosyasından geliyor.
      LanguageService.translatePage();
    });
  });

  // Sayfa ilk yüklendiğinde mevcut dile göre doğru butonu 'active' yap.
  const currentLang = LanguageService.getCurrentLanguage();
  updateActiveButton(currentLang);
});
