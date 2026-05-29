document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.tab;

      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabPanels.forEach((panel) => panel.classList.remove("active"));

      button.classList.add("active");
      document.getElementById(target)?.classList.add("active");
    });
  });

  const slides = document.querySelectorAll(".slide");
  const prevButton = document.querySelector(".carousel-btn.prev");
  const nextButton = document.querySelector(".carousel-btn.next");
  let currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) return;
    slides.forEach((slide) => slide.classList.remove("active"));
    slides[index].classList.add("active");
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  nextButton?.addEventListener("click", nextSlide);
  prevButton?.addEventListener("click", prevSlide);

  if (slides.length > 1) {
    setInterval(nextSlide, 4500);
  }

  const form = document.querySelector(".lead-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("已收到您的諮詢資料。正式上線時可串接 Google Form、Tally 或 LINE。");
    form.reset();
  });

  const animatedElements = document.querySelectorAll(
    ".section-heading, .stat-card, .feature-card, .course-card, .program-grid div, .schedule-card, .why-grid article, .line-card, .map-placeholder"
  );

  animatedElements.forEach((element) => element.classList.add("fade-in"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  animatedElements.forEach((element) => observer.observe(element));
});
