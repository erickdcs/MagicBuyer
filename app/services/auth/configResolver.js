const CONFIG_GLOBAL_KEY = "MAGICBUYER_AUTH_CONFIG";

const tryParseJSON = (value) => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  }
  return value && typeof value === "object" ? value : null;
};

const getRuntimeConfig = () => {
  const globalScope =
    (typeof unsafeWindow !== "undefined" && unsafeWindow) ||
    (typeof window !== "undefined" && window) ||
    (typeof globalThis !== "undefined" && globalThis);

  if (globalScope && globalScope[CONFIG_GLOBAL_KEY]) {
    return tryParseJSON(globalScope[CONFIG_GLOBAL_KEY]);
  }

  if (typeof GM_getValue === "function") {
    const storedConfig = GM_getValue(CONFIG_GLOBAL_KEY);
    if (storedConfig) {
      return tryParseJSON(storedConfig);
    }
  }

  return null;
};

export const resolveAuthConfig = () => {
  const runtimeConfig = getRuntimeConfig();
  if (!runtimeConfig || typeof runtimeConfig !== "object") {
    throw new Error(
      "No se encontró la configuración de autenticación. Define `window.MAGICBUYER_AUTH_CONFIG` con los datos de conexión MySQL."
    );
  }

  const { connection, options = {} } = runtimeConfig;

  if (!connection || typeof connection !== "object") {
    throw new Error(
      "La configuración de autenticación debe incluir un objeto `connection` válido."
    );
  }

  return { connection, options };
};

export const getConfigGlobalKey = () => CONFIG_GLOBAL_KEY;
