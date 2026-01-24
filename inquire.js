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




/// Debug - see what we're working with
console.log('Current URL:', window.location.href);
console.log('Current pathname:', window.location.pathname);
console.log('Current page:', window.location.pathname.split('/').pop());

// Get current filename
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
console.log('Looking for:', currentPath);

// Desktop nav
document.querySelectorAll("header nav a, .footer1 nav a").forEach(link => {
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


//submit form

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // validate final step before sending
  if (!validateStep(3)) return;

   // ✅ PROCESSING START (only affects the submit button)
    const submitBtn = form.querySelector('button[type="submit"].small.primary');
    
    const stopProcessing = () => {
      if (!submitBtn) return;
      submitBtn.classList.remove("processing");
      submitBtn.disabled = false;
    };

    if (submitBtn) {
      submitBtn.classList.add("processing");
      submitBtn.disabled = true;
    }
    // ✅ PROCESSING END

  const formData = new FormData(form);

  try {
    const res = await fetch(
      "https://script.google.com/macros/s/AKfycbwAoH8SxInnko8GNRuVDqm_ltAeFcguT_TwQCk1TACqhC_k6LKytp5goD1hOR-EWyKSGA/exec",
      {
        method: "POST",
        body: formData, // ✅ FormData (no JSON)
      }
    );

    const text = await res.text();
    let result = {};
    try { result = JSON.parse(text); } catch {}

  if (res.ok && (result.success === true || result.success === "true")) {
      // ✅ after successful submit → show Calendly
      showStep(4);
      form.scrollIntoView({ behavior: "smooth" });
    } else {
      console.log("Apps Script response:", text);
      alert("Something went wrong. Please try again.");
    }
  } catch (err) {
    console.error(err);
    alert("Network error. Please try again.");
  }
});


