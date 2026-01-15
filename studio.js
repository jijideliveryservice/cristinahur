
//side menu

const openMenuTag = document.querySelector(".open-menu")
const closeMenuTag = document.querySelector(".close-button")
const menuPanelTag = document.querySelector(".menuPanel")
const mainTag = document.querySelector("main")
const bodyTag = document.querySelector("body")

openMenuTag.addEventListener("click", function () {
  menuPanelTag.classList.add("open")
  bodyTag.classList.add("menu-open")

  if (menuPanelTag.classList.contains("open")) {
    
    closeMenuTag.addEventListener("click", function () {
    menuPanelTag.classList.remove("open")
    
    menuPanelTag.style.transition = `right .8s ease`
    closeMenuTag.style.transition = `right .8s ease`
    
    bodyTag.classList.remove('menu-open')

    })
  }

})

//current page hilight

/// Debug - see what we're working with
console.log('Current URL:', window.location.href);
console.log('Current pathname:', window.location.pathname);
console.log('Current page:', window.location.pathname.split('/').pop());

// Get current filename
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
console.log('Looking for:', currentPath);

// Desktop nav
document.querySelectorAll("header nav a").forEach(link => {
    const linkHref = link.getAttribute('href');
    console.log('Link href:', linkHref);
    
    if (!linkHref || linkHref === '#') {
        console.log('Skipping # link');
        return;
    }
    
    const linkPath = linkHref.replace('./', '');
    console.log('Comparing:', currentPath, '===', linkPath);
    
    if (currentPath === linkPath) {
        console.log('MATCH! Adding active class to:', link.textContent);
        link.classList.add("active");
    }
});


//about frame parallax
const sectionTag = document.querySelector(".section1")
const sectionImgTag = document.querySelectorAll(".section1 img")

document.addEventListener("scroll", function () {

    const topView = window.pageYOffset 
    const sizeOfCurrentView = window.innerHeight
    const middleOfYourView = topView + (sizeOfCurrentView / 2)    

    sectionImgTag.forEach (img => {

        if (img.hasAttribute('data-parallax')) {
            const topOfElement = img.offsetTop
            const midSectionElement = topOfElement + (img.getBoundingClientRect().height/2)
            
            //calc dis from your mid eye view from mid of the images
            const distanceBetween = middleOfYourView - midSectionElement

            const speed = parseFloat(img.getAttribute("data-parallax"))
            img.style.transform = `translateY(${distanceBetween * speed}px)`;

        }
    }) 
})


//resume request section 


// =============================
// RESUME REQUEST SECTION (iPhone-safe)
// Scroll-jack using active-zone (viewport middle inside section2)
// =============================

const section2 = document.querySelector(".section2");
const container = document.querySelector(".section2 .container");

if (!section2 || !container) {
  console.warn("Missing .section2 or .section2 .container");
}

// progress: 0 = collapsed, 1 = expanded
let progress = 0;

// tune
const wheelSpeed = 0.002;
const touchSpeed = 0.004;

let lastTouchY = 0;

function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function isMobile() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function viewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

/**
 * iOS-safe: section2 is "active" when the middle of the viewport
 * is inside the section.
 * This avoids relying on sticky reporting rect.top ~ 0 (often buggy on iOS).
 */
function isSection2Active() {
  const rect = section2.getBoundingClientRect();
  const vh = viewportHeight();
  const mid = vh / 2;

  return rect.top < mid && rect.bottom > mid;
}

function applyContainerStyles(t) {
  const mobile = isMobile();

  // collapsed (start)
  const startW = mobile ? 50 : 90;
  const startH = mobile ? 90 : 50;
  const startR = mobile ? 9999 : 300;

  // expanded (end)
  const endW = 100;
  const endH = 100;
  const endR = 0;

  container.style.width = `${lerp(startW, endW, t)}%`;
  container.style.height = `${lerp(startH, endH, t)}%`;
  container.style.borderRadius = `${lerp(startR, endR, t)}px`;
}

// initial
applyContainerStyles(progress);

// update on resize/orientation + iOS URL bar changes
window.addEventListener("resize", () => applyContainerStyles(progress));
window.visualViewport?.addEventListener("resize", () => applyContainerStyles(progress));

// ===== DESKTOP: wheel =====
document.addEventListener(
  "wheel",
  (e) => {
    if (!section2 || !container) return;

    // only hijack while section2 is the active view
    if (!isSection2Active()) return;

    const down = e.deltaY > 0;
    const up = e.deltaY < 0;

    // only lock scroll while progress can change
    const shouldLock = (down && progress < 1) || (up && progress > 0);
    if (!shouldLock) return;

    e.preventDefault();

    progress = clamp01(progress + e.deltaY * wheelSpeed);
    applyContainerStyles(progress);
  },
  { passive: false }
);

// ===== MOBILE: touch =====
document.addEventListener(
  "touchstart",
  (e) => {
    lastTouchY = e.touches[0].clientY;
  },
  { passive: false }
);

document.addEventListener(
  "touchmove",
  (e) => {
    if (!section2 || !container) return;

    // iOS: preventDefault only works if cancelable
    if (!e.cancelable) return;

    if (!isSection2Active()) {
      lastTouchY = e.touches[0].clientY;
      return;
    }

    const currentTouchY = e.touches[0].clientY;
    const deltaY = lastTouchY - currentTouchY; // + = swipe up (scroll down)

    const up = deltaY > 0;
    const down = deltaY < 0;

    const shouldLock = (up && progress < 1) || (down && progress > 0);
    if (!shouldLock) {
      lastTouchY = currentTouchY;
      return;
    }

    e.preventDefault();

    progress = clamp01(progress + deltaY * touchSpeed);
    applyContainerStyles(progress);

    lastTouchY = currentTouchY;
  },
  { passive: false }
);
