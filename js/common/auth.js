// js/common/auth.js

// NOT: Bu dosyanın çalışması için tema ve dil servislerinizin
// global alanda (window) erişilebilir olması gerekir.
// Örn: window.LanguageService ve window.ThemeService

/**
 * Aktif kullanıcıyı localStorage'dan alır.
 * Sizin login.js kodunuz 'activeUser'ı bir DİZİ olarak saklıyor.
 * Biz bu dizideki son kullanıcıyı aktif kullanıcı olarak varsayıyoruz.
 */
function getActiveUser() {
  const activeUserStr = localStorage.getItem("activeUser");
  if (!activeUserStr) {
    return null;
  }

  try {
    const activeUsers = JSON.parse(activeUserStr);
    // Dizinin son elemanını aktif kullanıcı olarak al
    if (Array.isArray(activeUsers) && activeUsers.length > 0) {
      return activeUsers[activeUsers.length - 1];
    }
    return null;
  } catch (e) {
    console.error("Aktif kullanıcı verisi okunamadı:", e);
    return null;
  }
}

/**
 * Kullanıcı adından baş harfleri oluşturur.
 * ÖNEMLİ: Şu anki kayıt sisteminiz SADECE 'userName' (e-posta) alıyor.
 * Baş harf için "Ad Soyad" almanız gerekir.
 * Biz şimdilik e-postanın ilk iki harfini alacağız.
 */
function generateInitials(userName) {
  // İDEAL DURUM: Eğer 'user' nesnesinde 'fullName: "Emre Yılmaz"' olsaydı:
  // const parts = user.fullName.split(' ');
  // return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();

  // MEVCUT DURUM (Fallback): 'userName' (e-posta) kullanılıyor
  return userName.substring(0, 2).toUpperCase();
}

/**
 * Profil avatarını (Resim veya Baş Harf) ayarlar.
 */
function setupProfileAvatar(user) {
  const imgEl = document.getElementById("profile-avatar-img");
  const initialsEl = document.getElementById("profile-avatar-initials");

  // ÖNEMLİ: Kayıt olurken 'profileImageUrl' adında bir alan da almalısınız.
  if (user.profileImageUrl) {
    imgEl.src = user.profileImageUrl;
    imgEl.classList.remove("hidden");
    initialsEl.classList.add("hidden");
  } else {
    // Profil resmi yoksa baş harfleri göster
    initialsEl.textContent = generateInitials(user.userName);
    initialsEl.classList.remove("hidden");
    imgEl.classList.add("hidden");
  }
}

/**
 * Dropdown menüsünün (Tema, Dil, Çıkış) tıklama olaylarını ayarlar.
 */
function setupDropdownControls() {
  const toggleBtn = document.getElementById("profile-menu-toggle");
  const dropdownMenu = document.getElementById("profile-dropdown-menu");

  // Menüyü aç/kapat
  toggleBtn.addEventListener("click", () => {
    dropdownMenu.classList.toggle("hidden");
  });

  // Dışarı tıklamayı dinle (Menüyü kapatmak için)
  document.addEventListener("click", (event) => {
    if (
      !toggleBtn.contains(event.target) &&
      !dropdownMenu.contains(event.target)
    ) {
      dropdownMenu.classList.add("hidden");
    }
  });

  // Çıkış Yap
  document.getElementById("nav-logout-btn").addEventListener("click", (e) => {
    e.preventDefault();
    // Aktif kullanıcıyı ve oyun durumunu temizle
    localStorage.removeItem("activeUser");
    localStorage.removeItem("currentGame");

    // UI'ı anında güncelle ve giriş sayfasına yönlendir
    document.body.classList.remove("is-authenticated");
    document.body.classList.add("is-guest");
    window.location.href = "/login";
  });

  // --- Tema ve Dil Ayarları ---
  // Bu fonksiyonların `language.js` ve `settings.js` (veya `theme.js`)
  // tarafından global'e (window) eklendiğini varsayıyoruz.

  // Dil
  if (window.LanguageService) {
    document.getElementById("nav-lang-tr").addEventListener("click", () => {
      window.LanguageService.setLanguage("tr");
      dropdownMenu.classList.add("hidden");
    });
    document.getElementById("nav-lang-en").addEventListener("click", () => {
      window.LanguageService.setLanguage("en");
      dropdownMenu.classList.add("hidden");
    });
  } else {
    console.warn("LanguageService bulunamadı.");
  }

  // Tema
  // TAVSİYE: Tema mantığını `settings.js` sayfasından çıkarıp
  // `js/common/theme.js` gibi global bir dosyaya taşıyın.
  if (window.ThemeService) {
    document.getElementById("nav-theme-light").addEventListener("click", () => {
      window.ThemeService.setTheme("light");
      dropdownMenu.classList.add("hidden");
    });
    document.getElementById("nav-theme-dark").addEventListener("click", () => {
      window.ThemeService.setTheme("dark");
      dropdownMenu.classList.add("hidden");
    });
  } else {
    console.warn(
      "ThemeService bulunamadı. Lütfen tema mantığını globale taşıyın."
    );
  }
}

/**
 * Ana UI (Arayüz) kimlik doğrulama fonksiyonu.
 * Sayfa yüklendiğinde çalışır ve kullanıcının giriş yapıp yapmadığını kontrol eder.
 */
export function initAuthUI() {
  const user = getActiveUser();

  if (user) {
    // Kullanıcı GİRİŞ YAPMIŞ
    document.body.classList.add("is-authenticated");
    document.body.classList.remove("is-guest");
    setupProfileAvatar(user);
    setupDropdownControls();
  } else {
    // Kullanıcı GİRİŞ YAPMAMIŞ (Misafir)
    document.body.classList.add("is-guest");
    document.body.classList.remove("is-authenticated");
  }
}
