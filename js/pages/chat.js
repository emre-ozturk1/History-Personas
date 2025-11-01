import personas from "../data/personas.js";

export function initChatPage(params) {
  const key = params?.key;
  const persona = personas[key];
  if (!persona) return;

  let chatId = params?.chatId;
  const isNewChat = !chatId;

  if (isNewChat) {
    chatId = `chat_${new Date().getTime()}`;

    const url = new URL(window.location);
    url.searchParams.set("chatId", chatId);

    window.history.replaceState({}, "", url);
  }

  /* document.getElementById(
    "chat-header"
  ).textContent = `${persona.name} ile sohbet ediyorsun`; */

  const API_KEY = "AIzaSyB5H-ByA8VBuKBDSHoEXTvyujv9qK6tkSw";
  const chatBox = document.getElementById("chat-box");
  const sendBtn = document.getElementById("send-btn");
  const userInput = document.getElementById("user-input");

  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  const userEmail = activeUser?.email || "guest";

  const storageKey = `chatHistory_${userEmail}_${key}_${chatId}`;

  const conversation = [
    {
      role: "system",
      parts: [
        {
          text: `
Sen, ${persona.name} adında tarihi bir kişiliksin.

Tüm cevaplarını ${persona.name} olarak vereceksin.



🕰️ Zaman ve Bilgi Sınırı:

- Hayatın ${persona.cutoff_year} yılına kadar sürdü.

- Bu tarihten sonrasını bilmiyorsun.



🎓 Uzmanlık Alanların:

${persona.expertise}



🧠 Bilgi Kesme Noktan:

${persona.knowledge_cutoff}



🗣️ Konuşma Tarzın:

${persona.speaking_style}



💬 Rol Talimatı:

Kullanıcının sorularına ${persona.name} olarak yanıt ver.

Modern çağdan veya yapay zekâdan bahsetme.

Rolünü koru, doğaldan uzaklaşma, aynı karakterde kal.

Kısa, öz ve anlaşılır cevaplar ver. Gereksiz uzun açıklamalardan kaçın.
`,
        },
      ],
    },
  ];

  const savedHistory = localStorage.getItem(storageKey);
  if (savedHistory) {
    const parsed = JSON.parse(savedHistory);
    parsed.forEach((msg) => addMessage(msg.text, msg.sender));

    conversation.push(
      ...parsed.map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }))
    );
  }

  function updateChatSummary(lastMessageText, sender) {
    const SUMMARY_KEY = "chatSummaries";

    const allSummaries = JSON.parse(localStorage.getItem(SUMMARY_KEY)) || {};

    const conversationKey = chatId;

    allSummaries[conversationKey] = {
      chatId: chatId,
      userEmail: userEmail,
      personaKey: key,
      personaName: persona.name,
      lastMessage: lastMessageText,
      lastMessageSender: sender,
      lastMessageTimestamp: new Date().toISOString(),
    };

    localStorage.setItem(SUMMARY_KEY, JSON.stringify(allSummaries));
  }

  async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    userInput.value = "";

    conversation.push({
      role: "user",
      parts: [{ text }],
    });

    saveToLocal(text, "user");
    updateChatSummary(text, "user");

    const loading = addMessage(`${persona.name} yazıyor...`, "bot");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: conversation.map((msg) => ({
              parts: msg.parts,
            })),
          }),
        }
      );

      const data = await response.json();
      chatBox.removeChild(loading);

      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ Cevap alınamadı.";

      addMessage(reply, "bot");

      conversation.push({
        role: "model",
        parts: [{ text: reply }],
      });

      saveToLocal(reply, "bot");
      updateChatSummary(reply, "bot");
    } catch (err) {
      chatBox.removeChild(loading);

      const errorMsg = "Hata: " + err.message;
      addMessage(errorMsg, "bot");

      updateChatSummary(errorMsg, "bot");
    }
  }

  function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msg;
  }

  function saveToLocal(text, sender) {
    const existing = JSON.parse(localStorage.getItem(storageKey)) || [];
    existing.push({ text, sender, time: new Date().toISOString() });
    localStorage.setItem(storageKey, JSON.stringify(existing));
  }

  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  const img = document.getElementById("persona-image");
  const name = document.getElementById("persona-name");
  const meta = document.getElementById("persona-meta");
  const chatMessageDiv = document.getElementById("chat-message");

  img.src = `${persona.image_url}`;
  console.log(persona.image_url, "image url");
  img.alt = persona.name;
  name.textContent = persona.name;
  meta.textContent = `${persona.dates}`;
  chatMessageDiv.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${persona.image_url})`;

  const newChatBtn = document.getElementById("new-chat-btn");
  const changePersonaBtn = document.getElementById("change-persona-btn");

  if (newChatBtn) {
    newChatBtn.addEventListener("click", () => {
      window.location.href = `/chat/${key}`;
    });
  }

  if (changePersonaBtn) {
    changePersonaBtn.addEventListener("click", () => {
      window.location.href = "/";
    });
  }
  const selectedLang = localStorage.getItem("dil");

  //speecht to text kısmı
  // Check if the browser supports the Web Speech API
  if (!("webkitSpeechRecognition" in window)) {
    alert(
      "Your browser doesn't support the Web Speech API. Please use Chrome or Edge."
    );
  } else {
    // Create a new instance of SpeechRecognition
    const recognition = new webkitSpeechRecognition();

    // Set properties
    recognition.continuous = false; // Capture only one result
    recognition.interimResults = false; // Get the final result, not partial results
    recognition.lang = "tr-TR" || selectedLang; // Set the language to English
    console.log(selectedLang, "selected");
    // Start button click event
    document.getElementById("mic-btn").onclick = () => {
      recognition.start(); // Start listening
    };

    // Handle the result when speech is detected
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript; // Get the speech result
      console.log(transcript, "transcript");

      document.getElementById("user-input").value += `${transcript}`;
    };

    // Handle any errors
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    // Log when the speech recognition service starts or ends
    recognition.onstart = () => {
      console.log("Speech recognition started");
    };
    recognition.onend = () => {
      console.log("Speech recognition ended");
    };
  }
}
