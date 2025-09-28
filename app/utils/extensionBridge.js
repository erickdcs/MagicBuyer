const RESPONSE_EVENT = "MAGICBUYER_EXTENSION_RESPONSE";
const REQUEST_EVENT = "MAGICBUYER_EXTENSION_REQUEST";
const READY_EVENT = "MAGICBUYER_EXTENSION_READY";

let bridgeReady = false;
let requestCounter = 0;
const pendingRequests = new Map();

const sanitizeHeaders = (headers) => {
  if (!headers) {
    return "";
  }
  return headers;
};

const parseHeaders = (headersString) => {
  if (!headersString) {
    return new Map();
  }

  return headersString
    .split("\r\n")
    .filter(Boolean)
    .reduce((accumulator, current) => {
      const [name, ...rest] = current.split(": ");
      if (!name) {
        return accumulator;
      }
      accumulator.set(name, rest.join(": "));
      return accumulator;
    }, new Map());
};

const buildResponse = (payload) => {
  const responseHeaders = sanitizeHeaders(payload.responseHeaders);

  return {
    status: payload.status,
    statusText: payload.statusText,
    response: payload.responseText,
    responseText: payload.responseText,
    responseHeaders,
    headers: parseHeaders(responseHeaders),
    text: () => Promise.resolve(payload.responseText ?? ""),
  };
};

window.addEventListener("message", (event) => {
  if (event.source !== window || !event.data) {
    return;
  }

  const { type, id } = event.data;

  if (type === READY_EVENT) {
    bridgeReady = true;
    return;
  }

  if (type !== RESPONSE_EVENT || !id) {
    return;
  }

  const pendingRequest = pendingRequests.get(id);

  if (!pendingRequest) {
    return;
  }

  pendingRequests.delete(id);
  clearTimeout(pendingRequest.timeoutId);

  if (!event.data.ok) {
    const errorMessage = event.data.error || "Extension request failed";
    pendingRequest.reject(new Error(errorMessage));
    return;
  }

  pendingRequest.resolve(buildResponse(event.data));
});

export const isBridgeReady = () => bridgeReady;

export const sendExtensionRequest = (options, timeout = 15000) =>
  new Promise((resolve, reject) => {
    const id = `magicbuyer-${Date.now()}-${requestCounter++}`;

    const timeoutId = setTimeout(() => {
      pendingRequests.delete(id);
      reject(new Error("Extension request timed out"));
    }, timeout);

    pendingRequests.set(id, { resolve, reject, timeoutId });

    window.postMessage(
      {
        type: REQUEST_EVENT,
        id,
        options,
      },
      "*"
    );
  });
