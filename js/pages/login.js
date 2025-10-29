import { hashText } from "../common/utils.js";

export function initLoginPage() {
  console.log("✅ Login sayfası yüklendi");

  if (window.LanguageService) {
    LanguageService.translatePage();
  }

  async function login() {
    const users = JSON.parse(localStorage.getItem("users")) ?? [];
    const emailInput = document.getElementById("logineposta");
    const passwordInput = document.getElementById("loginpassword");

    const email = emailInput.value.trim();
    const plainPassword = passwordInput.value.trim();

    if (!email || !plainPassword) {
      alert("E-posta ve şifre boş olamaz!");
      return;
    }

    const inputPasswordHash = await hashText(plainPassword);

    // 🧩 Kayıtlı kullanıcıyı bul
    const currentUser = users.find(
      (u) => u.email === email && u.passwordHash === inputPasswordHash
    );

    console.log("currentUser:", currentUser);

    if (currentUser) {
      // 🧩 Zaten giriş yapmış kullanıcı varsa güncelle
      localStorage.setItem("activeUser", JSON.stringify(currentUser));

      alert(`Hoş geldin, ${currentUser.firstName}! 👋`);
      window.location.href = "/";
    } else {
      alert("E-posta veya şifre hatalı!");
    }
  }

  const btnLogin = document.getElementById("btnlogin");
  btnLogin.addEventListener("click", login);
}
