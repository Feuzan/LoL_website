/* champions.js
   Charge la version la plus récente Data Dragon puis data/fr_FR/champion.json
   et affiche les champions dans la grille. Pas de clé API nécessaire.
*/

const loader = document.getElementById("loader");
const champGrid = document.getElementById("champGrid");
const searchInput = document.getElementById("searchChamp");
const filterRole = document.getElementById("filterRole");

// Fetch latest Data Dragon version
async function fetchLatestVersion() {
  const response = await fetch(
    "https://ddragon.leagueoflegends.com/api/versions.json"
  );
  const versions = await response.json();
  return versions[0]; // Return most recent version
}

// Create HTML for champion card
function createChampCard(champ, version) {
  const card = document.createElement("article");
  card.className = "champ-card";

  card.innerHTML = `
    <div class="thumb">
      <img src="https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${
    champ.image.full
  }" 
           alt="${champ.name}">
    </div>
    <div class="info">
      <h3>${champ.name}</h3>
      <p>${champ.title}</p>
      <p class="muted">${champ.tags.join(", ")}</p>
    </div>
  `;

  // Add click handler to show champion details
  card.addEventListener("click", async () => {
    try {
      // Fetch detailed champion data
      const response = await fetch(
        `https://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/champion/${champ.id}.json`
      );
      const data = await response.json();
      const champDetail = data.data[champ.id];

      // Create and show modal
      const modal = document.createElement("div");
      modal.className = "modal";
      modal.innerHTML = `
        <div class="modal-content card">
          <button class="close-btn">&times;</button>
          <div class="champion-detail">
            <img src="https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${
        champ.image.full
      }" 
                 alt="${champ.name}">
            <h2>${champ.name}</h2>
            <p class="title">${champ.title}</p>
            <p class="lore">${champDetail.lore}</p>
            <div class="abilities">
              <h3>Capacités</h3>
              ${champDetail.spells
                .map(
                  (spell) => `
                <div class="spell">
                  <img src="https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spell.image.full}" 
                       alt="${spell.name}">
                  <div>
                    <h4>${spell.name}</h4>
                    <p>${spell.description}</p>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </div>
      `;

      // Add close button handler
      modal.querySelector(".close-btn").addEventListener("click", () => {
        modal.remove();
      });

      // Add click outside to close
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });

      document.body.appendChild(modal);
    } catch (error) {
      console.error("Error loading champion details:", error);
    }
  });

  return card;
}

// Initialize champions page
async function initChampionsPage() {
  try {
    // 1. Get latest version
    const version = await fetchLatestVersion();

    // 2. Fetch champion data
    const response = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/champion.json`
    );
    const data = await response.json();
    const champions = Object.values(data.data);

    // 3. Setup role filter
    const roles = [...new Set(champions.flatMap((c) => c.tags))];
    filterRole.innerHTML = `
      <option value="">Tous rôles</option>
      ${roles
        .map((role) => `<option value="${role}">${role}</option>`)
        .join("")}
    `;

    // 4. Render initial grid
    champions.forEach((champ) => {
      champGrid.appendChild(createChampCard(champ, version));
    });

    // 5. Setup search/filter handlers
    searchInput.addEventListener("input", () => {
      const search = searchInput.value.toLowerCase();
      const role = filterRole.value;

      champions.forEach((champ) => {
        const card = champGrid
          .querySelector(`[alt="${champ.name}"]`)
          .closest(".champ-card");
        const matchesSearch = champ.name.toLowerCase().includes(search);
        const matchesRole = !role || champ.tags.includes(role);
        card.style.display = matchesSearch && matchesRole ? "flex" : "none";
      });
    });

    filterRole.addEventListener("change", () => {
      searchInput.dispatchEvent(new Event("input"));
    });

    // 6. Hide loader
    loader.style.display = "none";
    champGrid.style.display = "grid";
  } catch (error) {
    loader.textContent = "Erreur lors du chargement des champions";
    console.error(error);
  }
}

// Only run on champions page
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("champGrid")) {
    initChampionsPage();
  }
});
