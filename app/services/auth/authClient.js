import { AUTH_API_BASE_URL, AUTH_SESSION_DURATION } from "../../app.constants";
import { getValue, setValue } from "../repository";
import { createLoginModal } from "../../views/layouts/LoginModalView";

const AUTH_STATE_KEY = "MagicBuyerAuthState";
let authPromise = null;

const normalizeBaseUrl = () => {
  if (!AUTH_API_BASE_URL) {
    throw new Error(
      "AUTH_API_BASE_URL is not defined. Provide window.MAGIC_BUYER_AUTH_URL or set MAGIC_BUYER_AUTH_URL during the build."
    );
  }
  return AUTH_API_BASE_URL.replace(/\/$/, "");
};

const persistAuthState = (state) => {
  if (!state) {
    setValue(AUTH_STATE_KEY, null);
    return;
  }

  setValue(AUTH_STATE_KEY, {
    ...state,
    expiryTimeStamp:
      state.expiryTimeStamp || Date.now() + Number(AUTH_SESSION_DURATION || 0),
  });
};

const parseLoginResponse = (payload, username) => {
  if (!payload || typeof payload !== "object") {
    throw new Error("La respuesta del servidor de autenticación es inválida.");
  }

  const expiresInSeconds = Number(payload.expiresIn || 0);
  const calculatedExpiry =
    expiresInSeconds > 0
      ? Date.now() + expiresInSeconds * 1000
      : Date.now() + Number(AUTH_SESSION_DURATION || 0);

  return {
    token: payload.token,
    user: payload.user || { username },
    expiryTimeStamp: calculatedExpiry,
  };
};

const performLoginRequest = async (username, password) => {
  const baseUrl = normalizeBaseUrl();

  let response;
  try {
    response = await fetch(`${baseUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
  } catch (networkError) {
    throw new Error(
      "No se pudo contactar con el servidor de autenticación. Verifica tu conexión."
    );
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch (parseError) {
    // Ignore parsing errors when the server did not send JSON.
  }

  if (!response.ok) {
    const message =
      (payload && (payload.message || payload.error)) ||
      "Credenciales inválidas o error del servidor.";
    throw new Error(message);
  }

  return parseLoginResponse(payload, username);
};

export const getAuthenticatedUser = () => getValue(AUTH_STATE_KEY);

export const clearAuthentication = () => {
  setValue(AUTH_STATE_KEY, null);
};

export const promptLoginIfNeeded = () => {
  const existingSession = getAuthenticatedUser();
  if (existingSession) {
    return Promise.resolve(existingSession);
  }

  if (authPromise) {
    return authPromise;
  }

  authPromise = new Promise((resolve) => {
    const modal = createLoginModal({
      onSubmit: async ({ username, password }, controller) => {
        try {
          const authState = await performLoginRequest(username, password);
          persistAuthState(authState);
          controller.setError("");
          controller.setLoading(false);
          controller.close();
          resolve(authState);
        } catch (error) {
          controller.setError(error.message || "No se pudo iniciar sesión.");
          controller.setLoading(false);
        }
      },
    });

    // Focus on the username field when the modal opens.
    if (modal && typeof modal.focus === "function") {
      modal.focus();
    }
  })
    .finally(() => {
      authPromise = null;
    });

  return authPromise;
};
