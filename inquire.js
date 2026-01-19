// side menu (keep yours as-is)
const openMenuTag = document.querySelector(".open-menu");
const closeMenuTag = document.querySelector(".close-button");
const menuPanelTag = document.querySelector(".menuPanel");
const bodyTag = document.querySelector("body");

openMenuTag.addEventListener("click", function () {
  menuPanelTag.classList.add("open");
  bodyTag.classList.add("menu-open");

  closeMenuTag.addEventListener("click", function () {
    menuPanelTag.classList.remove("open");
    bodyTag.classList.remove("menu-open");
  });
});


// ----------------------------
// multi-step form

const form = document.querySelector(".contact-form");
const steps = Array.from(form.querySelectorAll(".field-container"));

let currentStep = 1;

function showStep(stepNumber) {
  steps.forEach((s) => s.classList.remove("is-active"));

  const target = form.querySelector(`.field-container[data-step="${stepNumber}"]`);
  if (target) {
    target.classList.add("is-active");
    currentStep = stepNumber;
  }
}

function validateStep(stepNumber) {
  const stepEl = form.querySelector(`.field-container[data-step="${stepNumber}"]`);
  if (!stepEl) return true;

  // validate only required fields inside this step
  const requiredFields = Array.from(stepEl.querySelectorAll("[required]"));

  for (const field of requiredFields) {
    // uses built-in validity (required, type="email", pattern, etc.)
    if (!field.checkValidity()) {
      field.reportValidity();
      field.focus();
      return false;
    }
  }

  return true;
}

// handle ALL next/back buttons
form.addEventListener("click", (e) => {
  const nextBtn = e.target.closest("[data-next]");
  const backBtn = e.target.closest("[data-back]");

  if (nextBtn) {
    if (!validateStep(currentStep)) return;
    showStep(currentStep + 1);
  }

  if (backBtn) {
    showStep(currentStep - 1);
  }
});

// start on step 1
showStep(1);
