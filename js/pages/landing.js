import personasData from "../data/personas.js";
import { LanguageService } from "../common/language.js";

export function initLandingPage() {
  console.log("Landing sayfası başlatıldı ");

  const allPersonasArray = Object.values(personasData);
  const personaCard = document.getElementById("figures_section");
  const searchInput = document.getElementById("srch");

  if (!personaCard || !searchInput) {
    console.warn("Landing sayfası öğeleri yüklenemedi ");
    return;
  }

  // Rastgele 5 persona getir
  function getRandomPersonas(count) {
    const shuffled = [...allPersonasArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  const random5Personas = getRandomPersonas(5);

  // Persona kartlarını ekrana bas
  function setPersonaCard(personaList) {
    personaCard.innerHTML = "";
    personaList.forEach((persona) => {
      personaCard.innerHTML += `
        <div class="figures">
          <a href="/persona/${persona.key}">
            <img
              src="${persona.image_url}" 
              alt="${persona.name}"
            />
            <h4 key="indexPage.figures.${persona.key}.name">${persona.name}</h4>
            <p key="indexPage.figures.${persona.key}.description">
              ${persona.title}
            </p>
          </a>
        </div>`;
    });
  }

  function setupSearch() {
    searchInput.addEventListener("input", () => {
      const searchVal = searchInput.value.trim().toUpperCase();
      if (!searchVal) {
        setPersonaCard(random5Personas);
        LanguageService.translatePage();
        return;
      }

      const results = allPersonasArray.filter((persona) => {
        return (
          persona.name.toUpperCase().includes(searchVal) ||
          persona.title.toUpperCase().includes(searchVal)
        );
      });

      setPersonaCard(results);
      LanguageService.translatePage();
    });
  }

  setPersonaCard(random5Personas);
  setupSearch();

  console.log("Landing sayfası hazır ");
}
