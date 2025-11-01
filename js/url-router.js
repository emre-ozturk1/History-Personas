import { LanguageService } from "./common/language.js";
import { initThemeSettings } from "./common/cookies.js";
import { initLanguageSwitcher } from "./common/language-switcher.js";
initLanguageSwitcher();

const urlRoutes = {
  404: {
    template: "/templates/404.html",
    title: "404 | Sayfa Bulunamadı",
    pageId: "error",
  },
  "/": {
    template: "/templates/index.html",
    title: "Anasayfa | Echoes of History",
    pageId: "landing",
  },
  "/settings": {
    template: "/templates/settings.html",
    title: "Ayarlar | Echoes of History",
    pageId: "settings",
  },
  "/profile": {
    template: "/templates/profile.html",
    title: "Profil | Echoes of History",
    pageId: "profile",
  },
  "/about": {
    template: "/templates/about.html",
    title: "Hakkında | Echoes of History",
    pageId: "about",
  },
  "/login": {
    template: "/templates/login.html",
    title: "Giriş Yap | Echoes of History",
    pageId: "login",
  },
  "/signin": {
    template: "/templates/signin.html",
    title: "Kayıt Ol | Echoes of History",
    pageId: "signin",
  },
  "/history": {
    template: "/templates/history.html",
    title: "Geçmiş | Echoes of History",
    pageId: "history",
  },
};

const urlRoute = (event) => {
  event.preventDefault();
  const link = event.target.closest("a");
  if (link) {
    window.history.pushState({}, "", link.href);
    urlLocationHandler();
  }
};

const loadPageScript = async (pageId, params = null) => {
  if (!pageId) return;

  console.log(
    `Script yükleniyor: ${pageId}, Parametreler: ${JSON.stringify(params)}`
  );

  const modulePath = `/js/pages/${pageId}.js`;

  try {
    const module = await import(modulePath);
    const initFunc = module[`init${capitalize(pageId)}Page`];
    console.log(capitalize(pageId), "pageıd");

    if (typeof initFunc === "function") {
      initFunc(params);
      console.log(`${modulePath} başarıyla yüklendi `);
    } else {
      console.warn(
        `${modulePath} yüklendi ama init${capitalize(
          pageId
        )}Page fonksiyonu bulunamadı `
      );
    }
  } catch (err) {
    console.warn(`${modulePath} bulunamadı veya hata oluştu `, err);
  }
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const urlLocationHandler = async () => {
  const location = window.location.pathname;

  const searchParams = new URLSearchParams(window.location.search);

  const personaRegex = /^\/persona\/(?<key>[a-zA-Z0-9-]+)$/;
  const personaMatch = location.match(personaRegex);

  const chatRegex = /^\/chat\/(?<key>[a-zA-Z0-9-]+)$/;
  const chatMatch = location.match(chatRegex);

  let route;

  let params = {};
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }

  if (personaMatch) {
    route = {
      template: "/templates/persona-profile.html",
      title: "Persona Profili | Echoes of History",
      pageId: "personaProfile",
    };

    params = { ...params, ...personaMatch.groups };
  } else if (chatMatch) {
    route = {
      template: "/templates/chat.html",
      title: "Sohbet | Echoes of History",
      pageId: "chat",
    };

    params = { ...params, ...chatMatch.groups };
  } else {
    route = urlRoutes[location] || urlRoutes["404"];
  }

  const html = await fetch(route.template)
    .then((res) => {
      if (!res.ok) {
        console.error(`Fetch hatası! Dosya bulunamadı: ${route.template}`);
        return fetch(urlRoutes[404].template).then((r) => r.text());
      }
      return res.text();
    })
    .catch((err) => {
      console.error("Fetch sırasında kritik hata:", err);
      return "<h1 style='color:red'>Sayfa yüklenemedi.</h1>";
    });

  const contentEl = document.getElementById("content");
  contentEl.innerHTML = html;

  contentEl.dataset.page = route.pageId || "default";

  document.title = route.title;

  await LanguageService.loadTranslations();
  LanguageService.translatePage();

  initThemeSettings();

  await new Promise((resolve) => setTimeout(resolve, 0));
  await loadPageScript(route.pageId, params);

  if (!urlRoutes[location] && !personaMatch && !chatMatch) {
    window.history.pushState({}, "", "/not-found");
  }
};

document.addEventListener("click", (e) => {
  const target = e.target.closest("a");

  if (target && new URL(target.href).origin === window.location.origin) {
    if (target.target === "_blank" || target.hasAttribute("download")) {
      return;
    }

    urlRoute(e);
  }
});

window.onpopstate = urlLocationHandler;

window.addEventListener("DOMContentLoaded", async () => {
  await LanguageService.init();
  initThemeSettings();
  urlLocationHandler();
});
