const OVERLAY_ID = "magicbuyer-login-overlay";

const removeExistingOverlay = () => {
  const existing = document.getElementById(OVERLAY_ID);
  if (existing && existing.parentNode) {
    existing.parentNode.removeChild(existing);
  }
};

export const createLoginOverlay = ({
  title = "Inicia sesión para usar MagicBuyer",
  submitLabel = "Acceder",
  onSubmit,
} = {}) => {
  removeExistingOverlay();

  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  overlay.className = "magicbuyer-login-overlay";

  const card = document.createElement("div");
  card.className = "magicbuyer-login-card";

  const heading = document.createElement("h2");
  heading.textContent = title;
  card.appendChild(heading);

  const form = document.createElement("form");
  form.className = "magicbuyer-login-form";

  const usernameWrapper = document.createElement("label");
  usernameWrapper.className = "magicbuyer-login-field";
  usernameWrapper.textContent = "Usuario";
  const usernameInput = document.createElement("input");
  usernameInput.type = "text";
  usernameInput.name = "username";
  usernameInput.required = true;
  usernameInput.autocomplete = "username";
  usernameWrapper.appendChild(usernameInput);

  const passwordWrapper = document.createElement("label");
  passwordWrapper.className = "magicbuyer-login-field";
  passwordWrapper.textContent = "Contraseña";
  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.name = "password";
  passwordInput.required = true;
  passwordInput.autocomplete = "current-password";
  passwordWrapper.appendChild(passwordInput);

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = submitLabel;

  const statusMessage = document.createElement("div");
  statusMessage.className = "magicbuyer-login-status";

  const footerMessage = document.createElement("p");
  footerMessage.className = "magicbuyer-login-footer";
  footerMessage.textContent = "Necesitas iniciar sesión para continuar";

  form.appendChild(usernameWrapper);
  form.appendChild(passwordWrapper);
  form.appendChild(submitButton);
  form.appendChild(statusMessage);

  card.appendChild(form);
  card.appendChild(footerMessage);

  overlay.appendChild(card);

  const controls = {
    mount: () => {
      document.body.appendChild(overlay);
      usernameInput.focus();
    },
    destroy: () => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    },
    setLoading: (isLoading) => {
      submitButton.disabled = Boolean(isLoading);
      submitButton.classList.toggle("is-loading", Boolean(isLoading));
    },
    showError: (message) => {
      statusMessage.textContent = message || "Error al iniciar sesión.";
      statusMessage.classList.remove("magicbuyer-login-success");
      statusMessage.classList.add("magicbuyer-login-error");
    },
    showSuccess: (message) => {
      statusMessage.textContent = message || "Sesión iniciada";
      statusMessage.classList.remove("magicbuyer-login-error");
      statusMessage.classList.add("magicbuyer-login-success");
    },
    clearMessage: () => {
      statusMessage.textContent = "";
      statusMessage.classList.remove(
        "magicbuyer-login-error",
        "magicbuyer-login-success"
      );
    },
    getValues: () => ({
      username: usernameInput.value.trim(),
      password: passwordInput.value,
    }),
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    controls.clearMessage();
    onSubmit && onSubmit(controls.getValues(), controls);
  });

  return controls;
};
