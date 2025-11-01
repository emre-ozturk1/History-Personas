import personas from "../data/personas.js";

export function initHistoryPage() {
  console.log("History sayfası yüklendi ✅");

  if (window.LanguageService) {
    LanguageService.translatePage();
  }

  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  const currentUserEmail = activeUser?.email || "guest";
  const allSummaries = JSON.parse(localStorage.getItem("chatSummaries")) || {};

  const userConversations = Object.values(allSummaries).filter(
    (summary) => summary.userEmail === currentUserEmail
  );
  console.log(userConversations, "userConversations");

  userConversations.sort(
    (a, b) =>
      new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp)
  );

  const historyPage = document.getElementById("history-page");

  let historyHtmlContent = "";

  userConversations.forEach((summary) => {
    const personaData = personas[summary.personaKey];
    const imageUrl = personaData ? personaData.image_url : "default-image.png";

    const formattedDate = new Date(summary.lastMessageTimestamp).toLocaleString(
      "tr-TR",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    historyHtmlContent += `
    <div class="histories" id="histories">
      
      <a href="/chat/${summary.personaKey}?chatId=${summary.chatId}">
    
      <div class="persona-avatar-container-history">
        <img id="persona-image-history" src="${imageUrl}" alt="${summary.personaName}" />
      </div>
      <div class="history-text">
        <div class="history-top">
          <div>
            <h4 id="persona-name-history">${summary.personaName}</h4>
            <p id="last-chat-date">${formattedDate}</p>
          </div>
        </div>
        <div class="history-message">
          <p id="last-chat-text">${summary.lastMessage}</p>
        </div>
      </div></a>
    </div>`;
  });
  if (Object.keys(allSummaries).length === 0) {
    console.log("geçmiş boş aga ");
    historyPage.innerHTML += `<div class="empty_state">
  <ion-icon id="icon" name="ion-sad-outline"></ion-icon>
  <h3 class="emptyTitle" key="historyPage.emptyState.title">Gemiş Boş</h3>
  <p id="emptyP" key="historyPage.emptyState.message">Listelenecek hiç sohbet geçmişi yok</p>`;
  } else {
    historyPage.innerHTML += historyHtmlContent;
  }
}
