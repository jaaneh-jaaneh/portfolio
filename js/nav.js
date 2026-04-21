/* ============================================
   NAV.JS
   3 comportements de la navbar :
   1. Change de style au scroll
   2. Menu burger (mobile)
   3. Lien actif selon la section visible
   ============================================ */

const navbar  = document.getElementById('navbar');
const burger  = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
const links   = document.querySelectorAll('.nav-links a');


/* ── 1. NAVBAR AU SCROLL ──────────────────── */
/*
   On écoute l'événement 'scroll' sur la fenêtre.
   Si on a scrollé de plus de 50px → on ajoute
   la classe .scrolled définie dans style.css
*/

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // On en profite pour mettre à jour le lien actif
  highlightActiveLink();
});


/* ── 2. MENU BURGER ───────────────────────── */
/*
   Au clic sur le burger → on toggle la classe .open
   sur .nav-links (définie dans le responsive CSS)
*/

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');

  // Animation du burger : les 3 traits → une croix
  burger.classList.toggle('active');
});

// Ferme le menu quand on clique sur un lien
links.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('active');
  });
});


/* ── 3. LIEN ACTIF AU SCROLL ──────────────── */
/*
   On récupère toutes les sections avec un id.
   Pour chaque section visible, on ajoute la
   classe .active au lien correspondant dans la nav.
*/

const sections = document.querySelectorAll('section[id]');

function highlightActiveLink() {
  const scrollY = window.scrollY;

  sections.forEach(section => {
    const sectionTop    = section.offsetTop - 100; // offset navbar
    const sectionBottom = sectionTop + section.offsetHeight;
    const sectionId     = section.getAttribute('id');

    // Trouve le lien qui pointe vers cette section
    const correspondingLink = document.querySelector(
      `.nav-links a[href="#${sectionId}"]`
    );

    if (!correspondingLink) return;

    if (scrollY >= sectionTop && scrollY < sectionBottom) {
      // On retire .active de tous les liens
      links.forEach(l => l.classList.remove('active'));
      // On l'ajoute seulement au lien courant
      correspondingLink.classList.add('active');
    }
  });
}

// Lance une première fois au chargement
highlightActiveLink();


/* ── BONUS : Animation burger → croix ─────── */
/*
   Dans style.css, ajoute ces règles pour que
   le burger se transforme en ✕ quand le menu est ouvert :

   .nav-burger.active span:nth-child(1) {
     transform: translateY(7px) rotate(45deg);
   }
   .nav-burger.active span:nth-child(2) {
     opacity: 0;
   }
   .nav-burger.active span:nth-child(3) {
     transform: translateY(-7px) rotate(-45deg);
   }
*/