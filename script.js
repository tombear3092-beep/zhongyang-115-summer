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

  // 榜單輪播：如果頁面仍有舊輪播結構，保留功能；沒有就自動略過
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

  // 榜單分類切換
  var honorFilters = document.querySelectorAll(".honor-filter");
  var honorItems = document.querySelectorAll(".honor-item");

  honorFilters.forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.getAttribute("data-filter");

      honorFilters.forEach(function (btn) {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      honorItems.forEach(function (item) {
        var category = item.getAttribute("data-category");

        if (filter === "all" || filter === category) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  // 圖片點擊放大：榜單圖片 + 課表圖片共用同一個 lightbox
  var previewImages = document.querySelectorAll(
    ".honor-item img, .honor-gallery img, .timetable-image-card img"
  );

  var imageLightbox = document.querySelector(".image-lightbox");

  if (!imageLightbox) {
    imageLightbox = document.createElement("div");
    imageLightbox.className = "image-lightbox";
    imageLightbox.innerHTML =
      '<button type="button" aria-label="關閉圖片預覽">×</button><img src="" alt="圖片預覽">';
    document.body.appendChild(imageLightbox);
  }

  var previewImg = imageLightbox.querySelector("img");
  var previewClose = imageLightbox.querySelector("button");

  previewImages.forEach(function (img) {
    img.style.cursor = "zoom-in";

    img.addEventListener("click", function () {
      var imageSrc = img.currentSrc || img.src || img.getAttribute("src");

      if (!imageSrc) return;

      previewImg.setAttribute("src", imageSrc);
      previewImg.setAttribute("alt", img.getAttribute("alt") || "圖片預覽");

      imageLightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  function closeImageLightbox() {
    imageLightbox.classList.remove("open");
    previewImg.removeAttribute("src");
    document.body.style.overflow = "";
  }

  if (previewClose) {
    previewClose.addEventListener("click", closeImageLightbox);
  }

  imageLightbox.addEventListener("click", function (event) {
    if (event.target === imageLightbox) {
      closeImageLightbox();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && imageLightbox.classList.contains("open")) {
      closeImageLightbox();
    }
  });

  // Google 表單送出後顯示成功訊息
  var leadForm = document.getElementById("leadForm");
  var formSuccessMessage = document.getElementById("formSuccessMessage");

  if (leadForm && formSuccessMessage) {
    leadForm.addEventListener("submit", function () {
      setTimeout(function () {
        formSuccessMessage.classList.add("show");
        leadForm.reset();
      }, 800);
    });
  }

  // 滾動進場動畫
  var animatedElements = document.querySelectorAll(
    ".section-heading, .stat-card, .feature-card, .course-card, .program-grid div, .schedule-card, .why-grid article, .line-card, .map-placeholder, .honor-copy, .honor-card, .gallery-item, .honor-item, .timetable-image-card, .elite-intro, .elite-advantage-grid article, .elite-method-card"
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

  // Contact 區塊：點擊校區按鈕切換 Google Map
  var campusMap = document.getElementById("campusMap");
  var campusMapTitle = document.getElementById("campusMapTitle");
  var campusMapAddress = document.getElementById("campusMapAddress");
  var mapSwitchButtons = document.querySelectorAll(".map-switch");

  var campusMaps = {
    jianguo: {
      title: "中央補習班 建中校地圖",
      address: "台南市中西區忠義路一段 65 號",
      src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3673.0113720962286!2d120.20169469999999!3d22.986609299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e767c312c26ff%3A0x32ab3f57aeb53cab!2zNzAw6Ie65Y2X5biC5Lit6KW_5Y2A5Y2X6ZaA6YeM5b-g576p6Lev5LiA5q61NjMtNjXomZ8!5e0!3m2!1szh-TW!2stw!4v1780316583667!5m2!1szh-TW!2stw"
    },
    chenggong: {
      title: "中央補習班 成功校地圖",
      address: "台南市北區成功路 256 號",
      src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.6628710615223!2d120.20251830000001!3d22.999421400000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e766056d8b3f9%3A0x6ca25815c169c9c1!2zNzA06Ie65Y2X5biC5YyX5Y2A5YyX6I-v6YeM5oiQ5Yqf6LevMjU26Jmf!5e0!3m2!1szh-TW!2stw!4v1780316965321!5m2!1szh-TW!2stw"
    }
  };

  mapSwitchButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var mapKey = button.getAttribute("data-map");
      var selectedMap = campusMaps[mapKey];

      if (!selectedMap || !campusMap) return;

      campusMap.src = selectedMap.src;

      if (campusMapTitle) {
        campusMapTitle.textContent = selectedMap.title;
      }

      if (campusMapAddress) {
        campusMapAddress.textContent = selectedMap.address;
      }

      mapSwitchButtons.forEach(function (btn) {
        btn.classList.remove("active");
      });

      button.classList.add("active");
    });
  };

});
