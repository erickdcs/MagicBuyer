(() => {
  const SCRIPT_ID = "magicbuyer-page-script";
  if (document.getElementById(SCRIPT_ID)) {
    return;
  }

  const BACKGROUND_FETCH_REQUEST = "MAGIC_BUYER_BACKGROUND_FETCH";
  const BACKGROUND_FETCH_RESPONSE = "MAGIC_BUYER_BACKGROUND_FETCH_RESPONSE";

  const forwardToBackground = (payload) => {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          type: BACKGROUND_FETCH_REQUEST,
          payload,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
            return;
          }

          if (!response) {
            reject(new Error("No response from background"));
            return;
          }

          if (response.error) {
            reject(new Error(response.error));
            return;
          }

          resolve(response.data);
        }
      );
    });
  };

  const handlePageRequest = (event) => {
    if (event.source !== window || !event.data) {
      return;
    }

    const { type, id, payload } = event.data;
    if (type !== BACKGROUND_FETCH_REQUEST || !id) {
      return;
    }

    forwardToBackground(payload)
      .then((data) => {
        window.postMessage(
          {
            type: BACKGROUND_FETCH_RESPONSE,
            id,
            success: true,
            payload: data,
          },
          "*"
        );
      })
      .catch((error) => {
        window.postMessage(
          {
            type: BACKGROUND_FETCH_RESPONSE,
            id,
            success: false,
            error: error?.message || "Background request failed",
          },
          "*"
        );
      });
  };

  window.addEventListener("message", handlePageRequest);

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.src = chrome.runtime.getURL("dist/magicbuyer.js");
  script.type = "text/javascript";
  script.onload = () => {
    script.remove();
  };

  (document.head || document.documentElement).appendChild(script);
})();
