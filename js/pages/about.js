export function initAboutPage() {
  console.log("About sayfası yüklendi ");

  if (window.LanguageService) {
    LanguageService.translatePage();
  }

  const aboutEl = document.querySelector("p");
  if (aboutEl) {
    aboutEl.addEventListener("click", () => alert("Bu bir test olayıdır!"));
  }
}
