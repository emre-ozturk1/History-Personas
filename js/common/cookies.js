"use strict";

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
 
 @param {string} name
 */
export function deleteCookie(name) {
  console.log(`Cookie siliniyor: ${name}`);
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

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
      localStorage.setItem("themeChange", Date.now().toString());
    });
  });

  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.checked = temaCookie === "dark";

    themeToggle.addEventListener("change", () => {
      const newTheme = themeToggle.checked ? "dark" : "light";
      setCookie("tema", newTheme, 365);
      applyTheme(newTheme);
      localStorage.setItem("themeChange", Date.now().toString());
    });
  }

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
