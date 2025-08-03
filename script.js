// Function to detect when the second project reaches the top of the viewport
document.addEventListener("scroll", function () {
    const secondProject = document.querySelector(".second-project");
    const firstProjectHeight = document.querySelector(".first-project").offsetHeight;
    
    // Get the scroll position
    let scrollY = window.scrollY;

    // Transition to make the second project visible when it hits the top of the screen
    if (scrollY >= firstProjectHeight) {
        secondProject.style.opacity = 1; /* Fade in */
        secondProject.style.transform = "translateY(0)"; /* Move it up */
    } else {
        secondProject.style.opacity = 0; /* Fade out */
        secondProject.style.transform = "translateY(100px)"; /* Optional: slide effect */
    }
});

document.addEventListener('DOMContentLoaded', () => {
  const gridLines = document.querySelectorAll('.grid div');

  gridLines.forEach((line, index) => {
    setTimeout(() => {
      line.style.transform = 'scaleY(1)';
    }, index * 150); // staggered
  });
});

console.log("script connected"); 


//calculating page height for sp 
function updateProjectHeights() {
  const spOverlay = document.querySelector('.sp-overlay');
  const spWrapper = document.querySelector('.sp-wrapper');
  const pageWrapper = document.querySelector('.page-wrapper');
  const header = document.querySelector('.header');

  if (spOverlay && spWrapper && pageWrapper && header) {

    const overlayHeight = spOverlay.scrollHeight;

    spWrapper.style.height = `${overlayHeight}px`;

  }
}

window.addEventListener('load', () => {
  setTimeout(updateProjectHeights, 150);
});
window.addEventListener('resize', updateProjectHeights);

