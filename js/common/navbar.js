export function initNavbar() {
  const authButtons = document.getElementById("auth-buttons");
  const userInfo = document.getElementById("user-info");
  const userAvatar = document.getElementById("user-avatar");
  const userName = document.getElementById("user-name");

  const activeUser = JSON.parse(localStorage.getItem("activeUser"));

  if (activeUser) {
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

    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
      logoutButton.addEventListener("click", (event) => {
        event.preventDefault();
        console.log("Çıkış Yap tıklandı!");

        localStorage.removeItem("activeUser");

        authButtons.style.display = "flex";
        userInfo.style.display = "none";

        window.location.href = "/login";
      });
    }
  }
}
