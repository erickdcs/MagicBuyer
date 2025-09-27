const BACKGROUND_FETCH_REQUEST = "MAGIC_BUYER_BACKGROUND_FETCH";

const buildFetchHeaders = (headers = {}) => {
  const requestHeaders = new Headers();
  Object.entries(headers).forEach(([key, value]) => {
    try {
      if (typeof value !== "undefined") {
        requestHeaders.append(key, value);
      }
    } catch (err) {
      console.warn(`Skipping header ${key}: ${err?.message || err}`);
    }
  });
  return requestHeaders;
};

const serializeHeaders = (headers) => {
  const headerMap = {};
  const headerLines = [];
  headers.forEach((value, key) => {
    headerMap[key] = value;
    headerLines.push(`${key}: ${value}`);
  });
  return {
    map: headerMap,
    raw: headerLines.join("\r\n"),
  };
};

const handleBackgroundFetch = async (payload) => {
  const options = {
    method: payload.method || "GET",
  };

  if (payload.headers) {
    options.headers = buildFetchHeaders(payload.headers);
  }

  if (payload.body !== undefined) {
    options.body = payload.body;
  }

  if (payload.credentials) {
    options.credentials = payload.credentials;
  }

  const response = await fetch(payload.url, options);
  const text = await response.text();
  const headers = serializeHeaders(response.headers);

  return {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    body: text,
    headers: headers.map,
    headersRaw: headers.raw,
  };
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== BACKGROUND_FETCH_REQUEST) {
    return false;
  }

  handleBackgroundFetch(message.payload)
    .then((data) => {
      sendResponse({ data });
    })
    .catch((error) => {
      sendResponse({ error: error?.message || "Unknown background fetch error" });
    });

  return true;
});
