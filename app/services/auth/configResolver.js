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
      "No se encontró la configuración de autenticación. Define `window.MAGICBUYER_AUTH_CONFIG` con el endpoint del servicio de login."
    );
  }

  const { endpoint } = runtimeConfig;

  if (!endpoint || typeof endpoint !== "string") {
    throw new Error(
      "La configuración de autenticación debe incluir una propiedad `endpoint` con la URL del servicio." 
    );
  }

  const {
    method,
    headers,
    successPath,
    userPath,
    messagePath,
    tokenPath,
    extraBody,
    credentials,
    mode,
    responseType,
    timeout,
  } = runtimeConfig;

  return {
    endpoint,
    method,
    headers,
    successPath,
    userPath,
    messagePath,
    tokenPath,
    extraBody,
    credentials,
    mode,
    responseType,
    timeout,
  };
};

export const getConfigGlobalKey = () => CONFIG_GLOBAL_KEY;
