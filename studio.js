
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


const imgTag = document.querySelector(".section2 .container");
const section2 = document.querySelector(".section2");
const body = document.body;

let virtualScroll = 0; 
const maxVirtualScroll = 100;
let lastTouchY = 0;
let isLocked = false;

// Desktop - wheel event
document.addEventListener("wheel", function (e) {
    const rect = section2.getBoundingClientRect();
    
    if (rect.top <= 0 && virtualScroll < maxVirtualScroll) {
        e.preventDefault();
        
        if (e.deltaY > 0) { 
            virtualScroll += 1;
        } else if (virtualScroll > 0) { 
            virtualScroll -= 1;
        }
        
        virtualScroll = Math.max(0, Math.min(maxVirtualScroll, virtualScroll));
        updateAnimation();
    }
    else if (rect.top <= 0 && virtualScroll === 0 && e.deltaY < 0) {
        virtualScroll = 0;
    }
    else if (rect.top > 0) {
        virtualScroll = 0;
        updateAnimation();
    }
}, { passive: false });

// Mobile - touch events
document.addEventListener("touchstart", function(e) {
    const rect = section2.getBoundingClientRect();
    
    // Lock body if we're at section2
    if (rect.top <= 0 && rect.bottom > 0) {
        isLocked = true;
        body.classList.add('locked');
    }
    
    lastTouchY = e.touches[0].clientY;
});

document.addEventListener("touchmove", function(e) {
    const rect = section2.getBoundingClientRect();
    const currentTouchY = e.touches[0].clientY;
    const deltaY = lastTouchY - currentTouchY;
    
    if (isLocked && virtualScroll < maxVirtualScroll) {
        // Animate based on touch movement
        if (deltaY > 5) { // Swipe up threshold
            virtualScroll += 2;
        } else if (deltaY < -5 && virtualScroll > 0) { // Swipe down threshold
            virtualScroll -= 2;
        }
        
        virtualScroll = Math.max(0, Math.min(maxVirtualScroll, virtualScroll));
        updateAnimation();
        
        // Unlock when animation complete
        if (virtualScroll >= maxVirtualScroll) {
            isLocked = false;
            body.classList.remove('locked');
        }
    }
    
    // Unlock when scrolling away
    if (virtualScroll === 0 && deltaY < 0) {
        isLocked = false;
        body.classList.remove('locked');
    }
    
    lastTouchY = currentTouchY;
});

document.addEventListener("touchend", function() {
    // Clean up if needed
    if (virtualScroll === 0 || virtualScroll >= maxVirtualScroll) {
        isLocked = false;
        body.classList.remove('locked');
    }
});

function updateAnimation() {
    const progress = virtualScroll / maxVirtualScroll;
    
    const width = 90 + (progress * 10);
    const height = 50 + (progress * 50);
    const borderRadius = 300 - (progress * 300);
    
    imgTag.style.width = `${width}%`;
    imgTag.style.height = `${height}%`;
    imgTag.style.borderRadius = `${borderRadius}px`;
    
    console.log("Mobile progress: " + (progress * 100).toFixed(2) + "%");
}