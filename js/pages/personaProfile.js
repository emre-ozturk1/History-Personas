import personas from "../data/personas.js";

/**
 * Persona profil sayfasını başlatır.
 * @param {object} params
 */
export function initPersonaProfilePage(params) {
  const key = params.key;
  console.log(`Persona sayfası yüklendi: ${key}`);

  const persona = personas[key];

  if (!persona) {
    console.error(`Persona bulunamadı: ${key}`);
    window.location.href = "/";
    return;
  }

  const img = document.getElementById("persona-image");
  const name = document.getElementById("persona-name");
  const meta = document.getElementById("persona-meta");
  const knowledge = document.getElementById("persona-knowledge");
  const style = document.getElementById("persona-style");
  const sourcesContainer = document.getElementById("persona-sources");
  const startChatBtn = document.getElementById("start-chat-btn");

  img.src = `/${persona.image_url}`;

  img.alt = persona.name;
  name.textContent = persona.name;
  meta.textContent = `${persona.dates} • ${persona.title}`;
  knowledge.textContent = persona.knowledge_cutoff;
  style.textContent = persona.speaking_style;

  sourcesContainer.innerHTML = "";
  for (const sourceName in persona.sources) {
    const link = document.createElement("a");
    link.href = persona.sources[sourceName];
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = sourceName.charAt(0).toUpperCase() + sourceName.slice(1);
    sourcesContainer.appendChild(link);
  }

  startChatBtn.href = `/chat/${persona.key}`;

  if (window.LanguageService) {
    window.LanguageService.translatePage();
  }
}
