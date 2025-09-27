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

  const DISCORD_SCRIPT_ID = "magicbuyer-discord-sdk";

  const injectPageScript = (scriptId, relativePath) => {
    return new Promise((resolve, reject) => {
      if (document.getElementById(scriptId)) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.id = scriptId;
      script.src = chrome.runtime.getURL(relativePath);
      script.type = "text/javascript";
      script.onload = () => {
        script.remove();
        resolve();
      };
      script.onerror = () => {
        script.remove();
        reject(new Error(`Failed to load ${relativePath}`));
      };

      (document.head || document.documentElement).appendChild(script);
    });
  };

  injectPageScript(DISCORD_SCRIPT_ID, "external/discord.11.4.2.min.js")
    .catch((error) => {
      console.warn("MagicBuyer: unable to preload Discord SDK", error);
    })
    .finally(() => {
      injectPageScript(SCRIPT_ID, "dist/magicbuyer.js").catch((error) => {
        console.error("MagicBuyer: failed to inject bundle", error);
      });
    });
})();
