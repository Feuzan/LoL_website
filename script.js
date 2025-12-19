// Amélioration du menu mobile avec superposition
document.addEventListener("DOMContentLoaded", () => {
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

  // Fermer le menu en cliquant sur un lien
  document.querySelectorAll(".main-nav .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      const nav = link.closest(".main-nav");
      if (nav && nav.classList.contains("open")) {
        nav.classList.remove("open");
        document.body.style.overflow = "";
        const overlay = document.querySelector(".menu-overlay");
        if (overlay) overlay.remove();
        const btn = document.querySelector('[id^="menuToggle"]');
        if (btn) btn.textContent = "☰";
      }
    });
  });

  // Marquer le lien de navigation actif (par nom de fichier)
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav .nav-link").forEach((a) => {
    if (a.getAttribute("href") === current || a.href === location.href) {
      a.classList.add("active");
    } else {
      a.classList.remove("active");
    }
  });

  // Fermer le menu lors du redimensionnement de la fenêtre vers le bureau
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 800) {
      const nav = document.querySelector(".main-nav.open");
      if (nav) {
        nav.classList.remove("open");
        document.body.style.overflow = "";
        const overlay = document.querySelector(".menu-overlay");
        if (overlay) overlay.remove();
        const btn = document.querySelector('[id^="menuToggle"]');
        if (btn) btn.textContent = "☰";
      }
    }
  });

  // Basculement du thème
  document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");
    document.getElementById("themeToggle").textContent = isLight ? "☀️" : "🌙";
  });
});
