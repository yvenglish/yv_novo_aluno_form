const form = document.getElementById("student-form");
const result = document.getElementById("result");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const submitButton = form.querySelector(".submit-btn");
  const originalButtonText = submitButton.textContent;

  submitButton.disabled = true;
  submitButton.textContent = "Enviando...";
  result.textContent = "";
  result.className = "result-message";

  const formData = new FormData(form);
  const object = Object.fromEntries(formData);

  const checkboxGroups = [
    "uso_ingles[]",
    "sente_que[]"
  ];

  checkboxGroups.forEach((groupName) => {
    const values = formData.getAll(groupName);
    if (values.length) object[groupName.replace("[]", "")] = values.join(", ");
    delete object[groupName];
  });

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
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
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});
