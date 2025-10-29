export function initProfilePage() {
  console.log("Profile page loaded ");

  const activeUser = JSON.parse(localStorage.getItem("activeUser"));

  if (!activeUser) {
    alert("Bu sayfayı görmek için önce giriş yapmalısınız!");
    window.location.href = "/login";
    return;
  }

  const nameInput = document.getElementById("profileName");
  const surnameInput = document.getElementById("profileSurname");
  const emailInput = document.getElementById("profileEmail");
  const profileImg = document.getElementById("profileImage");
  const photoInput = document.getElementById("photoInput");
  const changePhotoBtn = document.getElementById("changePhotoBtn");
  const editBtn = document.getElementById("editProfileBtn");
  const saveBtn = document.getElementById("saveProfileBtn");
  const cancelBtn = document.getElementById("cancelProfileBtn");

  let stagedProfilePhoto = activeUser.profilePhoto;

  function populateForm() {
    nameInput.value = activeUser.firstName || "";
    surnameInput.value = activeUser.lastName || "";
    emailInput.value = activeUser.email || "";
    stagedProfilePhoto = activeUser.profilePhoto || "https://i.pravatar.cc/150";
    profileImg.src = stagedProfilePhoto;
  }

  populateForm();

  changePhotoBtn.addEventListener("click", () => {
    photoInput.click();
  });

  photoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        profileImg.src = result;
        stagedProfilePhoto = result;
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
    cancelBtn.style.display = "inline-block";
    changePhotoBtn.disabled = false;
  });

  cancelBtn.addEventListener("click", () => {
    populateForm();

    nameInput.disabled = true;
    surnameInput.disabled = true;

    editBtn.style.display = "inline-block";
    saveBtn.style.display = "none";
    cancelBtn.style.display = "none";
    changePhotoBtn.disabled = true;
  });

  saveBtn.addEventListener("click", () => {
    const updatedUser = {
      ...activeUser,
      firstName: nameInput.value.trim(),
      lastName: surnameInput.value.trim(),
      profilePhoto: stagedProfilePhoto,
    };

    localStorage.setItem("activeUser", JSON.stringify(updatedUser));

    let allUsers = JSON.parse(localStorage.getItem("users")) || [];

    const userIndex = allUsers.findIndex((u) => u.email === updatedUser.email);

    if (userIndex !== -1) {
      allUsers[userIndex] = updatedUser;
      localStorage.setItem("users", JSON.stringify(allUsers));
    }

    alert("Profil başarıyla güncellendi!");

    nameInput.disabled = true;
    surnameInput.disabled = true;
    editBtn.style.display = "inline-block";
    saveBtn.style.display = "none";
    cancelBtn.style.display = "none";
    changePhotoBtn.disabled = true;

    const navAvatar = document.getElementById("user-avatar");
    const navName = document.getElementById("user-name");
    if (navAvatar) navAvatar.src = updatedUser.profilePhoto;
    if (navName)
      navName.textContent = `${updatedUser.firstName} ${updatedUser.lastName}`;
  });
}
