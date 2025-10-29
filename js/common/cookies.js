"use strict";

// --- Cookie Fonksiyonları ---

export function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  document.cookie = `${cname}=${cvalue};expires=${d.toUTCString()};path=/`;
}

export function getCookie(cname) {
  const name = cname + "=";
  const decoded = decodeURIComponent(document.cookie || "");
  for (let c of decoded.split(";")) {
    c = c.trim();
    if (c.startsWith(name)) return c.substring(name.length);
  }
  return "";
}

/**
 * YENİ EKLENEN FONKSİYON: Belirtilen isimdeki cookie'yi siler.
 * @param {string} name - Silinecek cookie'nin adı.
 */
export function deleteCookie(name) {
  console.log(`Cookie siliniyor: ${name}`);
  // Cookie'yi silmek için son kullanma tarihini geçmiş bir tarihe ayarlarız
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// --- Tema Fonksiyonları (DOKUNULMADI) ---

// Tema uygula
export function applyTheme(theme) {
  const body = document.body;
  if (!theme || theme === "auto") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    body.setAttribute("data-theme", prefersDark ? "dark" : "light");

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.onchange = (e) =>
      body.setAttribute("data-theme", e.matches ? "dark" : "light");
  } else {
    body.setAttribute("data-theme", theme);
  }
}

// Tema ayarlarını uygula (navbar + settings)
export function initThemeSettings() {
  // 🍪 Mevcut temayı oku
  const temaCookie = getCookie("tema") || "auto";
  applyTheme(temaCookie);

  // 🔘 Settings sayfasındaki tema radio butonlarını bağla
  const themeInputs = document.querySelectorAll(
    '.segmented-control input[name="theme"]'
  );
  themeInputs.forEach((input) => {
    if (input.value === temaCookie) input.checked = true;
    input.addEventListener("click", () => {
      setCookie("tema", input.value, 365);
      applyTheme(input.value);
      localStorage.setItem("themeChange", Date.now().toString());
    });
  });

  // 🌙 Navbar’daki toggle butonunu bağla
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    // Eğer dark ise, toggle'ı açık yap
    themeToggle.checked = temaCookie === "dark";

    themeToggle.addEventListener("change", () => {
      const newTheme = themeToggle.checked ? "dark" : "light";
      setCookie("tema", newTheme, 365);
      applyTheme(newTheme);
      localStorage.setItem("themeChange", Date.now().toString());
    });
  }

  // 🌀 Diğer sekme / sayfalar temayı güncellediğinde algıla
  window.addEventListener("storage", (event) => {
    if (event.key === "themeChange") {
      const tema = getCookie("tema") || "auto";
      applyTheme(tema);
      if (themeToggle) {
        themeToggle.checked = tema === "dark";
      }
      themeInputs.forEach((input) => {
        input.checked = input.value === tema;
      });
    }
  });
}
