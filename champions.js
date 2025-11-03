/* champions.js
   Charge la version la plus récente Data Dragon puis data/fr_FR/champion.json
   et affiche les champions dans la grille. Pas de clé API nécessaire.
*/

const loader = document.getElementById('loader');
const champGrid = document.getElementById('champGrid');
const searchInput = document.getElementById('searchChamp');
const filterRole = document.getElementById('filterRole');

async function fetchLatestVersion(){
  const resp = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
  if(!resp.ok) throw new Error('Impossible de récupérer la version Data Dragon');
  const versions = await resp.json();
  return versions[0];
}

function createChampCard(champ, version){
  const wrapper = document.createElement('article');
  wrapper.className = 'champ-card card';

  const thumb = document.createElement('div');
  thumb.className = 'thumb';
  const img = document.createElement('img');

  // image path
  const imgUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ.image.full}`;
  img.src = imgUrl;
  img.alt = champ.name;

  thumb.appendChild(img);

  const info = document.createElement('div');
  const title = document.createElement('h3');
  title.textContent = champ.name;
  const subtitle = document.createElement('p');
  subtitle.className = 'muted';
  subtitle.textContent = champ.title || '';
  const tags = document.createElement('p');
  tags.className = 'muted';
  tags.textContent = 'Rôle(s): ' + (champ.tags || []).join(', ');

  info.appendChild(title);
  info.appendChild(subtitle);
  info.appendChild(tags);

  const meta = document.createElement('div');
  meta.className = 'meta';
  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Fiche';
  btn.addEventListener('click', ()=> openChampionDetail(champ, version));
  meta.appendChild(btn);

  wrapper.appendChild(thumb);
  wrapper.appendChild(info);
  wrapper.appendChild(meta);

  return wrapper;
}

function openChampionDetail(champ, version){
  // simple modal-like full page replacement (keeps it static & simple)
  const main = document.querySelector('main.container');
  main.innerHTML = `
    <section class="card">
      <button id="backBtn" class="btn">← Retour</button>
      <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:12px">
        <div style="flex:0 0 320px">
          <img src="https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ.image.full}" alt="${champ.name}" style="width:100%;height:400px;object-fit:cover;border-radius:10px">
        </div>
        <div style="flex:1;min-width:260px">
          <h2>${champ.name} — ${champ.title || ''}</h2>
          <p class="muted">Rôle(s) : ${(champ.tags || []).join(', ')}</p>
          <p style="margin-top:12px">${champ.blurb || ''}</p>
          <p style="margin-top:12px"><a class="btn primary" href="https://www.leagueoflegends.com/fr-fr/champions/${champ.id.toLowerCase()}/" target="_blank" rel="noopener">Fiche officielle</a></p>
        </div>
      </div>
    </section>
  `;

  document.getElementById('backBtn').addEventListener('click', ()=> location.reload());
}

async function initChampionsPage(){
  try {
    if(loader) loader.style.display = 'block';
    const version = await fetchLatestVersion();
    const resp = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/champion.json`);
    if(!resp.ok) throw new Error('Impossible de récupérer les données champions');
    const data = await resp.json();
    const champions = Object.values(data.data).sort((a,b)=> a.name.localeCompare(b.name,'fr'));

    // populate roles filter
    const roles = new Set();
    champions.forEach(c=> (c.tags || []).forEach(t=> roles.add(t)));
    roles.forEach(r=>{
      const opt = document.createElement('option');
      opt.value = r;
      opt.textContent = r;
      filterRole.appendChild(opt);
    });

    // initial render
    champGrid.innerHTML = '';
    champions.forEach(c=> champGrid.appendChild(createChampCard(c, version)));

    // search
    if(searchInput){
      searchInput.addEventListener('input', (e)=>{
        const q = e.target.value.trim().toLowerCase();
        const filtered = champions.filter(c => c.name.toLowerCase().includes(q) || (c.title||'').toLowerCase().includes(q) || (c.blurb||'').toLowerCase().includes(q));
        renderList(filtered, version);
      });
    }

    if(filterRole){
      filterRole.addEventListener('change', (e)=>{
        const val = e.target.value;
        const filtered = champions.filter(c=> !val || (c.tags||[]).includes(val));
        renderList(filtered, version);
      });
    }

    function renderList(list, v){
      champGrid.innerHTML = '';
      list.forEach(c=> champGrid.appendChild(createChampCard(c, v)));
    }

  } catch(err){
    console.error(err);
    if(loader) loader.textContent = "Impossible de charger les champions — vérifie ta connexion.";
  } finally {
    setTimeout(()=> { if(loader) loader.style.display = 'none'; }, 300);
  }
}

document.addEventListener('DOMContentLoaded', ()=> {
  // only run if we're on champions.html (elements present)
  if(document.getElementById('champGrid')) initChampionsPage();
});
