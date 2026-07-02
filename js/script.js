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

  /* ---------- 5. Contact form -> mailto ---------- */
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.querySelector("#cf-name").value.trim();
      const email = form.querySelector("#cf-email").value.trim();
      const service = form.querySelector("#cf-service").value;
      const message = form.querySelector("#cf-message").value.trim();
      const lang = htmlEl.getAttribute("lang") || "fr";

      const subject = lang === "en"
        ? `Website inquiry — ${service}`
        : `Demande via le site — ${service}`;

      const bodyLines = lang === "en"
        ? [`Name: ${name}`, `Email: ${email}`, `Service of interest: ${service}`, "", message]
        : [`Nom : ${name}`, `Email : ${email}`, `Service concerné : ${service}`, "", message];

      const mailto = `mailto:ratombosoaterryfloriano86@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
      window.location.href = mailto;
    });
  }

  /* ---------- 6. Current year in footer ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
