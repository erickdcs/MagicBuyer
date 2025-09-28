const createElementFromHTML = (htmlString) => {
  const template = document.createElement("template");
  template.innerHTML = htmlString.trim();
  return template.content.firstElementChild;
};

export const createLoginModal = ({ onSubmit }) => {
  if (typeof onSubmit !== "function") {
    throw new Error("createLoginModal requires an onSubmit callback.");
  }

  const overlay = createElementFromHTML(`
    <div class="magicbuyer-login-overlay">
      <div class="magicbuyer-login-modal">
        <h2 class="magicbuyer-login-title">MagicBuyer</h2>
        <p class="magicbuyer-login-subtitle">Inicia sesión para continuar</p>
        <form class="magicbuyer-login-form">
          <label for="magicbuyer-login-username">Usuario</label>
          <input
            id="magicbuyer-login-username"
            name="username"
            type="text"
            autocomplete="username"
            required
          />
          <label for="magicbuyer-login-password">Contraseña</label>
          <input
            id="magicbuyer-login-password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
          />
          <div class="magicbuyer-login-error" role="alert"></div>
          <button type="submit" class="btn-standard call-to-action">
            Iniciar sesión
          </button>
          <div class="magicbuyer-login-spinner">Validando credenciales...</div>
        </form>
      </div>
    </div>
  `);

  const form = overlay.querySelector(".magicbuyer-login-form");
  const usernameInput = overlay.querySelector("#magicbuyer-login-username");
  const submitButton = form.querySelector('button[type="submit"]');
  const spinner = overlay.querySelector(".magicbuyer-login-spinner");
  const errorNode = overlay.querySelector(".magicbuyer-login-error");

  const setError = (message) => {
    const normalizedMessage = message || "";
    errorNode.textContent = normalizedMessage;
    errorNode.style.visibility = normalizedMessage ? "visible" : "hidden";
  };

  const setLoading = (isLoading) => {
    submitButton.disabled = Boolean(isLoading);
    overlay.classList.toggle("is-loading", Boolean(isLoading));
    spinner.style.display = isLoading ? "block" : "none";
  };

  const close = () => {
    if (overlay.parentElement) {
      overlay.parentElement.removeChild(overlay);
    }
  };

  const controller = {
    close,
    setError,
    setLoading,
    focus: () => {
      if (usernameInput && typeof usernameInput.focus === "function") {
        usernameInput.focus();
      }
    },
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (overlay.classList.contains("is-loading")) {
      return;
    }

    const username = usernameInput.value.trim();
    const password = form.elements.password.value;

    if (!username || !password) {
      setError("Ingresa usuario y contraseña válidos.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await onSubmit({ username, password }, controller);
    } catch (error) {
      setError(error?.message || "Error al iniciar sesión.");
      setLoading(false);
    }
  });

  document.body.appendChild(overlay);
  controller.focus();

  return controller;
};
