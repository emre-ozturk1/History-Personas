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
    (persona) => (
      console.log(persona),
      (personaCard.innerHTML += `
    <div class="figures">
        <a href="">
          <img
            src="${persona.image_url}"
            id="${persona.name}"
            alt="${persona.name}"
          />
          <h4 key="indexPage.figures.${persona.key}.name">${persona.name}</h4>
          <label for="${persona.name}" key="indexPage.figures.${persona.key}.description"
            >${persona.title}</label
          ></a>
        </div>

    `)
    )
  );
}
console.log(document.getElementsByClassName("figures"));

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

    const results = allPersonasArray.filter((persona) => {
      const nameMatch = persona.name.toUpperCase().includes(searchVal);
      const titleMatch = persona.title.toUpperCase().includes(searchVal);
      return nameMatch || titleMatch;
    });

    setPersonaCard(results);
  });
});
