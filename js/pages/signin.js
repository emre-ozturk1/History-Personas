// js/pages/signin.js (veya ilgili dosya)

// 1. Hash fonksiyonumuzu import ediyoruz
import { hashText } from "../common/utils.js"; // <-- Yolu kontrol edin

export function initSigninPage() {
  console.log("Signin sayfası yüklendi ✅");
  if (window.LanguageService) {
    LanguageService.translatePage();
  }

  // 2. Fonksiyonu 'async' olarak güncelliyoruz
  async function saveUser() {
    const userNameInput = document.getElementById("signineposta");
    const password1Input = document.getElementById("signinpassword");
    console.log("fonksiyon çalışıyor saveuser");

    const userName = userNameInput.value.trim();
    const plainPassword = password1Input.value.trim();

    if (!userName) {
      alert("Kullanıcı adı boş olamaz!");
      userNameInput.focus();
      return;
    }
    if (!plainPassword || plainPassword.length < 6) {
      alert("Şifre boş olamaz ve en az 6 karakter olmalı!");
      password1Input.focus();
      return;
    }

    let userList = JSON.parse(localStorage.getItem("users")) ?? [];
    let sameUserName = userList.find((x) => x.userName === userName);

    if (sameUserName) {
      alert(
        "Bu kullanıcı adı daha önce kullanılmış. Lütfen başka bir kullanıcı adı giriniz."
      );
      return;
    }

    const hashedPassword = await hashText(plainPassword);

    let user = {
      userName: userName,

      passwordHash: hashedPassword,
      remember: true,
    };
    userList.unshift(user);
    localStorage.setItem("users", JSON.stringify(userList));

    alert("Kayıt başarılı! Giriş yapabilirsiniz.");
    window.location.href = "/login";
  }

  var btnsignin = document.getElementById("btnsignin");

  btnsignin.addEventListener("click", () => {
    saveUser();
  });
}
