/* =========================================================
   HOUSE OF CLIPPERS BARBER SHOP — SITE SCRIPT
   Central business configuration. Update these values to
   reuse this template for a different business.
   ========================================================= */
const BUSINESS = {
  name: "House of Clippers Barber Shop",
  type: "Barber Shop",
  phone: "+17133937213",
  displayPhone: "+1 713-393-7213",
  address: "1913 Gessner Rd, Houston, TX 77043, United States",
  rating: "4.6",
  reviewCount: 129,
  // Verified Google Maps reviews URL for House of Clippers Barber Shop.
  // Replace this value to point the "Read Our Google Reviews" button
  // at a different listing.
  googleMapsReviewsUrl: "https://www.google.com/maps/place/House+of+Clippers+Barber+Shop/@29.8067709,-95.5481296,17z/data=!4m8!3m7!1s0x8640c4dec7efa3a9:0x70ccf74d258a774f!8m2!3d29.8067709!4d-95.5455547!9m1!1b1!16s%2Fg%2F11bbx0g1hr?entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D"
};

document.addEventListener("DOMContentLoaded", () => {
  populateBusinessInfo();
  initMobileMenu();
  initSmoothScroll();
  initScrollReveal();
  initGallery();
  initFooterYear();
});

/* ---------- Populate business info & derived links ---------- */
function populateBusinessInfo() {
  // Google Maps directions link, built dynamically from the address —
  // no API key and no hardcoded coordinates required.
  const directionsUrl =
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent(BUSINESS.address);

  document.querySelectorAll("#ctaDirections, #locationDirections").forEach((el) => {
    el.href = directionsUrl;
  });

  document.querySelectorAll("#reviewsCta, #footerReviewsLink").forEach((el) => {
    el.href = BUSINESS.googleMapsReviewsUrl;
  });
}

/* ---------- Mobile hamburger navigation ---------- */
function initMobileMenu() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("mobileMenu");
  const backdrop = document.getElementById("mobileMenuBackdrop");
  if (!toggle || !menu || !backdrop) return;

  const open = () => {
    menu.classList.add("is-open");
    backdrop.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    menu.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    isOpen ? close() : open();
  });

  // Close when a nav link inside the mobile menu is clicked
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", close);
  });

  // Close when clicking outside the menu (on the backdrop)
  backdrop.addEventListener("click", close);

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      close();
      toggle.focus();
    }
  });
}

/* ---------- Smooth scroll with sticky-header offset ---------- */
function initSmoothScroll() {
  const header = document.getElementById("siteHeader");
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = (header ? header.offsetHeight : 0) + 12;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
      });
    });
  });
}

/* ---------- Scroll reveal animations ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/* ---------- Gallery lightbox ---------- */
function initGallery() {
  const items = Array.from(document.querySelectorAll(".gallery__item"));
  const lightbox = document.getElementById("lightbox");
  if (!items.length || !lightbox) return;

  const backdrop = document.getElementById("lightboxBackdrop");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");
  const imageEl = document.getElementById("lightboxImage");
  const captionEl = document.getElementById("lightboxCaption");
  const counterEl = document.getElementById("lightboxCounter");

  const slides = items.map((item) => ({
    src: item.querySelector("img").src.replace(/w=1000/, "w=1800"),
    alt: item.querySelector("img").alt,
    caption: item.querySelector(".gallery__caption")?.textContent || ""
  }));

  let currentIndex = 0;
  let lastFocused = null;

  function render() {
    const slide = slides[currentIndex];
    imageEl.src = slide.src;
    imageEl.alt = slide.alt;
    captionEl.textContent = slide.caption;
    counterEl.textContent = (currentIndex + 1) + " / " + slides.length;
  }

  function openLightbox(index) {
    currentIndex = index;
    lastFocused = document.activeElement;
    render();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % slides.length;
    render();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    render();
  }

  function onKeydown(e) {
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowRight") showNext();
    else if (e.key === "ArrowLeft") showPrev();
    else if (e.key === "Tab") trapFocus(e);
  }

  function trapFocus(e) {
    const focusable = lightbox.querySelectorAll("button");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  items.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
  });

  closeBtn.addEventListener("click", closeLightbox);
  backdrop.addEventListener("click", closeLightbox);
  nextBtn.addEventListener("click", showNext);
  prevBtn.addEventListener("click", showPrev);
}

/* ---------- Dynamic copyright year ---------- */
function initFooterYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}
