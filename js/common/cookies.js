"use strict";
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
var tema = getCookie("tema");
console.log(tema);
if (tema == "light") {
  console.log("açık tema seçildi cookies");
  document.body.setAttribute("data-theme", "light");
  console.log((document.getElementById(tema).checked = true));
} else if (tema == "dark") {
  document.body.setAttribute("data-theme", "dark");
  console.log("koyu tema seçildi cookies");
  console.log((document.getElementById(tema).checked = true));
} else {
  // Tema değişikliği kontrol fonksiyonu
  function applyThemePreference(e) {
    if (e.matches) {
      // Karanlık mod
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
      console.log("Kullanıcı karanlık moda geçti");

      document.body.setAttribute("data-theme", "dark");
    } else {
      // Aydınlık mod
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
      console.log("Kullanıcı aydınlık moda geçti");

      document.body.setAttribute("data-theme", "light");
    }
    // İlk kontrol
  }
  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  applyThemePreference(darkModeMediaQuery);

  // Tema değişikliği olduğunda çalışacak olay dinleyicisi
  darkModeMediaQuery.addEventListener("change", applyThemePreference);
  console.log("auto tema seçildi cookies");
  console.log((document.getElementById(tema).checked = true));
}
document.querySelector("#light").addEventListener("click", () => {
  setCookie("tema", "light", 10);
  document.body.setAttribute("data-theme", "light");
});
document.querySelector("#dark").addEventListener("click", () => {
  setCookie("tema", "dark", 10);

  document.body.setAttribute("data-theme", "dark");
});
document.querySelector("#auto").addEventListener("click", () => {
  setCookie("tema", "auto", 10);

  // Tema değişikliği kontrol fonksiyonu
  function applyThemePreference(e) {
    if (e.matches) {
      // Karanlık mod
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
      console.log("Kullanıcı karanlık moda geçti");

      document.body.setAttribute("data-theme", "dark");
    } else {
      // Aydınlık mod
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
      console.log("Kullanıcı aydınlık moda geçti");

      document.body.setAttribute("data-theme", "light");
    }
    // İlk kontrol
  }
  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  applyThemePreference(darkModeMediaQuery);

  // Tema değişikliği olduğunda çalışacak olay dinleyicisi
  darkModeMediaQuery.addEventListener("change", applyThemePreference);
});

var lang = getCookie("lang");
console.log(lang);
