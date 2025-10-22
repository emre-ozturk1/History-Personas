import personas from "../data/personas.js";
import personasData from "../data/personas.js";
/* console.log(personasData); */
const allPersonasArray = Object.values(personasData);
const einsteinData = personasData[""];
const personaCard = document.getElementById("figures_section");
const searchInput = document.getElementById("srch");

function getRandomPersonas(count) {
  const allPersonasArray = Object.values(personasData);
  /* console.log(allPersonasArray); */
  allPersonasArray.sort(() => 0.5 - Math.random());
  return allPersonasArray.slice(0, count);
}
const random5Personas = getRandomPersonas(5);
/* console.log(random5Personas); */

allPersonasArray.forEach((persona) => console.log(`- ${persona.name}`));
/* console.log(personaCard);
 */
function setPersonaCard(personaList) {
  personaList.forEach(
    (persona) =>
      (personaCard.innerHTML += `
    <div class="figures">
          <img
            src="${persona.image_url}"
            id="${persona.name}"
            alt="${persona.name}"
          />
          <h4 key="indexPage.figures.${persona.name}.name">${persona.name}</h4>
          <label for="${persona.name}" key="indexPage.figures.${persona.name}.description"
            >${persona.title}</label
          >
        </div>

    `)
  );
}
setPersonaCard(random5Personas);
var result = [];

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("srch");

  searchInput.addEventListener("input", () => {
    const searchVal = searchInput.value.trim().toUpperCase();
    const searchField = "name";
    const searchField2 = "title";

    personaCard.innerHTML = "";

    if (!searchVal) {
      setPersonaCard(random5Personas);
      return;
    }

    const results = allPersonasArray.filter((persona) =>
      persona[searchField].toUpperCase().includes(searchVal)
    );

    setPersonaCard(results);
  });
});
