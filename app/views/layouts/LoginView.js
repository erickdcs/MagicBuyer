const STYLE_ID = "magicbuyer-login-style";
const OVERLAY_ID = "magicbuyer-login-overlay";

const ensureStyles = () => {
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    #${OVERLAY_ID} {
      align-items: center;
      backdrop-filter: blur(4px);
      background: rgba(6, 17, 34, 0.85);
      bottom: 0;
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      left: 0;
      padding: 24px;
      position: fixed;
      right: 0;
      top: 0;
      z-index: 9999;
      font-family: FUTFont, Arial, sans-serif;
    }

    #${OVERLAY_ID} .magicbuyer-login-card {
      background: rgba(12, 26, 50, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
      max-width: 360px;
      padding: 32px 28px;
      width: 100%;
    }

    #${OVERLAY_ID} h2 {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.06em;
      margin: 0 0 16px;
      text-align: center;
      text-transform: uppercase;
    }

    #${OVERLAY_ID} form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    #${OVERLAY_ID} label {
      display: flex;
      flex-direction: column;
      font-size: 13px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    #${OVERLAY_ID} input[type="text"],
    #${OVERLAY_ID} input[type="password"] {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      color: #fff;
      font-size: 14px;
      margin-top: 6px;
      padding: 10px 12px;
    }

    #${OVERLAY_ID} input[type="text"]:focus,
    #${OVERLAY_ID} input[type="password"]:focus {
      border-color: #21c25e;
      outline: none;
      box-shadow: 0 0 0 1px #21c25e;
    }

    #${OVERLAY_ID} .remember-row {
      align-items: center;
      display: flex;
      font-size: 12px;
      gap: 8px;
      justify-content: flex-start;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    #${OVERLAY_ID} .error-message {
      color: #ff6b6b;
      font-size: 13px;
      min-height: 18px;
      text-align: center;
    }

    #${OVERLAY_ID} button[type="submit"] {
      background: linear-gradient(135deg, #21c25e, #12843a);
      border: none;
      border-radius: 8px;
      color: #031321;
      cursor: pointer;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.08em;
      padding: 12px 16px;
      text-transform: uppercase;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    #${OVERLAY_ID} button[type="submit"]:hover:not(:disabled) {
      box-shadow: 0 8px 18px rgba(33, 194, 94, 0.45);
      transform: translateY(-1px);
    }

    #${OVERLAY_ID} button[type="submit"]:disabled {
      cursor: not-allowed;
      opacity: 0.65;
    }

    #${OVERLAY_ID} .magicbuyer-login-footer {
      font-size: 11px;
      letter-spacing: 0.04em;
      margin-top: 18px;
      opacity: 0.75;
      text-align: center;
      text-transform: uppercase;
    }
  `;

  const target =
    document.head || document.getElementsByTagName("head")[0] || document.documentElement;
  target.appendChild(style);
};

const createOverlay = () => {
  ensureStyles();

  if (!document.body) {
    throw new Error("El documento todavía no está listo para mostrar el formulario de acceso.");
  }

  let overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }

  overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  overlay.innerHTML = `
    <div class="magicbuyer-login-card">
      <h2>MagicBuyer</h2>
      <form>
        <label>
          Usuario
          <input type="text" name="username" autocomplete="username" />
        </label>
        <label>
          Contraseña
          <input type="password" name="password" autocomplete="current-password" />
        </label>
        <div class="remember-row">
          <input type="checkbox" id="magicbuyer-remember" name="remember" />
          <label for="magicbuyer-remember">Recordarme</label>
        </div>
        <div class="error-message" role="alert"></div>
        <button type="submit">Iniciar sesión</button>
      </form>
      <div class="magicbuyer-login-footer">
        Debes autenticarte para usar el autobuyer
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  return overlay;
};

export const renderLoginOverlay = ({ onSubmit }) => {
  const overlay = createOverlay();
  const form = overlay.querySelector("form");
  const usernameInput = form.querySelector('input[name="username"]');
  const passwordInput = form.querySelector('input[name="password"]');
  const rememberInput = form.querySelector('input[name="remember"]');
  const errorContainer = form.querySelector(".error-message");
  const submitButton = form.querySelector('button[type="submit"]');

  const setError = (message) => {
    errorContainer.textContent = message || "";
  };

  const setLoading = (isLoading) => {
    submitButton.disabled = Boolean(isLoading);
    submitButton.textContent = isLoading ? "Verificando..." : "Iniciar sesión";
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    onSubmit(
      {
        username: usernameInput.value.trim(),
        password: passwordInput.value,
        remember: rememberInput.checked,
      },
      {
        setError,
        setLoading,
        clearPassword: () => {
          passwordInput.value = "";
        },
        focusUsername: () => {
          usernameInput.focus();
        },
      }
    );
  });

  return {
    remove: () => {
      overlay.remove();
    },
    focus: () => {
      usernameInput.focus();
    },
  };
};
