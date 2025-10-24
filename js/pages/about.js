export function initAboutPage() {
  console.log("About sayfası yüklendi ✅");

  // Sayfa yüklendiğinde çevirileri uygula
  if (window.LanguageService) {
    LanguageService.translatePage();
  }

  // Özel davranışlar (örnek)
  const aboutEl = document.querySelector("p");
  if (aboutEl) {
    aboutEl.addEventListener("click", () => alert("Bu bir test olayıdır!"));
  }
}
