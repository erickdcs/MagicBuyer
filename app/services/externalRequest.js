import { isMarketAlertApp } from "../app.constants";
import { idSession } from "../elementIds.constants";
import { setValue } from "../services/repository";
import { sendExtensionRequest } from "../utils/extensionBridge";

export const sendExternalRequest = async (options) => {
  if (isMarketAlertApp) {
    sendPhoneRequest(options);
  } else {
    sendWebRequest(options);
  }
};

const sendPhoneRequest = (options) => {
  setValue(options.identifier, options.onload);
  delete options["onload"];
  window.ReactNativeWebView.postMessage(
    JSON.stringify({ type: "fetchFromExternalAB", payload: { options } })
  );
};

const sendWebRequest = (options) => {
  sendExtensionRequest({
    method: options.method,
    url: options.url,
    headers: { "User-Agent": idSession },
  })
    .then((response) => {
      if (typeof options.onload === "function") {
        options.onload(response);
      }
    })
    .catch((error) => {
      console.error("MagicBuyer extension request failed", error);
    });
};
