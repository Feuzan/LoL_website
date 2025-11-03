// script.js — menu toggle & small behaviors
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('#menuToggle, #menuToggle2, #menuToggle3, #menuToggle4, #menuToggle5').forEach(btn=>{
    if(!btn) return;
    btn.addEventListener('click', ()=>{
      const hdr = btn.closest('.site-header');
      const nav = hdr.querySelector('.main-nav');
      if(!nav) return;
      if(getComputedStyle(nav).display === 'none' || nav.style.display === 'none') {
        nav.style.display = 'flex';
        nav.style.flexDirection = 'column';
      } else {
        nav.style.display = 'none';
      }
    });
  });

  // improve active link highlight based on URL
  const links = document.querySelectorAll('.main-nav .nav-link');
  links.forEach(a=>{
    if(a.href === location.href || a.href === location.pathname || a.getAttribute('href') === location.pathname.split('/').pop()) {
      a.classList.add('active');
    }
  });
});
