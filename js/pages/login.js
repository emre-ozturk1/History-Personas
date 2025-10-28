import { hashText } from "../common/utils.js";

export function initLoginPage() {
  console.log("Login sayfası yüklendi ✅");

  if (window.LanguageService) {
    LanguageService.translatePage();
  }

  async function login() {
    let userList = JSON.parse(localStorage.getItem("users")) ?? [];
    const userNameInput = document.getElementById("logineposta");
    const passwordInput = document.getElementById("loginpassword");

    const userName = userNameInput.value.trim();
    const plainPassword = passwordInput.value.trim();

    if (!userName || !plainPassword) {
      alert("Kullanıcı adı ve şifre boş olamaz!");
      return;
    }

    const inputPasswordHash = await hashText(plainPassword);

    const currentUser = userList.find(
      (x) => x.userName === userName && x.passwordHash === inputPasswordHash
    );

    console.log("currentUser", currentUser);

    if (currentUser) {
      let activeUsers = JSON.parse(localStorage.getItem("activeUser")) || [];
      activeUsers = activeUsers.filter(
        (u) => u.userName !== currentUser.userName
      );
      activeUsers.push(currentUser);
      localStorage.setItem("activeUser", JSON.stringify(activeUsers));

      window.location.href = "/";
    } else {
      alert("Kullanıcı adı veya şifre hatalı!");
    }
  }

  var btnlogin = document.getElementById("btnlogin");

  btnlogin.addEventListener("click", () => {
    login();
  });
}
