/* ============================================
   ANIMATIONS.JS
   4 animations principales :
   1. Effet machine à écrire (hero)
   2. Compteurs animés (about)
   3. Barres de compétences (skills)
   4. Apparition des cartes au scroll (projects)
   ============================================ */


/* ── 1. EFFET MACHINE À ÉCRIRE ────────────── */

const typedEl = document.getElementById('typed-text');

// Les textes qui vont défiler
const words = ['développeuse', 'étudiante en MPI', 'passionnée de code'];

let wordIndex  = 0;   // quel mot on affiche
let charIndex  = 0;   // jusqu'à quel caractère on a tapé
let isDeleting = false; // est-ce qu'on efface ?

function typeWriter() {
  const currentWord = words[wordIndex];

  if (!isDeleting) {
    // On ajoute une lettre
    typedEl.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;

    // Mot complet → on attend puis on efface
    if (charIndex === currentWord.length) {
      setTimeout(() => { isDeleting = true; }, 1500);
    }
  } else {
    // On enlève une lettre
    typedEl.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;

    // Mot effacé → on passe au mot suivant
    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length; // boucle sur les mots
    }
  }

  // Vitesse : plus rapide en effaçant
  const speed = isDeleting ? 60 : 120;
  setTimeout(typeWriter, speed);
}

// Lance l'animation après 500ms
setTimeout(typeWriter, 500);


/* ── 2. COMPTEURS ANIMÉS ──────────────────── */
/*
   IntersectionObserver : observe quand un élément
   entre dans le viewport (zone visible de l'écran).
   Sans ça, l'animation se joue avant que tu scrolles
   jusqu'à la section About.
*/

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target')); // lit data-target="6"
  const duration = 1500; // durée totale en ms
  const step = duration / target; // temps entre chaque incrément
  let current = 0;

  const timer = setInterval(() => {
    current++;
    el.textContent = current;

    if (current === target) {
      clearInterval(timer); // arrête quand on atteint la cible
    }
  }, step);
}

// Observer pour les compteurs
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // L'élément est visible → on lance le compteur
      animateCounter(entry.target);
      // On arrête d'observer pour ne pas relancer l'animation
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 }); // déclenche quand 50% de l'élément est visible

// On observe chaque élément .stat-num
document.querySelectorAll('.stat-num').forEach(el => {
  counterObserver.observe(el);
});


/* ── 3. BARRES DE COMPÉTENCES ─────────────── */

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const width = fill.getAttribute('data-width'); // lit data-width="85"
      fill.style.width = width + '%'; // le CSS transition s'occupe de l'animation
      barObserver.unobserve(fill);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-fill').forEach(el => {
  barObserver.observe(el);
});


/* ── 4. APPARITION DES CARTES AU SCROLL ───── */

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Délai progressif : chaque carte apparaît 100ms après la précédente
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 100);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card').forEach(el => {
  cardObserver.observe(el);
});