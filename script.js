// Improved mobile menu toggle with overlay
document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  document.querySelectorAll('[id^="menuToggle"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const hdr = btn.closest(".site-header");
      if (!hdr) return;
      const nav = hdr.querySelector(".main-nav");
      if (!nav) return;

      // Toggle menu
      const isOpen = nav.classList.toggle("open");

      // Toggle hamburger icon
      btn.textContent = isOpen ? "✕" : "☰";

      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
  });

  // Close menu when clicking on a link
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

  // Mark active nav link (by filename)
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav .nav-link").forEach((a) => {
    if (a.getAttribute("href") === current || a.href === location.href) {
      a.classList.add("active");
    } else {
      a.classList.remove("active");
    }
  });

  // Close menu on window resize to desktop
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
});
