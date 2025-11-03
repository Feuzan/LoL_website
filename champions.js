/* champions.js
   Charge la version la plus récente Data Dragon puis data/fr_FR/champion.json
   et affiche les champions dans la grille. Pas de clé API nécessaire.
*/

const loader = document.getElementById('loader');
const champGrid = document.getElementById('champGrid');
const searchInput = document.getElementById('searchChamp');
const filterRole = document.getElementById('filterRole');

// Fetch latest Data Dragon version
async function fetchLatestVersion() {
  // Get list of versions and return most recent
}

// Create HTML for champion card
function createChampCard(champ, version) {
  // Build card structure with champion data
  // Returns DOM element
}

// Handle champion detail view
function openChampionDetail(champ, version) {
  // Create and display champion details page
}

// Initialize champions page
async function initChampionsPage() {
  // 1. Fetch latest version
  // 2. Get champion data
  // 3. Setup filters and search
  // 4. Render champion grid
}

// Only run on champions page
document.addEventListener('DOMContentLoaded', () => {
  if(document.getElementById('champGrid')) {
    initChampionsPage();
  }
});
