const toErrorMessage = (value, fallback) => {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch (error) {
    return fallback;
  }
};

const getValueByPath = (object, path) => {
  if (!path) {
    return undefined;
  }

  if (!object || typeof object !== "object") {
    return undefined;
  }

  return path.split(".").reduce((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return current[key];
    }
    return undefined;
  }, object);
};

const normalizeHeaders = (headers, method) => {
  if (!headers) {
    return method === "GET" ? {} : { "Content-Type": "application/json" };
  }

  if (headers instanceof Headers) {
    const result = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  if (typeof headers !== "object") {
    throw new Error(
      "`headers` must be an object compatible with the Fetch API when configuring the authentication service."
    );
  }

  const normalized = method === "GET" ? {} : { "Content-Type": "application/json" };
  return Object.assign(normalized, headers);
};

const normalizeExtraBody = (extraBody) => {
  if (!extraBody) {
    return {};
  }

  if (typeof extraBody !== "object") {
    throw new Error(
      "`extraBody` must be an object if provided in the authentication configuration."
    );
  }

  return { ...extraBody };
};

const interpretSuccess = (response, data, successPath) => {
  if (!successPath) {
    return response.ok;
  }

  const value = getValueByPath(data, successPath);
  if (value === undefined) {
    return response.ok;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  return Boolean(value);
};

const parseResponseBody = async (response, responseType) => {
  const normalizedType = responseType || "json";

  if (normalizedType === "json") {
    const text = await response.text();
    if (!text) {
      return {};
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      throw new Error("La respuesta de autenticación no contiene JSON válido.");
    }
  }

  if (normalizedType === "text") {
    return response.text();
  }

  throw new Error(
    "responseType solo puede ser 'json' o 'text' en la configuración de autenticación."
  );
};

export const createApiAuthService = (config = {}) => {
  const {
    endpoint,
    method = "POST",
    headers,
    successPath = "success",
    userPath = "user",
    messagePath = "message",
    tokenPath,
    extraBody,
    credentials,
    mode,
    responseType = "json",
    timeout,
  } = config;

  if (!endpoint || typeof endpoint !== "string") {
    throw new Error(
      "Debes proporcionar un `endpoint` válido en la configuración de autenticación."
    );
  }

  const normalizedMethod = typeof method === "string" ? method.toUpperCase() : "POST";
  if (!normalizedMethod || typeof normalizedMethod !== "string") {
    throw new Error("`method` debe ser un string válido en la configuración de autenticación.");
  }

  if (normalizedMethod === "GET") {
    throw new Error(
      "Por motivos de seguridad, el servicio de autenticación no admite solicitudes GET. Usa POST u otro método con cuerpo."
    );
  }

  const normalizedHeaders = normalizeHeaders(headers, normalizedMethod);
  const normalizedExtraBody = normalizeExtraBody(extraBody);

  const login = async (username, password) => {
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const abortTimeout =
      controller && typeof timeout === "number" && timeout > 0
        ? setTimeout(() => controller.abort(), timeout)
        : null;

    try {
      const payload = {
        username,
        password,
        ...normalizedExtraBody,
      };

      const requestInit = {
        method: normalizedMethod,
        headers: normalizedHeaders,
        body: JSON.stringify(payload),
      };

      if (credentials) {
        requestInit.credentials = credentials;
      }

      if (mode) {
        requestInit.mode = mode;
      }

      if (controller) {
        requestInit.signal = controller.signal;
      }

      let response;
      try {
        response = await fetch(endpoint, requestInit);
      } catch (error) {
        if (error && error.name === "AbortError") {
          return {
            success: false,
            reason: "TIMEOUT",
            message: "La solicitud de autenticación excedió el tiempo máximo de espera.",
          };
        }

        return {
          success: false,
          reason: "NETWORK_ERROR",
          message: toErrorMessage(error, "No se pudo conectar con el servidor de autenticación."),
        };
      }

      let body;
      try {
        body = await parseResponseBody(response, responseType);
      } catch (error) {
        return {
          success: false,
          reason: "INVALID_RESPONSE",
          message: toErrorMessage(
            error,
            "El servidor de autenticación devolvió una respuesta que no se pudo interpretar."
          ),
          status: response.status,
        };
      }

      const isSuccess = interpretSuccess(response, body, successPath);
      if (!isSuccess) {
        return {
          success: false,
          reason: "INVALID_CREDENTIALS",
          message:
            toErrorMessage(
              messagePath ? getValueByPath(body, messagePath) : null,
              response.ok
                ? "Las credenciales proporcionadas no son válidas."
                : `Error de autenticación (${response.status}).`
            ) || "Las credenciales proporcionadas no son válidas.",
          status: response.status,
          payload: body,
        };
      }

      return {
        success: true,
        user: userPath ? getValueByPath(body, userPath) : undefined,
        token: tokenPath ? getValueByPath(body, tokenPath) : undefined,
        payload: body,
        status: response.status,
      };
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
  };

  return { login };
};
