
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


window.addEventListener("load", () => {
  document.querySelector(".grid-wrap")?.classList.add("is-visible");
});



//resume request section 


// =============================
// RESUME REQUEST SECTION (smooth mobile release)
// =============================

const section2 = document.querySelector(".section2");
const container = document.querySelector(".section2 .container");

if (!section2 || !container) {
  console.warn("Missing .section2 or .section2 .container");
}

let progress = 0;

// tuning
const wheelSpeed = 0.002;
const touchSpeed = 0.006; // a bit more responsive on mobile

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

// Mobile-friendly: section is active when viewport middle is inside it
// Desktop: use a stricter pinned check so it doesn't start early
function isSection2Active() {
  const rect = section2.getBoundingClientRect();
  const vh = viewportHeight();

  if (isMobile()) {
    const mid = vh / 2;
    return rect.top < mid && rect.bottom > mid;
  }

  const pinnedAtTop = Math.abs(rect.top) < 2;
  const fillsViewport = rect.bottom >= vh - 2;
  return pinnedAtTop && fillsViewport;
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

// initial + keep correct on rotation / URL bar changes
applyContainerStyles(progress);
window.addEventListener("resize", () => applyContainerStyles(progress));
window.visualViewport?.addEventListener("resize", () => applyContainerStyles(progress));

// ===== DESKTOP: wheel =====
document.addEventListener(
  "wheel",
  (e) => {
    if (!section2 || !container) return;
    if (!isSection2Active()) return;

    const down = e.deltaY > 0;
    const up = e.deltaY < 0;

    // Only lock while progress can actually change
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

    const currentTouchY = e.touches[0].clientY;
    const deltaY = lastTouchY - currentTouchY; // + = swipe up (scroll down)

    // Always update lastTouchY so you never get "stuck deltas"
    lastTouchY = currentTouchY;

    // If iOS says it's not cancelable, we cannot prevent scroll anyway
    if (!e.cancelable) return;

    // Only consider hijacking while section is active
    if (!isSection2Active()) return;

    const swipingUp = deltaY > 0;   // user wants to scroll down the page
    const swipingDown = deltaY < 0; // user wants to scroll up the page

    // ✅ CRITICAL: Release scroll at the ends
    // - If fully expanded and user keeps swiping up (to go DOWN page), let them scroll
    if (progress >= 1 && swipingUp) return;

    // - If fully collapsed and user swiping down (to go UP page), let them scroll
    if (progress <= 0 && swipingDown) return;

    // Otherwise, we are mid-animation (or reversing), so hijack
    e.preventDefault();

    progress = clamp01(progress + deltaY * touchSpeed);
    applyContainerStyles(progress);
  },
  { passive: false }
);




window.addEventListener("load", () => {
  document.querySelector(".grid-wrap")?.classList.add("is-visible");
});
