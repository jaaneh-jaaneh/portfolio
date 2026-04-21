/* ============================================
   CONTACT.JS
   Validation du formulaire + envoi via Formspree
   Sans librairie externe — JS pur
   ============================================ */

const form       = document.getElementById('contact-form');
const nameInput  = document.getElementById('name');
const emailInput = document.getElementById('email');
const msgInput   = document.getElementById('message');


/* ── FONCTIONS DE VALIDATION ──────────────── */

// Vérifie qu'un champ n'est pas vide
function isEmpty(value) {
  return value.trim() === '';
}

// Vérifie qu'un email est valide avec une regex
function isValidEmail(value) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value);
}

// Affiche une erreur sur un champ
function showError(inputEl, errorId, message) {
  inputEl.classList.add('invalid');
  document.getElementById(errorId).textContent = message;
}

// Efface une erreur
function clearError(inputEl, errorId) {
  inputEl.classList.remove('invalid');
  document.getElementById(errorId).textContent = '';
}

// Valide tous les champs → retourne true si tout est OK
function validateForm() {
  let isValid = true;

  // Validation du nom
  if (isEmpty(nameInput.value)) {
    showError(nameInput, 'error-name', 'Ce champ est obligatoire');
    isValid = false;
  } else {
    clearError(nameInput, 'error-name');
  }

  // Validation de l'email
  if (isEmpty(emailInput.value)) {
    showError(emailInput, 'error-email', 'Ce champ est obligatoire');
    isValid = false;
  } else if (!isValidEmail(emailInput.value)) {
    showError(emailInput, 'error-email', 'Adresse email invalide');
    isValid = false;
  } else {
    clearError(emailInput, 'error-email');
  }

  // Validation du message
  if (isEmpty(msgInput.value)) {
    showError(msgInput, 'error-message', 'Ce champ est obligatoire');
    isValid = false;
  } else if (msgInput.value.trim().length < 10) {
    showError(msgInput, 'error-message', 'Message trop court (10 caractères minimum)');
    isValid = false;
  } else {
    clearError(msgInput, 'error-message');
  }

  return isValid;
}


/* ── VALIDATION EN TEMPS RÉEL ─────────────── */
/*
   On efface l'erreur dès que l'utilisateur
   commence à corriger le champ — meilleure UX
*/

nameInput.addEventListener('input', () => clearError(nameInput, 'error-name'));
emailInput.addEventListener('input', () => clearError(emailInput, 'error-email'));
msgInput.addEventListener('input', () => clearError(msgInput, 'error-message'));


/* ── SOUMISSION DU FORMULAIRE ─────────────── */

form.addEventListener('submit', async (e) => {
  e.preventDefault(); // empêche le rechargement de la page

  // Si la validation échoue → on arrête ici
  if (!validateForm()) return;

  // Récupère le bouton pour changer son état
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Envoi en cours...';
  submitBtn.disabled = true;

  try {
    /*
      Formspree : service gratuit qui reçoit les données
      du formulaire et t'envoie un email.
      Inscription sur formspree.io → crée un formulaire
      → remplace 'YOUR_FORM_ID' par ton ID.
    */
    const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:    nameInput.value,
        email:   emailInput.value,
        message: msgInput.value
      })
    });

    if (response.ok) {
      // Succès → message de confirmation
      form.innerHTML = `
        <div style="
          text-align: center;
          padding: 3rem;
          color: var(--color-text-white);
        ">
          <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
          <h3 style="
            font-family: var(--font-heading);
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            color: var(--color-primary-light);
          ">Message envoyé !</h3>
          <p style="color: rgba(242,237,231,0.6)">
            Merci, je te répondrai dès que possible.
          </p>
        </div>
      `;
    } else {
      throw new Error('Erreur serveur');
    }

  } catch (error) {
    // Erreur → message d'erreur
    submitBtn.textContent = 'Envoyer';
    submitBtn.disabled = false;
    document.getElementById('error-message').textContent =
      'Une erreur est survenue. Réessaie plus tard.';
  }
});


/* ── FILTRE PROJETS ───────────────────────── */
/*
   Placé ici pour garder animations.js propre.
   Au clic sur un bouton filtre → on affiche
   seulement les cartes avec le bon data-tags.
*/

const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');

    // Met à jour le bouton actif
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Affiche/cache les cartes
    projectCards.forEach(card => {
      const tags = card.getAttribute('data-tags');
      if (filter === 'all' || tags.includes(filter)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});