(() => {
  const injectBundle = () => {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("page-script.js");
    script.async = false;
    script.onload = () => {
      script.remove();
      window.postMessage({ type: "MAGICBUYER_EXTENSION_READY" }, "*");
    };
    (document.head || document.documentElement).appendChild(script);
  };

  const forwardRequest = (event) => {
    if (event.source !== window || !event.data) {
      return;
    }

    const { type, id, options } = event.data;

    if (type !== "MAGICBUYER_EXTENSION_REQUEST" || !id || !options) {
      return;
    }

    chrome.runtime.sendMessage(
      { type: "MAGICBUYER_FETCH", id, options },
      (response) => {
        const message = {
          type: "MAGICBUYER_EXTENSION_RESPONSE",
          id,
        };

        if (chrome.runtime.lastError) {
          message.ok = false;
          message.error = chrome.runtime.lastError.message;
        } else if (!response) {
          message.ok = false;
          message.error = "No response from background script";
        } else {
          message.ok = response.ok;
          message.error = response.error;
          message.status = response.status;
          message.statusText = response.statusText;
          message.responseText = response.responseText;
          message.responseHeaders = response.responseHeaders;
        }

        window.postMessage(message, "*");
      }
    );
  };

  injectBundle();
  window.addEventListener("message", forwardRequest);
})();
