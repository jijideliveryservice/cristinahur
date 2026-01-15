
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


const section2 = document.querySelector(".section2");
const container = document.querySelector(".section2 .container");

if (!section2 || !container) {
  console.warn("Missing .section2 or .section2 .container");
}

// 0 = collapsed, 1 = expanded
let progress = 0;

// Tune feel: bigger = faster per wheel tick
const speed = 0.002;

function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function applyContainerStyles(t) {
  const widthPct = lerp(90, 100, t);   // 90% -> 100%
  const heightPct = lerp(50, 100, t);  // 50% -> 100%
  const radiusPx = lerp(300, 0, t);    // 300px -> 0

  container.style.width = `${widthPct}%`;
  container.style.height = `${heightPct}%`;
  container.style.borderRadius = `${radiusPx}px`;
}

// set initial look
applyContainerStyles(progress);

document.addEventListener(
  "wheel",
  (e) => {
    if (!section2 || !container) return;

    const rect = section2.getBoundingClientRect();

    // Only hijack when section2 is truly "pinned" (stuck at top)
    const pinnedAtTop = Math.abs(rect.top) < 2;
    const fillsViewport = rect.bottom >= window.innerHeight;
    const section2Pinned = pinnedAtTop && fillsViewport;

    const scrollingDown = e.deltaY > 0;
    const scrollingUp = e.deltaY < 0;

    const shouldLockScroll =
      section2Pinned &&
      ((scrollingDown && progress < 1) || (scrollingUp && progress > 0));

    if (!shouldLockScroll) return;

    e.preventDefault();

    progress = clamp01(progress + e.deltaY * speed);
    applyContainerStyles(progress);
  },
  { passive: false }
);

// ===== MOBILE - touch events =====
document.addEventListener("touchstart", function(e) {
    lastTouchY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener("touchmove", function(e) {
    const rect = section2.getBoundingClientRect();
    const currentTouchY = e.touches[0].clientY;
    const deltaY = lastTouchY - currentTouchY; // Positive = swiping up (scrolling down)
    
    if (rect.top <= 0 && virtualScroll < maxVirtualScroll) {
        e.preventDefault();
        
        if (deltaY > 0) { 
            virtualScroll += 1;
        } else if (virtualScroll > 0) { 
            virtualScroll -= 1;
        }
        
        virtualScroll = Math.max(0, Math.min(maxVirtualScroll, virtualScroll));
        updateAnimation();
    }
    else if (rect.top <= 0 && virtualScroll === 0 && deltaY < 0) {
        virtualScroll = 0;
    }
    else if (rect.top > 0) {
        virtualScroll = 0;
        updateAnimation();
    }
    
    lastTouchY = currentTouchY;
}, { passive: false });

function updateAnimation() {
    const progress = virtualScroll / maxVirtualScroll;
    
    const width = 90 + (progress * 10);
    const height = 50 + (progress * 50);
    const borderRadius = 300 - (progress * 300);
    
    imgTag.style.width = `${width}%`;
    imgTag.style.height = `${height}%`;
    imgTag.style.borderRadius = `${borderRadius}px`;
    
    console.log("progress: " + (progress * 100).toFixed(2) + "%");
}



