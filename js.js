// Elements
const hamburger = document.getElementById("hamburger");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");
const menuBtns = document.querySelectorAll(".menu-btn");
const panels = document.querySelectorAll(".panel");
const fadeEls = document.querySelectorAll(".fade-in");
const headings = document.querySelectorAll(".section-heading");

// Initialise: show about
window.addEventListener("DOMContentLoaded", () => {
  // show about panel
  panels.forEach(p => p.classList.remove("active-panel"));
  const about = document.getElementById("about");
  if (about) about.classList.add("active-panel");

  // animate visible elements on load
  reveal();
});

// Hamburger open/close
hamburger.addEventListener("click", () => {
  const isActive = hamburger.classList.toggle("active");
  sideMenu.classList.toggle("active", isActive);
  overlay.classList.toggle("active", isActive);
  // aria
  hamburger.setAttribute("aria-expanded", String(isActive));
  sideMenu.setAttribute("aria-hidden", String(!isActive));
  overlay.setAttribute("aria-hidden", String(!isActive));
});

// Close when clicking overlay
overlay.addEventListener("click", () => {
  hamburger.classList.remove("active");
  sideMenu.classList.remove("active");
  overlay.classList.remove("active");
  hamburger.setAttribute("aria-expanded", "false");
  sideMenu.setAttribute("aria-hidden", "true");
  overlay.setAttribute("aria-hidden", "true");
});

// Menu item click => show panel & close menu
menuBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    const targetId = btn.dataset.section;
    // mark active
    menuBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // show only the target panel
    panels.forEach(p => p.classList.remove("active-panel"));
    const targetPanel = document.getElementById(targetId);
    if (targetPanel) {
      targetPanel.classList.add("active-panel");
      // small delay to re-run reveal for newly visible fades
      setTimeout(() => reveal(), 100);
    }

    // close side menu (mobile behavior)
    hamburger.classList.remove("active");
    sideMenu.classList.remove("active");
    overlay.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    sideMenu.setAttribute("aria-hidden", "true");
    overlay.setAttribute("aria-hidden", "true");

    // scroll to top of container (keeps content centered)
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// Fade-in reveal for elements and heading underline
function reveal() {
  const trigger = window.innerHeight * 0.85;
  fadeEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < trigger) el.classList.add("visible");
  });
  headings.forEach(h => {
    const rect = h.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) h.classList.add("visible");
  });
}

// run reveal on scroll and load
window.addEventListener("scroll", reveal);
window.addEventListener("resize", reveal);


// ==== GALLERY FULLSCREEN VIEWER WITH ZOOM ====
const galleryImgs = document.querySelectorAll(".gallery img");
const overlayDiv = document.getElementById("imageOverlay");
const overlayImg = document.getElementById("overlayImage");
const closeBtn = document.getElementById("closeOverlay");
const nextBtn = document.getElementById("nextImage");
const prevBtn = document.getElementById("prevImage");

let currentIndex = 0;
let zoomLevel = 1;

if (galleryImgs && overlayDiv && overlayImg) {
  galleryImgs.forEach((img, i) => {
    img.addEventListener("click", () => {
      currentIndex = i;
      openImage(img.src);
    });
  });

  function openImage(src) {
    overlayImg.src = src;
    overlayDiv.classList.add("show");
    document.body.style.overflow = "hidden";
    zoomLevel = 1;
    overlayImg.style.transform = "scale(1)";
  }

  function closeOverlayFunc() {
    overlayDiv.classList.remove("show");
    document.body.style.overflow = "auto";
  }

  closeBtn.addEventListener("click", closeOverlayFunc);
  overlayDiv.addEventListener("click", (e) => {
    if (e.target === overlayDiv) closeOverlayFunc();
  });

  nextBtn.addEventListener("click", () => showImage(1));
  prevBtn.addEventListener("click", () => showImage(-1));

  function showImage(dir) {
    currentIndex = (currentIndex + dir + galleryImgs.length) % galleryImgs.length;
    overlayImg.src = galleryImgs[currentIndex].src;
    zoomLevel = 1;
    overlayImg.style.transform = "scale(1)";
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeOverlayFunc();
    if (e.key === "ArrowRight") showImage(1);
    if (e.key === "ArrowLeft") showImage(-1);
  });

  // Zoom with mouse wheel
  overlayImg.addEventListener("wheel", (e) => {
    e.preventDefault();
    zoomLevel += e.deltaY * -0.001;
    zoomLevel = Math.min(Math.max(zoomLevel, 1), 3);
    overlayImg.style.transform = `scale(${zoomLevel})`;
  });

  // Double-click to reset zoom
  overlayImg.addEventListener("dblclick", () => {
    zoomLevel = 1;
    overlayImg.style.transform = "scale(1)";
  });
}


// ===== FULLSCREEN IMAGE VIEWER (SCROLLABLE VERSION) =====
const viewer = document.getElementById("imageViewer");
const viewerImg = document.getElementById("viewerImg");
const closeViewer = viewer.querySelector(".close-viewer");

// Open image fullscreen
document.querySelectorAll(".gallery img").forEach(img => {
  img.addEventListener("click", () => {
    viewerImg.src = img.src;
    viewer.classList.add("active");
    document.body.style.overflow = "hidden"; // disable background scroll
  });
});

// Close viewer (double click, Esc, or X)
viewer.addEventListener("dblclick", closeImageViewer);
closeViewer.addEventListener("click", closeImageViewer);
window.addEventListener("keydown", e => {
  if (e.key === "Escape") closeImageViewer();
});

function closeImageViewer() {
  viewer.classList.remove("active");
  document.body.style.overflow = "auto";
}


// ===== WELCOME MESSAGE POPUP =====
window.addEventListener("DOMContentLoaded", () => {
  const welcomeModal = document.getElementById("welcomeModal");
  const okBtn = document.getElementById("okWelcome");
  const closeBtn = document.getElementById("closeWelcome");

  // Show popup only if not dismissed before
  if (!localStorage.getItem("welcomeDismissed")) {
    setTimeout(() => {
      welcomeModal.classList.add("show");
      document.body.style.overflow = "hidden";
    }, 700); // small delay for smooth entrance
  }

  function closeWelcome() {
    welcomeModal.classList.remove("show");
    document.body.style.overflow = "auto";
    localStorage.setItem("welcomeDismissed", "true");
  }

  okBtn.addEventListener("click", closeWelcome);
  closeBtn.addEventListener("click", closeWelcome);
  welcomeModal.addEventListener("click", (e) => {
    if (e.target === welcomeModal) closeWelcome();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeWelcome();
  });
});

