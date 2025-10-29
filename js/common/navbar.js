// js/common/navbar.js (Güncellenmiş Son Hali)

// Artık cookie import'una GEREK YOK
// import { deleteCookie } from "./cookies.js";

export function initNavbar() {
  const authButtons = document.getElementById("auth-buttons");
  const userInfo = document.getElementById("user-info");
  const userAvatar = document.getElementById("user-avatar");
  const userName = document.getElementById("user-name");

  // localStorage'dan aktif kullanıcıyı çekelim
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));

  // Oturum kontrol mantığınız (Dokunulmadı)
  if (activeUser) {
    // (email kontrolünü kaldırdım, activeUser varsa yeterlidir)
    authButtons.style.display = "none";
    userInfo.style.display = "flex";
    userAvatar.src = activeUser.profilePhoto || "https://i.pravatar.cc/40";
    userName.textContent = activeUser.firstName
      ? `${activeUser.firstName} ${activeUser.lastName}`
      : activeUser.username || "Kullanıcı";
  } else {
    authButtons.style.display = "flex";
    userInfo.style.display = "none";
  }

  // Dropdown menü mantığınız (Dokunulmadı)
  const trigger = document.getElementById("user-menu-trigger");
  const menu = document.getElementById("user-dropdown-menu");
  const arrow = document.querySelector(".dropdown-arrow");

  if (trigger && menu) {
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      menu.classList.toggle("show");
      if (arrow) {
        trigger.classList.toggle("open");
      }
    });

    window.addEventListener("click", (event) => {
      if (menu.classList.contains("show")) {
        if (!trigger.contains(event.target) && !menu.contains(event.target)) {
          menu.classList.remove("show");
          if (arrow) {
            trigger.classList.remove("open");
          }
        }
      }
    });

    // --- GÜNCELLENMİŞ VE BASİTLEŞTİRİLMİŞ ÇIKIŞ BUTONU ---
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
      logoutButton.addEventListener("click", (event) => {
        event.preventDefault();
        console.log("Çıkış Yap tıklandı!");

        // 1. Sizin sisteminiz için gereken TEK ADIM bu:
        localStorage.removeItem("activeUser");

        // 2. Cookie silmeye gerek YOK
        // const TOKEN_COOKIE_NAME = "authToken"; (Böyle bir şey yok)
        // deleteCookie(TOKEN_COOKIE_NAME); (Bu satıra gerek yok)

        // 3. Arayüzü hemen "ziyaretçi" moduna geçir
        authButtons.style.display = "flex";
        userInfo.style.display = "none";

        // 4. Kullanıcıyı giriş sayfasına yönlendir
        window.location.href = "/login";
      });
    }
  }
}
