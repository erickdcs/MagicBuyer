import { isMarketAlertApp } from "../app.constants";
import { setValue } from "../services/repository";
import { backgroundFetch } from "./backgroundBridge";

export const sendExternalRequest = async (options) => {
  if (isMarketAlertApp) {
    sendPhoneRequest(options);
  } else {
    await sendWebRequest(options);
  }
};

const sendPhoneRequest = (options) => {
  setValue(options.identifier, options.onload);
  delete options["onload"];
  window.ReactNativeWebView.postMessage(
    JSON.stringify({ type: "fetchFromExternalAB", payload: { options } })
  );
};

const sendWebRequest = async (options) => {
  try {
    const response = await backgroundFetch({
      method: options.method,
      url: options.url,
      headers: options.headers,
      body: options.data,
    });

    options.onload?.({
      status: response.status,
      response: response.body,
      responseText: response.body,
      responseHeaders: response.headersRaw,
    });
  } catch (error) {
    if (options.onerror) {
      options.onerror(error);
    } else {
      console.error("Failed to perform external request", error);
    }
  }
};
