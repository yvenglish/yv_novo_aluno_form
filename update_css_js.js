const fs = require('fs');

// --- UPDATE CSS ---
let css = fs.readFileSync('style.css', 'utf8');

// Add Playfair Display to headings
css = css.replace(
    '.brand-row h1 {',
    '.brand-row h1 {\n  font-family: "Playfair Display", Georgia, serif;'
);
css = css.replace(
    '.hero-content h2 {',
    '.hero-content h2 {\n  font-family: "Playfair Display", Georgia, serif;'
);
css = css.replace(
    '.section-head h3 {',
    '.section-head h3 {\n  font-family: "Playfair Display", Georgia, serif;'
);
css = css.replace(
    '.form-block h4 {',
    '.form-block h4 {\n  font-family: "Playfair Display", Georgia, serif;'
);

// Append Wizard CSS
const wizardCss = `

/* WIZARD & NEW ACTIONS */
.wizard-progress { margin-bottom: 24px; }
.progress-info { display: flex; justify-content: flex-end; margin-bottom: 8px; }
.step-text { font-size: 0.8rem; color: var(--orange-2); font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; }
.progress-track { height: 6px; background: rgba(255,255,255,0.06); border-radius: 10px; overflow: hidden; }
.progress-fill { height: 100%; width: 20%; background: linear-gradient(90deg, var(--orange), var(--orange-2)); border-radius: 10px; transition: width 0.4s ease; box-shadow: 0 0 12px rgba(239, 155, 83, 0.4); }

.wizard-steps { position: relative; }
.step { display: none; animation: fadeIn 0.4s ease forwards; }
.step.active { display: block; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.wizard-actions { display: flex; gap: 14px; margin-top: 32px; justify-content: flex-end; }
.btn-next, .btn-prev {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: 52px; border: 0; cursor: pointer; border-radius: 18px; padding: 14px 28px;
  font: inherit; font-weight: 800; transition: transform .2s ease, filter .2s ease, box-shadow .2s ease;
}
.btn-next, .submit-btn {
  color: #120d20; background: linear-gradient(135deg, #fffaf2, #ef9b53); box-shadow: 0 18px 44px rgba(200, 111, 43, .25);
  width: auto;
}
.btn-next:hover, .submit-btn:hover { transform: translateY(-2px); filter: brightness(1.05); }
.btn-prev { background: rgba(255,255,255,0.06); color: #fff; border: 1px solid rgba(255,255,255,0.1); width: auto; }
.btn-prev:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }

@media (max-width: 640px) {
  .wizard-actions { flex-direction: column-reverse; }
  .btn-next, .btn-prev, .submit-btn { width: 100%; }
}
`;

css += wizardCss;
fs.writeFileSync('style.css', css, 'utf8');


// --- UPDATE JS ---
const jsContent = `const form = document.getElementById("student-form");
const result = document.getElementById("result");
const steps = Array.from(document.querySelectorAll(".step"));
const nextBtn = document.getElementById("btn-next");
const prevBtn = document.getElementById("btn-prev");
const submitBtn = document.getElementById("btn-submit");
const progressFill = document.getElementById("progress-fill");
const currentStepNum = document.getElementById("current-step-num");

let currentStep = 0;

function updateWizard() {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
  });

  currentStepNum.textContent = currentStep + 1;
  const progressPercent = ((currentStep + 1) / steps.length) * 100;
  progressFill.style.width = \`\${progressPercent}%\`;

  prevBtn.style.display = currentStep === 0 ? "none" : "inline-flex";
  
  if (currentStep === steps.length - 1) {
    nextBtn.style.display = "none";
    submitBtn.style.display = "inline-flex";
  } else {
    nextBtn.style.display = "inline-flex";
    submitBtn.style.display = "none";
  }
}

function validateStep() {
  const currentStepEl = steps[currentStep];
  const inputs = currentStepEl.querySelectorAll("input[required], select[required], textarea[required]");
  for (const input of inputs) {
    if (!input.checkValidity()) {
      input.reportValidity();
      return false;
    }
  }
  return true;
}

nextBtn.addEventListener("click", () => {
  if (validateStep()) {
    currentStep++;
    updateWizard();
    window.scrollTo({ top: document.querySelector('.form-card').offsetTop - 20, behavior: 'smooth' });
  }
});

prevBtn.addEventListener("click", () => {
  currentStep--;
  updateWizard();
  window.scrollTo({ top: document.querySelector('.form-card').offsetTop - 20, behavior: 'smooth' });
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  if (!validateStep()) return;

  const originalButtonText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";
  result.textContent = "";
  result.className = "result-message";

  const formData = new FormData(form);
  const object = Object.fromEntries(formData);

  const checkboxGroups = ["uso_ingles[]", "sente_que[]"];
  checkboxGroups.forEach((groupName) => {
    const values = formData.getAll(groupName);
    if (values.length) object[groupName.replace("[]", "")] = values.join(", ");
    delete object[groupName];
  });

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(object)
    });
    const data = await response.json();
    if (response.ok && data.success) {
      window.location.href = "obrigada.html";
    } else {
      result.textContent = data.message || "Algo deu errado. Tente novamente.";
      result.classList.add("error");
    }
  } catch (error) {
    result.textContent = "Não foi possível enviar agora. Tente novamente.";
    result.classList.add("error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalButtonText;
  }
});

// Initialize
updateWizard();
`;

fs.writeFileSync('script.js', jsContent, 'utf8');
console.log("Success");
