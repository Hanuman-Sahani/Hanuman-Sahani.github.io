/* =========================================================
   Hanuman Sahani — Portfolio  |  interactions (vanilla JS)
   ========================================================= */
(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Navbar shadow on scroll ---------- */
  const nav = $("#nav");
  const toTop = $("#toTop");
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 20);
    toTop.classList.toggle("show", y > 500);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const menu = $("#mobileMenu");
  const backdrop = $("#menuBackdrop");
  const openMenu = () => { menu.classList.add("open"); backdrop.classList.add("open"); document.body.style.overflow = "hidden"; };
  const closeMenu = () => { menu.classList.remove("open"); backdrop.classList.remove("open"); document.body.style.overflow = ""; };
  $("#navToggle") && $("#navToggle").addEventListener("click", openMenu);
  $("#mmClose") && $("#mmClose").addEventListener("click", closeMenu);
  backdrop && backdrop.addEventListener("click", closeMenu);
  $$("#mobileMenu a").forEach((a) => a.addEventListener("click", closeMenu));

  /* ---------- Back to top ---------- */
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Theme toggle (dark / light) ---------- */
  const root = document.documentElement;
  const themeBtn = $("#themeBtn");
  const syncThemeIcon = () => {
    const dark = root.getAttribute("data-theme") === "dark";
    if (themeBtn) themeBtn.innerHTML = dark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars"></i>';
  };
  syncThemeIcon();
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      syncThemeIcon();
    });
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = $$("[data-reveal]");
  // subtle stagger for siblings sharing a parent
  const groups = new Map();
  revealEls.forEach((el) => {
    const p = el.parentElement;
    if (!groups.has(p)) groups.set(p, 0);
    const i = groups.get(p);
    el.style.transitionDelay = Math.min(i * 70, 350) + "ms";
    groups.set(p, i + 1);
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Stat counters ---------- */
  let countersDone = false;
  const runCounters = () => {
    if (countersDone) return; countersDone = true;
    $$("[data-count]").forEach((el) => {
      const target = parseFloat(el.getAttribute("data-count"));
      const suffix = el.getAttribute("data-suffix") || "";
      const decimals = (String(target).split(".")[1] || "").length;
      const dur = 1400; const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(decimals) + suffix;
      };
      requestAnimationFrame(tick);
    });
  };
  const statsWrap = $(".stats");
  if (statsWrap && "IntersectionObserver" in window) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { runCounters(); so.disconnect(); } });
    }, { threshold: 0.4 });
    so.observe(statsWrap);
  } else { runCounters(); }

  /* ---------- Hero role typewriter ---------- */
  const roleEl = $("#role");
  if (roleEl) {
    const roles = [
      "Flutter & Laravel Developer",
      "SDE-II · BLoC Expert",
      "AI / ML Engineer",
      "Team Lead & Project Coordinator",
    ];
    let ri = 0, ci = 0, deleting = false;
    const type = () => {
      const word = roles[ri];
      roleEl.textContent = word.slice(0, ci);
      if (!deleting && ci < word.length) { ci++; setTimeout(type, 70); }
      else if (!deleting && ci === word.length) { deleting = true; setTimeout(type, 1500); }
      else if (deleting && ci > 0) { ci--; setTimeout(type, 35); }
      else { deleting = false; ri = (ri + 1) % roles.length; setTimeout(type, 300); }
    };
    setTimeout(type, 700);
  }

  /* ---------- Scrollspy (active nav link) ---------- */
  const sections = $$("main section[id]");
  const navLinks = $$(".nav-links a");
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = e.target.getAttribute("id");
          navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
        }
      });
    }, { threshold: 0.2, rootMargin: "-40% 0px -55% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Project filter ---------- */
  const filters = $$(".filter");
  const projects = $$(".proj");
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.getAttribute("data-filter");
      projects.forEach((p) => {
        const show = f === "all" || p.classList.contains(f);
        p.classList.toggle("hide", !show);
      });
    });
  });

  /* ---------- Contact form -> WhatsApp ---------- */
  const form = $("#contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = encodeURIComponent($("#name").value.trim());
      const email = encodeURIComponent($("#email").value.trim());
      const mobile = encodeURIComponent($("#mobile").value.trim());
      const message = encodeURIComponent($("#message").value.trim());
      const text = `Name: ${name}%0AEmail: ${email}%0AMobile: ${mobile}%0AMessage: ${message}`;
      window.open(`https://api.whatsapp.com/send?phone=7651864655&text=${text}`, "_blank");
    });
  }
})();
