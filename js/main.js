/* Les Compagnons Couvreurs – Script minimal (menu mobile, façade YouTube, validation formulaire) */
(function () {
  'use strict';

  /* 1. Menu mobile accessible */
  var menuBtn = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.getElementById('mobile-nav');

  if (menuBtn && mobileNav) {
    var closeMenu = function () {
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileNav.hidden = true;
    };

    menuBtn.addEventListener('click', function () {
      var expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      mobileNav.hidden = expanded;
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !mobileNav.hidden) {
        closeMenu();
        menuBtn.focus();
      }
    });
  }

  /* 2. Façade vidéo YouTube (chargement différé au clic pour préserver le LCP) */
  var videoTriggers = document.querySelectorAll('[data-youtube-trigger]');
  videoTriggers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var videoId = btn.getAttribute('data-youtube-id');
      var title = btn.getAttribute('data-youtube-title') || 'Présentation Les Compagnons Couvreurs';
      var wrapper = btn.closest('[data-youtube-facade]');
      if (!videoId || !wrapper) return;

      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(videoId) + '?autoplay=1&rel=0';
      iframe.title = title;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;

      wrapper.innerHTML = '';
      wrapper.appendChild(iframe);
    });
  });

  /* 3. Validation client des formulaires de devis */
  var forms = document.querySelectorAll('[data-quote-form]');
  forms.forEach(function (form) {
    var feedback = form.querySelector('[data-form-feedback]');

    form.addEventListener('submit', function (event) {
      var nom = form.querySelector('[name="nom"]');
      var telephone = form.querySelector('[name="telephone"]');
      var email = form.querySelector('[name="email"]');
      var rgpd = form.querySelector('[name="rgpd"]');
      var errors = [];

      if (nom && nom.value.trim().length < 2) {
        errors.push('Veuillez indiquer votre nom ou raison sociale.');
      }
      if (telephone) {
        var digits = telephone.value.replace(/\D/g, '');
        if (digits.length < 10) {
          errors.push('Veuillez saisir un numéro de téléphone valide (10 chiffres).');
        }
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        errors.push('Veuillez saisir une adresse e-mail valide.');
      }
      if (rgpd && !rgpd.checked) {
        errors.push('Veuillez accepter le traitement de vos données pour recevoir votre devis.');
      }

      if (errors.length > 0) {
        event.preventDefault();
        if (feedback) {
          feedback.hidden = false;
          feedback.className = 'form-feedback form-feedback--error';
          feedback.textContent = errors.join(' ');
        }
        return;
      }

      var action = form.getAttribute('action') || '';
      if (action.indexOf('[ENDPOINT_FORMULAIRE') !== -1 || action === '') {
        event.preventDefault();
        if (feedback) {
          feedback.hidden = false;
          feedback.className = 'form-feedback form-feedback--info';
          feedback.innerHTML =
            'Vos informations sont bien renseignées. Ce formulaire est prêt à être relié à votre serveur ' +
            '(<code>[ENDPOINT_FORMULAIRE À DÉFINIR]</code>). Pour une réponse immédiate, appelez le ' +
            '<a href="tel:+33329342432">03 29 34 24 32</a> ou écrivez à ' +
            '<a href="mailto:compagnons@wanadoo.fr">compagnons@wanadoo.fr</a>.';
        }
      }
    });
  });
})();
