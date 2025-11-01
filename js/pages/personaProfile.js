import personas from "../data/personas.js";

/**
 * Persona profil sayfasını başlatır.
 * (Key/Fallback yöntemiyle güncellendi)
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

  // --- DOM Öğelerini Bul ---
  const img = document.getElementById("persona-image");
  const name = document.getElementById("persona-name");
  const meta = document.getElementById("persona-meta");
  const knowledge = document.getElementById("persona-knowledge");
  const style = document.getElementById("persona-style");
  const sourcesContainer = document.getElementById("persona-sources");
  const startChatBtn = document.getElementById("start-chat-btn");

  img.src = `${persona.image_url}`;

  // --- Varsayılan (Fallback) İçeriği Doldur ve 'key' Ekle ---

  // 1. Resim 'alt' metni
  img.alt = persona.name; // Varsayılan metin
  img.setAttribute("key-alt", `indexPage.figures.${persona.key}.name`); // Çeviri anahtarı

  // 2. Persona Adı
  name.textContent = persona.name; // Varsayılan metin
  name.setAttribute("key", `indexPage.figures.${persona.key}.name`); // Çeviri anahtarı

  // 3. Meta (Tarih • Unvan)
  meta.textContent = `${persona.dates} • ${persona.title}`; // Varsayılan metin
  meta.setAttribute("key", `personaPage.${persona.key}.meta`); // Özel birleşik anahtar

  // 4. Bilgi Sınırı (Knowledge Cutoff)
  knowledge.textContent = persona.knowledge_cutoff; // Varsayılan metin
  knowledge.setAttribute("key", `personaPage.${persona.key}.knowledge`); // Çeviri anahtarı

  // 5. Konuşma Tarzı (Speaking Style)
  style.textContent = persona.speaking_style; // Varsayılan metin
  style.setAttribute("key", `personaPage.${persona.key}.style`); // Çeviri anahtarı

  // 6. Kaynaklar (Dinamik olarak)
  sourcesContainer.innerHTML = "";
  for (const sourceName in persona.sources) {
    // sourceName = "wikipedia", "britannica" vs.
    const link = document.createElement("a");
    link.href = persona.sources[sourceName];
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    // "wikipedia" -> "personaPage.sources.wikipedia"
    const sourceKey = `personaPage.sources.${sourceName.toLowerCase()}`;
    // "wikipedia" -> "Wikipedia" (Varsayılan metin)
    const fallbackText =
      sourceName.charAt(0).toUpperCase() + sourceName.slice(1);

    link.textContent = fallbackText; // Varsayılan metin
    link.setAttribute("key", sourceKey); // Çeviri anahtarı

    sourcesContainer.appendChild(link);
  }
  // --- Bitiş: İçerik Doldurma ---

  startChatBtn.href = `/chat/${persona.key}`;

  // Dil servisi, sayfadaki statik (örn: "Bilgi Sınırı" başlığı)
  // ve dinamik olarak eklenen (örn: persona.name) tüm 'key'leri çevirir.
  if (window.LanguageService) {
    window.LanguageService.translatePage();
  }
}
