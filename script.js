document.addEventListener("DOMContentLoaded", function () {
  // 手機選單
  var menuToggle = document.querySelector(".menu-toggle");
  var mainNav = document.querySelector(".main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    var navLinks = mainNav.querySelectorAll("a");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 課表 Tabs 切換
  var tabButtons = document.querySelectorAll(".tab-btn");
  var tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var target = button.getAttribute("data-tab");

      tabButtons.forEach(function (btn) {
        btn.classList.remove("active");
      });

      tabPanels.forEach(function (panel) {
        panel.classList.remove("active");
      });

      button.classList.add("active");

      var targetPanel = document.getElementById(target);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });

  // 榜單輪播
  var slides = document.querySelectorAll(".slide");
  var prevButton = document.querySelector(".carousel-btn.prev");
  var nextButton = document.querySelector(".carousel-btn.next");
  var currentSlide = 0;

  function showSlide(index) {
    if (!slides || slides.length === 0) return;

    slides.forEach(function (slide) {
      slide.classList.remove("active");
    });

    slides[index].classList.add("active");
  }

  function nextSlide() {
    if (!slides || slides.length === 0) return;
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    if (!slides || slides.length === 0) return;
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  if (nextButton) {
    nextButton.addEventListener("click", nextSlide);
  }

  if (prevButton) {
    prevButton.addEventListener("click", prevSlide);
  }

  if (slides.length > 1) {
    setInterval(nextSlide, 4500);
  }



  // 圖片放大預覽：榜單與課表圖片可點擊放大
  var zoomableImages = document.querySelectorAll(".honor-gallery img, .timetable-image-card img");

  if (zoomableImages.length > 0) {
    var lightbox = document.createElement("div");
    lightbox.className = "image-lightbox";
    lightbox.innerHTML = '<button type="button" aria-label="關閉圖片預覽">×</button><img src="" alt="" />';
    document.body.appendChild(lightbox);

    var lightboxImage = lightbox.querySelector("img");
    var closeButton = lightbox.querySelector("button");

    zoomableImages.forEach(function (image) {
      image.addEventListener("click", function () {
        lightboxImage.src = image.getAttribute("src");
        lightboxImage.alt = image.getAttribute("alt") || "圖片預覽";
        lightbox.classList.add("open");
      });
    });

    function closeLightbox() {
      lightbox.classList.remove("open");
      lightboxImage.src = "";
    }

    closeButton.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && lightbox.classList.contains("open")) {
        closeLightbox();
      }
    });
  }

  // 表單送出提示
  var form = document.querySelector(".lead-form");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      alert("已收到您的諮詢資料。正式上線時可串接 Google Form、Tally 或 LINE。");
      form.reset();
    });
  }

  // 滾動進場動畫
  var animatedElements = document.querySelectorAll(
    ".section-heading, .stat-card, .feature-card, .course-card, .program-grid div, .schedule-card, .why-grid article, .line-card, .map-placeholder, .honor-copy, .honor-card, .gallery-item, .timetable-image-card, .elite-intro, .elite-advantage-grid article"
  );

  animatedElements.forEach(function (element) {
    element.classList.add("fade-in");
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    animatedElements.forEach(function (element) {
      observer.observe(element);
    });
  } else {
    animatedElements.forEach(function (element) {
      element.classList.add("show");
    });
  }
});
