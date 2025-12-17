// Basculement du menu mobile
document.querySelectorAll('[id^="menuToggle"]').forEach((btn) => {
  btn.addEventListener("click", () => {
    const hdr = btn.closest(".site-header");
    if (!hdr) return;
    const nav = hdr.querySelector(".main-nav");
    if (!nav) return;

    // Basculer le menu
    const isOpen = nav.classList.toggle("open");

    // Basculer l'icône hamburger
    btn.textContent = isOpen ? "✕" : "☰";

    // Empêcher le défilement du body lorsque le menu est ouvert
    document.body.style.overflow = isOpen ? "hidden" : "";
  });
});

// Marquer le lien de navigation actif (par nom de fichier)
const current = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".main-nav .nav-link").forEach((a) => {
  if (a.getAttribute("href") === current) {
    a.classList.add("active");
  } else {
    a.classList.remove("active");
  }
});

// Basculement du thème
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  const isLight = document.body.classList.contains("light-mode");
  document.getElementById("themeToggle").textContent = isLight ? "☀️" : "🌙";
});
