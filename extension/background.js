const toHeaderString = (headers) => {
  const headerLines = [];
  headers.forEach((value, key) => {
    headerLines.push(`${key}: ${value}`);
  });
  return headerLines.join("\r\n");
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || message.type !== "MAGICBUYER_FETCH") {
    return false;
  }

  const { options } = message;

  if (!options || !options.url) {
    sendResponse({ ok: false, error: "Missing request url" });
    return false;
  }

  const requestInit = {
    method: options.method || "GET",
    headers: options.headers || {},
  };

  if (options.data && requestInit.method !== "GET") {
    requestInit.body = options.data;
  }

  fetch(options.url, requestInit)
    .then(async (response) => {
      const responseText = await response.text();
      sendResponse({
        ok: true,
        status: response.status,
        statusText: response.statusText,
        responseText,
        responseHeaders: toHeaderString(response.headers),
      });
    })
    .catch((error) => {
      sendResponse({ ok: false, error: error.message || "Network request failed" });
    });

  return true;
});
