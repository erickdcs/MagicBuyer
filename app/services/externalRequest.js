import { isMarketAlertApp } from "../app.constants";
import { idSession } from "../elementIds.constants";
import { setValue } from "../services/repository";

export const sendExternalRequest = async (options = {}) => {
  if (isMarketAlertApp) {
    sendPhoneRequest(options);
  } else {
    sendWebRequest(options);
  }
};

const sendPhoneRequest = (options) => {
  const { onload, identifier, ...rest } = options;
  if (identifier) {
    setValue(identifier, onload);
  }
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: "fetchFromExternalAB",
      payload: { options: { ...rest, identifier } },
    })
  );
};

const sendWebRequest = (options) => {
  const {
    method,
    url,
    data,
    headers,
    responseType,
    timeout,
    onload,
    onerror,
    ontimeout,
  } = options;

  const requestHeaders = Object.assign({ "User-Agent": idSession }, headers || {});

  GM_xmlhttpRequest({
    method,
    url,
    data,
    headers: requestHeaders,
    responseType,
    timeout,
    onload,
    onerror,
    ontimeout,
  });
};
