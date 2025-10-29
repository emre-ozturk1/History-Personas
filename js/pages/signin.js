// js/pages/signin.js
import { hashText } from "../common/utils.js";

export function initSigninPage() {
  console.log("✅ Signin sayfası yüklendi");

  if (window.LanguageService) {
    LanguageService.translatePage();
  }

  async function saveUser() {
    const firstNameInput = document.getElementById("firstname");
    const lastNameInput = document.getElementById("lastname");
    const emailInput = document.getElementById("signineposta");
    const passwordInput = document.getElementById("signinpassword");
    const profilePhotoInput = document.getElementById("profilePhoto");

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const photoFile = profilePhotoInput.files[0];

    // 🧩 Ad Soyad Kontrolü
    if (!firstName) {
      alert("Lütfen adınızı girin!");
      firstNameInput.focus();
      return;
    }
    if (!lastName) {
      alert("Lütfen soyadınızı girin!");
      lastNameInput.focus();
      return;
    }

    // 🧩 E-posta Kontrolü
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Lütfen geçerli bir e-posta adresi girin!");
      emailInput.focus();
      return;
    }

    // 🧩 Şifre Kontrolü
    if (!password || password.length < 6) {
      alert("Şifre en az 6 karakter olmalı!");
      passwordInput.focus();
      return;
    }

    // 🧩 Kullanıcı adı (e-posta) benzersiz mi?
    const users = JSON.parse(localStorage.getItem("users")) ?? [];
    if (users.some((u) => u.email === email)) {
      alert("Bu e-posta adresiyle zaten bir hesap mevcut!");
      return;
    }

    // 🧩 Profil fotoğrafını base64'e çevir
    let profilePhoto = "";
    if (photoFile) {
      profilePhoto = await toBase64(photoFile);
    }

    const passwordHash = await hashText(password);

    const newUser = {
      firstName,
      lastName,
      email,
      passwordHash,
      profilePhoto,
      remember: true,
      createdAt: new Date().toISOString(),
    };

    users.unshift(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("🎉 Kayıt başarılı! Artık giriş yapabilirsiniz.");
    window.location.href = "/login";
  }

  // 🧩 File to Base64 Helper
  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const btn = document.getElementById("btnsignin");
  btn.addEventListener("click", saveUser);
}
