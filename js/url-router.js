import { LanguageService } from "./common/language.js";
import { initThemeSettings } from "./common/cookies.js";
import { initLanguageSwitcher } from "./common/language-switcher.js";
initLanguageSwitcher();
// 1. Rota Haritası
const urlRoutes = {
  404: {
    template: "templates/404.html",
    title: "404 | Sayfa Bulunamadı",
    pageId: "error",
  },
  "/": {
    template: "templates/index.html",
    title: "Anasayfa | Echoes of History",
    pageId: "landing",
  },
  "/settings": {
    template: "templates/settings.html",
    title: "Ayarlar | Echoes of History",
    pageId: "settings",
  },
  "/profile": {
    template: "templates/profile.html",
    title: "Profil | Echoes of History",
    pageId: "profile",
  },
  "/about": {
    template: "templates/about.html",
    title: "Hakkında | Echoes of History",
    pageId: "about",
  },
  "/login": {
    template: "templates/login.html",
    title: "Giriş Yap | Echoes of History",
    pageId: "login",
  },
  "/signin": {
    template: "templates/signin.html",
    title: "Kayıt Ol | Echoes of History",
    pageId: "signin",
  },
};

// 2. Link tıklamasını yakalayan fonksiyon
const urlRoute = (event) => {
  event.preventDefault();
  const link = event.target.closest("a");
  if (link) {
    window.history.pushState({}, "", link.href);
    urlLocationHandler();
  }
};

// 🔥 3. Sayfaya özel script yükleme (dinamik import ile)
const loadPageScript = async (path) => {
  let fileName = path === "/" ? "landing" : path.replace("/", "");
  const modulePath = `./pages/${fileName}.js`; // import için relative path

  try {
    const module = await import(modulePath);
    const initFunc = module[`init${capitalize(fileName)}Page`];

    if (typeof initFunc === "function") {
      initFunc();
      console.log(`${modulePath} başarıyla yüklendi ✅`);
    } else {
      console.warn(`${modulePath} yüklendi ama init fonksiyonu bulunamadı ⚠️`);
    }
  } catch (err) {
    console.warn(`${modulePath} bulunamadı veya hata oluştu ❌`, err);
  }
};

// Yardımcı: dosya adını büyük harfle başlatır
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 4. İçerik yükleyici
const urlLocationHandler = async () => {
  const location = window.location.pathname;
  const route = urlRoutes[location] || urlRoutes["404"];

  // HTML yükle
  const html = await fetch(route.template).then((res) => res.text());
  const contentEl = document.getElementById("content");
  contentEl.innerHTML = html;

  // Sayfa kimliği ata
  contentEl.dataset.page = route.pageId || "default";

  // Başlık ve açıklama güncelle
  document.title = route.title;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", route.description || "");

  // 🌍 Sayfa yüklendikten sonra aktif dili uygula
  await LanguageService.loadTranslations();
  LanguageService.translatePage();

  // 🎨 Tema ayarlarını uygula
  initThemeSettings();

  // Sayfaya özel script yükle
  loadPageScript(location);

  if (!urlRoutes[location]) {
    window.history.pushState({}, "", "/not-found");
  }
};

// 5. Header linklerini dinle
document.addEventListener("click", (e) => {
  const target = e.target.closest("header a");
  if (target) {
    urlRoute(e);
  }
});

// 6. Geri / ileri butonlarını dinle
window.onpopstate = urlLocationHandler;

// 7. İlk yüklemede çalıştır
window.addEventListener("DOMContentLoaded", async () => {
  await LanguageService.init(); // mevcut dili yükle
  initThemeSettings(); // temayı uygula
  urlLocationHandler(); // ilk sayfayı yükle
});
