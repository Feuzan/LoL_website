/* champions.js
   Charge la version la plus récente Data Dragon puis data/fr_FR/champion.json
   et affiche les champions dans la grille. Permet de filtrer par nom et rôle.
*/

// Kept behaviour, simplified guards and DOM access
const loader = document.getElementById("loader");
const champGrid = document.getElementById("champGrid");
const searchInput = document.getElementById("searchChamp");
const filterRole = document.getElementById("filterRole");

async function fetchLatestVersion() {
  const res = await fetch(
    "https://ddragon.leagueoflegends.com/api/versions.json"
  );
  const versions = await res.json();
  return versions[0];
}

function createChampCard(champ, version) {
  const card = document.createElement("article");
  card.className = "champ-card";
  card.innerHTML = `
    <div class="thumb"><img src="https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${
    champ.image.full
  }" alt="${champ.name}"></div>
    <div class="info">
      <h3>${champ.name}</h3>
      <p class="muted">${champ.title}</p>
      <p class="muted">${champ.tags.join(", ")}</p>
    </div>
  `;
  card.dataset.tags = champ.tags.join(",");
  card.addEventListener("click", async () => {
    try {
      const r = await fetch(
        `https://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/champion/${champ.id}.json`
      );
      const d = await r.json();
      const champDetail = d.data[champ.id];
      const modal = document.createElement("div");
      modal.className = "modal";
      modal.innerHTML = `
        <div class="modal-content card">
          <button class="close-btn">&times;</button>
          <div class="champion-detail">
            <img src="https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${
        champ.image.full
      }" alt="${champ.name}">
            <h2>${champ.name}</h2>
            <p class="title">${champ.title}</p>
            <p class="lore">${champDetail.lore || ""}</p>
            <div class="abilities">
              <h3>Capacités</h3>
              ${(champDetail.spells || [])
                .map(
                  (sp) => `
                <div class="spell">
                  <img src="https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${sp.image.full}" alt="${sp.name}">
                  <div><h4>${sp.name}</h4><p>${sp.description}</p></div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </div>
      `;
      modal
        .querySelector(".close-btn")
        .addEventListener("click", () => modal.remove());
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.remove();
      });
      document.body.appendChild(modal);
    } catch (err) {
      console.error("Erreur détail champion", err);
    }
  });
  return card;
}

async function initChampionsPage() {
  if (!champGrid) return;
  try {
    const version = await fetchLatestVersion();
    const res = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/champion.json`
    );
    const data = await res.json();
    const champions = Object.values(data.data);
    const roles = [...new Set(champions.flatMap((c) => c.tags))].sort();
    if (filterRole) {
      filterRole.innerHTML = `<option value="">Tous rôles</option>${roles
        .map((r) => `<option value="${r}">${r}</option>`)
        .join("")}`;
    }
    champGrid.innerHTML = "";
    champions.forEach((ch) =>
      champGrid.appendChild(createChampCard(ch, version))
    );
    loader && (loader.style.display = "none");
    champGrid.style.display = "grid";

    const filterFn = () => {
      const q = (searchInput?.value || "").toLowerCase();
      const role = filterRole?.value || "";
      document.querySelectorAll(".champ-card").forEach((card) => {
        const name = card.querySelector("h3")?.textContent?.toLowerCase() || "";
        const tags = (card.dataset.tags || "").toLowerCase();
        const ok =
          name.includes(q) &&
          (!role || tags.split(",").includes(role.toLowerCase()));
        card.style.display = ok ? "flex" : "none";
      });
    };

    searchInput?.addEventListener("input", filterFn);
    filterRole?.addEventListener("change", filterFn);
  } catch (error) {
    loader && (loader.textContent = "Erreur lors du chargement");
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("champGrid")) initChampionsPage();
});
