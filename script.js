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

  // 榜單分類切換 + 預設收合：每一類先顯示 1 張
  var honorFilters = document.querySelectorAll(".honor-filter");
  var honorItems = document.querySelectorAll(".honor-item");
  var honorMoreBtn = document.getElementById("honorMoreBtn");
  var currentHonorFilter = "all";
  var honorExpanded = false;

  var honorMoreLabels = {
    all: "完整榜單",
    rank: "完整校排榜單",
    exam: "完整段考榜單",
    competition: "完整競賽成績",
    admission: "完整升學榜單"
  };

  function updateHonorGallery() {
    var visibleCounters = {
      rank: 0,
      exam: 0,
      competition: 0,
      admission: 0
    };

    var totalMatched = 0;
    var totalHiddenByCollapse = 0;

    honorItems.forEach(function (item) {
      var category = item.getAttribute("data-category");
      var matchCurrentFilter = currentHonorFilter === "all" || category === currentHonorFilter;

      item.classList.remove("is-hidden-by-collapse");
      item.style.display = "none";

      if (!matchCurrentFilter) return;

      totalMatched += 1;

      if (honorExpanded) {
        item.style.display = "";
        return;
      }

      if (visibleCounters[category] === 0) {
        item.style.display = "";
      } else {
        item.classList.add("is-hidden-by-collapse");
        totalHiddenByCollapse += 1;
      }

      visibleCounters[category] += 1;
    });

    if (honorMoreBtn) {
      honorMoreBtn.textContent = honorExpanded
        ? "收合榜單"
        : "查看" + (honorMoreLabels[currentHonorFilter] || "完整榜單");

      honorMoreBtn.style.display = totalMatched > 1 && totalHiddenByCollapse > 0 || honorExpanded ? "inline-flex" : "none";
    }
  }

  honorFilters.forEach(function (button) {
    button.addEventListener("click", function () {
      currentHonorFilter = button.getAttribute("data-filter") || "all";
      honorExpanded = false;

      honorFilters.forEach(function (btn) {
        btn.classList.remove("active");
      });

      button.classList.add("active");
      updateHonorGallery();
    });
  });

  if (honorMoreBtn) {
    honorMoreBtn.addEventListener("click", function () {
      honorExpanded = !honorExpanded;
      updateHonorGallery();
    });
  }

  updateHonorGallery();

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
    ".section-heading, .stat-card, .feature-card, .course-card, .program-grid div, .schedule-card, .why-grid article, .line-card, .map-placeholder, .honor-copy, .honor-card, .gallery-item, .honor-item, .timetable-image-card, .elite-intro, .elite-advantage-grid article, .elite-method-card, .elite-system-copy, .elite-compare-card, .elite-system-card"
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
  });


  // Hero 右側圖片輪播
  var heroCarousel = document.querySelector("[data-hero-carousel]");

  if (heroCarousel) {
    var heroSlides = heroCarousel.querySelectorAll(".hero-carousel-slide");
    var heroDots = heroCarousel.querySelectorAll(".hero-carousel-dots button");
    var heroPrev = heroCarousel.querySelector(".hero-carousel-prev");
    var heroNext = heroCarousel.querySelector(".hero-carousel-next");
    var heroCurrent = 0;
    var heroTimer = null;

    function showHeroSlide(index) {
      if (!heroSlides.length) return;

      heroCurrent = (index + heroSlides.length) % heroSlides.length;

      heroSlides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === heroCurrent);
      });

      heroDots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === heroCurrent);
      });
    }

    function nextHeroSlide() {
      showHeroSlide(heroCurrent + 1);
    }

    function startHeroCarousel() {
      if (heroSlides.length <= 1) return;
      stopHeroCarousel();
      heroTimer = setInterval(nextHeroSlide, 4200);
    }

    function stopHeroCarousel() {
      if (heroTimer) {
        clearInterval(heroTimer);
        heroTimer = null;
      }
    }

    if (heroPrev) {
      heroPrev.addEventListener("click", function () {
        showHeroSlide(heroCurrent - 1);
        startHeroCarousel();
      });
    }

    if (heroNext) {
      heroNext.addEventListener("click", function () {
        showHeroSlide(heroCurrent + 1);
        startHeroCarousel();
      });
    }

    heroDots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        showHeroSlide(dotIndex);
        startHeroCarousel();
      });
    });

    showHeroSlide(0);
    startHeroCarousel();
  }
  // 手機版：滑下後顯示回到最上面按鈕
  var backToTop = document.querySelector(".back-to-top");

  if (backToTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 500) {
        backToTop.classList.add("show");
      } else {
        backToTop.classList.remove("show");
      }
    });
  }
  // 熱門課程：點擊按鈕彈出課程圖片
var programButtons = document.querySelectorAll(".program-popup-btn");
var programModal = document.getElementById("programModal");
var programModalImage = document.getElementById("programModalImage");
var programModalTitle = document.getElementById("programModalTitle");
var programModalClose = document.querySelector(".program-modal-close");

function openProgramModal(imageSrc, title) {
  if (!programModal || !programModalImage) return;

  programModalImage.setAttribute("src", imageSrc);
  programModalImage.setAttribute("alt", title || "課程時間表");

  if (programModalTitle) {
    programModalTitle.textContent = title || "課程時間表";
  }

  programModal.classList.add("open");
  programModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeProgramModal() {
  if (!programModal || !programModalImage) return;

  programModal.classList.remove("open");
  programModal.setAttribute("aria-hidden", "true");
  programModalImage.removeAttribute("src");
  document.body.style.overflow = "";
}

programButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    var imageSrc = button.getAttribute("data-program-img");
    var title = button.getAttribute("data-program-title") || button.textContent.trim();

    if (!imageSrc) return;

    openProgramModal(imageSrc, title);
  });
});

if (programModalClose) {
  programModalClose.addEventListener("click", closeProgramModal);
}

if (programModal) {
  programModal.addEventListener("click", function (event) {
    if (event.target === programModal) {
      closeProgramModal();
    }
  });
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && programModal && programModal.classList.contains("open")) {
    closeProgramModal();
  }
});
});
