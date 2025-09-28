import { sendExternalRequest } from "../externalRequest";

const DEFAULT_ENDPOINT = "http://localhost:3030/api/login";
const DEFAULT_TIMEOUT = 15000;

const getStoredEndpoint = () => {
  try {
    if (typeof GM_getValue === "function") {
      const stored = GM_getValue("magicbuyer.auth.endpoint");
      if (stored) {
        return stored;
      }
    }
  } catch (err) {
    // Ignore Tampermonkey storage errors.
  }
  return null;
};

const getLoginEndpoint = () => {
  const globalValue =
    (typeof window !== "undefined" && window.MAGIC_BUYER_AUTH_ENDPOINT) || null;
  const stored = getStoredEndpoint();
  return globalValue || stored || DEFAULT_ENDPOINT;
};

export const authenticateUser = (username, password) =>
  new Promise((resolve, reject) => {
    const endpoint = getLoginEndpoint();
    if (!endpoint) {
      const error = new Error("No se ha configurado un endpoint de autenticación.");
      reject(error);
      return;
    }

    sendExternalRequest({
      method: "POST",
      url: endpoint,
      data: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
      timeout: DEFAULT_TIMEOUT,
      onload: (response) => {
        const { responseText = "", status } = response || {};
        try {
          const parsed = responseText ? JSON.parse(responseText) : {};
          if (status && status >= 200 && status < 300) {
            resolve(parsed);
            return;
          }
          const reason = parsed.reason || "ERROR";
          const message =
            parsed.message ||
            (status === 401
              ? "Credenciales inválidas."
              : "No se pudo iniciar sesión.");
          resolve({ ...parsed, success: false, reason, message });
        } catch (error) {
          reject(
            new Error("El servidor de autenticación devolvió una respuesta inválida.")
          );
        }
      },
      onerror: () => {
        reject(new Error("No se pudo contactar con el servidor de autenticación."));
      },
      ontimeout: () => {
        reject(new Error("El intento de inicio de sesión excedió el tiempo de espera."));
      },
    });
  });

export const storeLoginEndpoint = (endpoint) => {
  try {
    if (typeof GM_setValue === "function" && endpoint) {
      GM_setValue("magicbuyer.auth.endpoint", endpoint);
    }
  } catch (err) {
    // Ignore Tampermonkey storage errors.
  }
};
