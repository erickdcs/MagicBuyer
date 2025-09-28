import { setValue, getValue } from "../repository";
import { createApiAuthService } from "./apiAuthService";

import { resolveAuthConfig } from "./configResolver";
import { renderLoginOverlay } from "../../views/layouts/LoginView";

const AUTH_SESSION_KEY = "MagicBuyerAuthSession";
const DEFAULT_SESSION_TTL = 6 * 60 * 60 * 1000; // 6 horas
const REMEMBER_ME_SESSION_TTL = 24 * 60 * 60 * 1000; // 24 horas

let authServiceInstance;
let loginPromise;

const getAuthService = () => {
  if (!authServiceInstance) {
    const config = resolveAuthConfig();
    authServiceInstance = createApiAuthService(config);

  }
  return authServiceInstance;
};

const persistSession = (session, remember) => {
  const ttl = remember ? REMEMBER_ME_SESSION_TTL : DEFAULT_SESSION_TTL;
  setValue(AUTH_SESSION_KEY, {
    ...session,
    expiryTimeStamp: Date.now() + ttl,
  });
};

const describeFailure = (result) => {
  if (!result) {
    return "No se pudo validar las credenciales.";
  }

  if (result.message) {
    return result.message;
  }

  switch (result.reason) {
    case "TIMEOUT":
      return "La solicitud de autenticación tardó demasiado.";
    case "NETWORK_ERROR":
      return "No se pudo contactar con el servidor de autenticación.";
    case "INVALID_RESPONSE":
      return "La respuesta del servidor de autenticación no es válida.";
    default:
      return "No se pudo validar las credenciales.";

  }
};

export const clearStoredSession = () => {
  setValue(AUTH_SESSION_KEY, {
    expiryTimeStamp: Date.now() - 1000,
  });
};

export const ensureAuthenticated = () => {
  const storedSession = getValue(AUTH_SESSION_KEY);
  if (storedSession && storedSession.success) {
    return Promise.resolve(storedSession);
  }

  if (!loginPromise) {
    loginPromise = new Promise((resolve, reject) => {
      let loginView;
      try {
        loginView = renderLoginOverlay({
          onSubmit: async (credentials, helpers) => {
            const { username, password, remember } = credentials;
            const { setLoading, setError, clearPassword, focusUsername } = helpers;

            if (!username || !password) {
              setError("Introduce usuario y contraseña.");
              return;
            }

            setError("");
            setLoading(true);

            try {
              const authService = getAuthService();
              const result = await authService.login(username, password);

              if (result.success) {
                persistSession(result, remember);
                loginView.remove();
                resolve(result);
              } else {
                setError(describeFailure(result));
                setLoading(false);
                clearPassword();
                focusUsername();
              }
            } catch (error) {
              console.error("MagicBuyer login error", error);
              setError(
                error instanceof Error
                  ? error.message
                  : "Se produjo un error inesperado al iniciar sesión."
              );
              setLoading(false);
              clearPassword();
              focusUsername();
            }
          },
        });
      } catch (error) {
        console.error("MagicBuyer login view error", error);
        reject(error);
        return;
      }

      loginView.focus();
    }).finally(() => {
      loginPromise = null;
    });
  }

  return loginPromise;
};

if (typeof window !== "undefined") {
  window.MagicBuyerAuth = window.MagicBuyerAuth || {};
  window.MagicBuyerAuth.clearSession = clearStoredSession;
}
