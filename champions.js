/* champions.js
   Charge la version la plus récente Data Dragon puis data/fr_FR/champion.json
   et affiche les champions dans la grille. Permet de filtrer par nom et rôle.
*/

// Comportement conservé, gardes simplifiées et accès DOM
const loader = document.getElementById("loader");
const champGrid = document.getElementById("champGrid");
const searchInput = document.getElementById("searchChamp");
// Éléments de filtre de rôle (remplace l'ancien <select>)
const roleFilterEl = () => document.getElementById("roleFilter");
const filterToggle = () => document.getElementById("filterToggle");
const filterPanel = () => document.getElementById("filterPanel");
const filterSearchEl = () => document.getElementById("filterRoleSearch");
const roleListEl = () => document.getElementById("roleList");
const clearRolesBtn = () => document.getElementById("clearRoles");
const applyRolesBtn = () => document.getElementById("applyRoles");

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
      // empêcher le défilement de l'arrière-plan pendant que la modale est ouverte
      const disableBodyScroll = () => {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
      };
      const enableBodyScroll = () => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      };

      modal.querySelector(".close-btn").addEventListener("click", () => {
        modal.remove();
        enableBodyScroll();
      });
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.remove();
          enableBodyScroll();
        }
      });
      // échap pour fermer la modale
      const escHandler = (e) => {
        if (e.key === "Escape") {
          if (document.body.contains(modal)) {
            modal.remove();
            enableBodyScroll();
            document.removeEventListener("keydown", escHandler);
          }
        }
      };
      document.addEventListener("keydown", escHandler);

      document.body.appendChild(modal);
      disableBodyScroll();
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
    // remplir la liste des rôles (panneau)
    if (roleListEl && roleListEl()) {
      const counts = {};
      champions.forEach((c) =>
        c.tags.forEach((t) => (counts[t] = (counts[t] || 0) + 1))
      );
      roleListEl().innerHTML = roles
        .map(
          (r) => `
            <label class="role-item" data-role="${r}">
              <input type="checkbox" value="${r}" aria-label="Filtrer ${r}" />
              <span>${r}</span>
              <span class="role-badge">${counts[r] || 0}</span>
            </label>
          `
        )
        .join("");
    }
    champGrid.innerHTML = "";
    champions.forEach((ch) =>
      champGrid.appendChild(createChampCard(ch, version))
    );
    loader && (loader.style.display = "none");
    champGrid.style.display = "grid";

    // fonction de filtrage utilisant les rôles sélectionnés (multi-sélection)
    const getSelectedRoles = () => {
      if (!roleListEl || !roleListEl()) return [];
      return Array.from(
        roleListEl().querySelectorAll('input[type="checkbox"]:checked')
      ).map((cb) => cb.value);
    };

    const filterFn = () => {
      const q = (searchInput?.value || "").toLowerCase();
      const selected = getSelectedRoles();
      document.querySelectorAll(".champ-card").forEach((card) => {
        const name = card.querySelector("h3")?.textContent?.toLowerCase() || "";
        const tags = (card.dataset.tags || "").toLowerCase().split(",");
        const matchesQuery = name.includes(q);
        const matchesRole =
          selected.length === 0 ||
          selected.some((r) => tags.includes(r.toLowerCase()));
        card.style.display = matchesQuery && matchesRole ? "flex" : "none";
      });
    };

    // connecter les événements : saisie de recherche (globale), cases à cocher, basculement, effacer/appliquer
    searchInput?.addEventListener("input", filterFn);

    // changements de cases à cocher (délégation d'événement)
    if (roleListEl && roleListEl()) {
      roleListEl().addEventListener("change", (e) => {
        if (e.target && e.target.matches('input[type="checkbox"]')) filterFn();
      });
    }

    // basculer l'ouverture/fermeture du panneau et empêcher le défilement de l'arrière-plan quand ouvert
    if (roleFilterEl()) {
      const rf = roleFilterEl();
      const toggleBtn = filterToggle();
      const panel = filterPanel();

      const disableBodyScroll = () => {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
      };
      const enableBodyScroll = () => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      };

      toggleBtn?.addEventListener("click", (ev) => {
        ev.stopPropagation();
        rf.classList.toggle("open");
        const open = rf.classList.contains("open");
        toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) {
          filterSearchEl() && filterSearchEl().focus();
          disableBodyScroll();
        } else {
          enableBodyScroll();
        }
      });

      // clic à l'extérieur ferme
      document.addEventListener("click", (e) => {
        if (!rf.contains(e.target) && rf.classList.contains("open")) {
          rf.classList.remove("open");
          toggleBtn.setAttribute("aria-expanded", "false");
          enableBodyScroll();
        }
      });

      // échap pour fermer
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && rf.classList.contains("open")) {
          rf.classList.remove("open");
          toggleBtn.setAttribute("aria-expanded", "false");
          enableBodyScroll();
        }
      });

      // recherche de filtre à l'intérieur du panneau
      filterSearchEl() &&
        filterSearchEl().addEventListener("input", (e) => {
          const q = (e.target.value || "").toLowerCase();
          roleListEl() &&
            Array.from(roleListEl().children).forEach((lab) => {
              const txt = lab.textContent?.toLowerCase() || "";
              lab.style.display = txt.includes(q) ? "flex" : "none";
            });
        });

      clearRolesBtn() &&
        clearRolesBtn().addEventListener("click", () => {
          roleListEl() &&
            Array.from(
              roleListEl().querySelectorAll('input[type="checkbox"]')
            ).forEach((cb) => (cb.checked = false));
          filterFn();
        });

      applyRolesBtn() &&
        applyRolesBtn().addEventListener("click", () => {
          rf.classList.remove("open");
          filterToggle() &&
            filterToggle().setAttribute("aria-expanded", "false");
          enableBodyScroll();
        });
    }
  } catch (error) {
    loader && (loader.textContent = "Erreur lors du chargement");
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("champGrid")) initChampionsPage();
});
