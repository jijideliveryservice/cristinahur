
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

let virtualScroll = 0;
const maxVirtualScroll = 100;
let lastTouchY = 0;

const touchSpeed = 0.25; // tune: bigger = faster on mobile

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function isSection2Pinned() {
  const rect = section2.getBoundingClientRect();
  const pinnedAtTop = Math.abs(rect.top) < 2;                 // forgiving for iOS
  const fillsViewport = rect.bottom >= window.innerHeight - 2; // sticky is active
  return pinnedAtTop && fillsViewport;
}

function updateAnimation() {
  const progress = virtualScroll / maxVirtualScroll;

  const width = 90 + (progress * 10);
  const height = 50 + (progress * 50);
  const borderRadius = 300 - (progress * 300);

  container.style.width = `${width}%`;
  container.style.height = `${height}%`;
  container.style.borderRadius = `${borderRadius}px`;
}

// initial
updateAnimation();

// IMPORTANT: touchstart should be passive:false if you want maximum control on iOS
section2.addEventListener(
  "touchstart",
  (e) => {
    lastTouchY = e.touches[0].clientY;
  },
  { passive: false }
);

section2.addEventListener(
  "touchmove",
  (e) => {
    const currentTouchY = e.touches[0].clientY;
    const deltaY = lastTouchY - currentTouchY; // + = swipe up (scroll down)

    // iOS sometimes sends non-cancelable events once scrolling begins
    if (!e.cancelable) {
      lastTouchY = currentTouchY;
      return;
    }

    const pinned = isSection2Pinned();

    const swipingUp = deltaY > 0;
    const swipingDown = deltaY < 0;

    const shouldLock =
      pinned &&
      ((swipingUp && virtualScroll < maxVirtualScroll) ||
        (swipingDown && virtualScroll > 0));

    if (!shouldLock) {
      lastTouchY = currentTouchY;
      return;
    }

    e.preventDefault(); // pause page scroll

    // scale by deltaY, not +1
    virtualScroll = clamp(
      virtualScroll + deltaY * touchSpeed,
      0,
      maxVirtualScroll
    );

    updateAnimation();
    lastTouchY = currentTouchY;
  },
  { passive: false }
);
