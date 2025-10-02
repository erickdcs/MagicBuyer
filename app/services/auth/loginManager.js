import { setValue, getValue } from "../repository";
import { authenticateUser } from "./loginService";
import { createLoginOverlay } from "../../views/layouts/LoginOverlay";

const AUTH_SESSION_KEY = "MagicBuyerAuthSession";
const DEFAULT_SESSION_TTL = 60 * 60 * 1000; // 1 hour

const readSession = () => {
  const session = getValue(AUTH_SESSION_KEY);
  if (!session) {
    return null;
  }
  if (session.expiryTimeStamp && session.expiryTimeStamp < Date.now()) {
    return null;
  }
  return session;
};

export const isAuthenticated = () => Boolean(readSession());

export const getAuthenticatedSession = () => readSession();

export const getAuthenticatedUser = () => {
  const session = readSession();
  return session && session.user ? session.user : null;
};

const persistSession = ({ user, token, ttl, ttlMs }) => {
  const normalizedTtlMs = Number.isFinite(ttlMs)
    ? ttlMs
    : Number.isFinite(ttl)
    ? ttl * 1000
    : DEFAULT_SESSION_TTL;
  setValue(AUTH_SESSION_KEY, {
    authenticated: true,
    user,
    token,
    expiryTimeStamp: Date.now() + normalizedTtlMs,
  });
};

export const clearSession = () => {
  setValue(AUTH_SESSION_KEY, null);
};

export const requireAuthentication = () => {
  const existing = readSession();
  if (existing) {
    return Promise.resolve(existing);
  }

  return new Promise((resolve) => {
    const overlay = createLoginOverlay({
      onSubmit: async ({ username, password }, controls) => {
        if (!username || !password) {
          controls.showError("Ingresa usuario y contraseña.");
          return;
        }

        try {
          /*controls.setLoading(true);
          const result = await authenticateUser(username, password);

            if (!result || result.success === false) {
              const reason = result && result.reason;
              const message =
                (result && result.message) ||
                (reason === "USER_NOT_FOUND"
                  ? "Usuario no encontrado."
                  : reason === "INVALID_PASSWORD"
                  ? "Contraseña incorrecta."
                  : "No fue posible iniciar sesión.");
            controls.showError(message);
            return;
          }*/

          //persistSession(result);
          controls.showSuccess("Sesión iniciada correctamente.");

          setTimeout(() => {
            controls.destroy();
            //resolve(readSession());
          }, 600);
        } catch (error) {
          controls.showError(error.message);
        } finally {
          controls.setLoading(false);
        }
      },
    });

    overlay.mount();
  });
};
