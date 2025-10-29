// js/pages/profile.js (GÜNCELLENMİŞ VE DÜZELTİLMİŞ)

export function initProfilePage() {
  console.log("Profile page loaded ✅");

  // 1. activeUser'ı bir OBJE olarak al
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));

  // 2. Doğru kontrol: Eğer activeUser yoksa (null ise)
  if (!activeUser) {
    alert("Bu sayfayı görmek için önce giriş yapmalısınız!");
    window.location.href = "/login";
    return;
  }

  // HTML elementlerini seç
  const nameInput = document.getElementById("profileName");
  const surnameInput = document.getElementById("profileSurname");
  const emailInput = document.getElementById("profileEmail");
  const profileImg = document.getElementById("profileImage");
  const photoInput = document.getElementById("photoInput");
  const changePhotoBtn = document.getElementById("changePhotoBtn");
  const editBtn = document.getElementById("editProfileBtn");
  const saveBtn = document.getElementById("saveProfileBtn");
  const cancelBtn = document.getElementById("cancelProfileBtn"); // Yeni eklendi

  let stagedProfilePhoto = activeUser.profilePhoto; // Fotoğrafı geçici sakla

  // 3. Formu doldur (Navbar ve Login ile uyumlu alan adları)
  function populateForm() {
    nameInput.value = activeUser.firstName || "";
    surnameInput.value = activeUser.lastName || "";
    emailInput.value = activeUser.email || ""; // E-posta (değişmemeli)
    stagedProfilePhoto = activeUser.profilePhoto || "https://i.pravatar.cc/150";
    profileImg.src = stagedProfilePhoto;
  }

  populateForm(); // Sayfa yüklenince formu doldur

  // --- Olay Dinleyicileri ---

  // Fotoğraf Değiştir Butonu
  changePhotoBtn.addEventListener("click", () => {
    photoInput.click();
  });

  // Fotoğraf seçildiğinde
  photoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        profileImg.src = result; // Ekranda göster
        stagedProfilePhoto = result; // Kaydetmek için sakla
      };
      reader.readAsDataURL(file);
    }
  });

  // Düzenle Butonu
  editBtn.addEventListener("click", () => {
    nameInput.disabled = false;
    surnameInput.disabled = false;

    // UI Değişimi
    editBtn.style.display = "none";
    saveBtn.style.display = "inline-block";
    cancelBtn.style.display = "inline-block"; // İptal butonunu göster
    changePhotoBtn.disabled = false; // Fotoğraf değişimine izin ver
  });

  // İptal Butonu (Yeni)
  cancelBtn.addEventListener("click", () => {
    populateForm(); // Formu orijinal haline döndür

    nameInput.disabled = true;
    surnameInput.disabled = true;

    // UI Değişimi
    editBtn.style.display = "inline-block";
    saveBtn.style.display = "none";
    cancelBtn.style.display = "none";
    changePhotoBtn.disabled = true;
  });

  // Kaydet Butonu
  saveBtn.addEventListener("click", () => {
    // 1. Güncellenmiş verileri al
    const updatedUser = {
      ...activeUser, // Eski verileri koru
      firstName: nameInput.value.trim(),
      lastName: surnameInput.value.trim(),
      profilePhoto: stagedProfilePhoto, // Güncellenmiş fotoğraf
      // E-posta (email) ve parola (passwordHash) gibi şeyler değiştirilmez
    };

    // 2. 'activeUser'ı (OBJE olarak) güncelle
    localStorage.setItem("activeUser", JSON.stringify(updatedUser));

    // 3. 'users' dizisindeki bu kullanıcıyı güncelle
    let allUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Kullanıcıyı bulmak için 'email' (benzersiz anahtar) kullan
    const userIndex = allUsers.findIndex((u) => u.email === updatedUser.email);

    if (userIndex !== -1) {
      allUsers[userIndex] = updatedUser; // Dizideki kullanıcıyı güncelle
      localStorage.setItem("users", JSON.stringify(allUsers));
    }

    alert("Profil başarıyla güncellendi!");

    // 4. Formu tekrar "kilitli" moda al
    nameInput.disabled = true;
    surnameInput.disabled = true;
    editBtn.style.display = "inline-block";
    saveBtn.style.display = "none";
    cancelBtn.style.display = "none";
    changePhotoBtn.disabled = true;

    // 5. Navbar'ı anında güncelle (Sayfa yenilemeden)
    // Bu, navbar.js'deki kodu tetikler (veya direkt DOM'u manipüle eder)
    // Basit yol: Navbar'daki elementleri direkt güncelle
    const navAvatar = document.getElementById("user-avatar");
    const navName = document.getElementById("user-name");
    if (navAvatar) navAvatar.src = updatedUser.profilePhoto;
    if (navName)
      navName.textContent = `${updatedUser.firstName} ${updatedUser.lastName}`;
  });
}
