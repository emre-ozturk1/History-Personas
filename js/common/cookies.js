"use strict";

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  document.cookie = `${cname}=${cvalue};expires=${d.toUTCString()};path=/`;
}

function getCookie(cname) {
  const name = cname + "=";
  const decoded = decodeURIComponent(document.cookie || "");
  for (let c of decoded.split(";")) {
    c = c.trim();
    if (c.startsWith(name)) return c.substring(name.length);
  }
  return "";
}

export function applyTheme(theme) {
  const body = document.body;
  if (!theme || theme === "auto") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    body.setAttribute("data-theme", prefersDark ? "dark" : "light");
    // değişiklikleri dinle
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.onchange = (e) =>
      body.setAttribute("data-theme", e.matches ? "dark" : "light");
  } else {
    body.setAttribute("data-theme", theme);
  }
}

// Tema ayarlarını her sayfada uygula
export function initThemeSettings() {
  const temaCookie = getCookie("tema") || "auto";
  applyTheme(temaCookie);

  const themeInputs = document.querySelectorAll(
    '.segmented-control input[name="theme"]'
  );
  themeInputs.forEach((input) => {
    if (input.value === temaCookie) input.checked = true;
    input.addEventListener("click", () => {
      setCookie("tema", input.value, 365);
      applyTheme(input.value);
      // 🔄 Diğer sekmeler / sayfalar da algılasın
      localStorage.setItem("themeChange", Date.now().toString());
    });
  });
}

// Diğer sayfalar da tema değişikliğini algılasın
window.addEventListener("storage", (event) => {
  if (event.key === "themeChange") {
    const tema = getCookie("tema") || "auto";
    applyTheme(tema);
  }
});
