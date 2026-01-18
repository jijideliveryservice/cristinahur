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
    bodyTag.classList.remove('menu-open'); 

    })
  }

})
  
  
  
//change form page
const form = document.querySelector(".contact-form");
const steps = [...form.querySelectorAll(".field-container")];

function showStep(stepNumber) {
    steps.forEach(s => 
        s.classList.remove("is-active")
    );
        const target = form.querySelector(`.field-container[data-step="${stepNumber}"]`);
        
        if (target) {
            target.classList.add("is-active");
        }
}

// Next (Step 1 -> Step 2)
const nextBtn = form.querySelector("[data-next]");

nextBtn.addEventListener("click", () => {
    const step1 = form.querySelector('.field-container[data-step="1"]');
    const requiredFields = [...step1.querySelectorAll("[required]")];

    // simple required validation
    const firstInvalid = requiredFields.find(el => !el.value.trim());
    if (firstInvalid) {
        firstInvalid.focus();
        return;
    }

    showStep(2);
});

// Back (Step 2 -> Step 1)
const backBtn = form.querySelector("[data-back]");

backBtn.addEventListener("click", () => 
    showStep(1)
);



//change form page

//active current page
const activePage = document.querySelector(".is-active")

const buttonTag = document.querySelector(button)
//reference to field container/step page
const fieldContainer = document.querySelector(".field-container")
//next btton
const nxtBtn = form.querySelector("[data-next]");


//when i click the next button
//look for the [data-next] attribute
//if it has the attribute,
//when I click the next button,
//the step number increases 1 at a time 
//also the current active field container class is removed, and
//the is active class is added to the new field container 
//when i click back button
//step number decreases 1 at a time

buttonTag.addEventListener("click", function () {


    if (target.hasAttribute("[data-next]")) {

    }

})