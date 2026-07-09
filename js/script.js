/* ==========================================================================
   Terry Floriano Ratombosoa — Portfolio site
   i18n (FR/EN), navigation, reveal-on-scroll, contact form (mailto)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. Language handling ---------- */
  const langButtons = document.querySelectorAll("[data-lang-btn]");
  const i18nEls = document.querySelectorAll("[data-i18n]");
  const htmlEl = document.documentElement;

  function applyLang(lang) {
    i18nEls.forEach(el => {
      const dict = el.dataset;
      const key = lang === "en" ? "en" : "fr";
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });
    langButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.langBtn === lang));
    htmlEl.setAttribute("lang", lang);
    localStorage.setItem("tfr_lang", lang);
    document.querySelectorAll("[data-cv-fr]").forEach(el => {
      el.href = lang === "en" ? el.dataset.cvEn : el.dataset.cvFr;
    });
  }

  const savedLang = localStorage.getItem("tfr_lang") || "fr";
  applyLang(savedLang);

  langButtons.forEach(btn => {
    btn.addEventListener("click", () => applyLang(btn.dataset.langBtn));
  });

  /* ---------- 2. Sticky header on scroll ---------- */
  const header = document.querySelector("header");
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- 3. Mobile nav toggle ---------- */
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
    navLinks.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => navLinks.classList.remove("open"))
    );
  }

  /* ---------- 4. Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));

  /* ---------- 5. Contact form -> Netlify Forms (real submission) ---------- */
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("cf-status");

  function encodeFormData(data) {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");
  }

  const statusMessages = {
    sending: { fr: "Envoi en cours…", en: "Sending…" },
    success: { fr: "Merci ! Votre message a bien été envoyé. Je vous réponds sous 48h.", en: "Thank you! Your message has been sent. I'll reply within 48h." },
    error: { fr: "Une erreur est survenue. Vous pouvez aussi m'écrire directement à ratombosoaterryfloriano86@gmail.com.", en: "Something went wrong. You can also email me directly at ratombosoaterryfloriano86@gmail.com." }
  };

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const lang = htmlEl.getAttribute("lang") || "fr";

      const data = {
        "form-name": form.querySelector('input[name="form-name"]').value,
        name: form.querySelector("#cf-name").value.trim(),
        email: form.querySelector("#cf-email").value.trim(),
        service: form.querySelector("#cf-service").value,
        message: form.querySelector("#cf-message").value.trim(),
        "bot-field": form.querySelector('input[name="bot-field"]').value
      };

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      if (statusEl) {
        statusEl.textContent = statusMessages.sending[lang] || statusMessages.sending.fr;
        statusEl.className = "form-status sending";
      }

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeFormData(data)
      })
        .then(() => {
          if (statusEl) {
            statusEl.textContent = statusMessages.success[lang] || statusMessages.success.fr;
            statusEl.className = "form-status success";
          }
          form.reset();
        })
        .catch(() => {
          if (statusEl) {
            statusEl.textContent = statusMessages.error[lang] || statusMessages.error.fr;
            statusEl.className = "form-status error";
          }
        })
        .finally(() => {
          submitBtn.disabled = false;
        });
    });
  }

  /* ---------- 6. Current year in footer ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
