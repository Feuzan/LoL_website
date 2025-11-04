// Simplified: menu toggle and active link detection
document.addEventListener("DOMContentLoaded", () => {
  // mobile menu toggle
  document.querySelectorAll('[id^="menuToggle"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const hdr = btn.closest(".site-header");
      if (!hdr) return;
      const nav = hdr.querySelector(".main-nav");
      if (!nav) return;
      nav.classList.toggle("open");
    });
  });

  // mark active nav link (by filename)
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav .nav-link").forEach((a) => {
    if (a.getAttribute("href") === current || a.href === location.href) {
      a.classList.add("active");
    } else {
      a.classList.remove("active");
    }
  });
});
