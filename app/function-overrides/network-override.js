import { backgroundFetch } from "../services/backgroundBridge";

const defaultFetch = window.fetch.bind(window);

const shouldUseBackgroundFetch = (request, options = {}) => {
  const url = typeof request === "string" ? request : request?.url || "";
  const method = options.method || (typeof request === "object" && request?.method);
  if (!url) {
    return false;
  }
  return (
    (/discordapp/.test(url) || /exp.host/.test(url)) &&
    (method === "POST" || method === "DELETE")
  );
};

window.fetch = async function (request, options = {}) {
  if (!shouldUseBackgroundFetch(request, options)) {
    return defaultFetch(request, options);
  }

  const url = typeof request === "string" ? request : request.url;
  const method = options.method || (typeof request === "object" && request.method) || "GET";

  try {
    const responseData = await backgroundFetch({
      method,
      url,
      headers: options.headers,
      body: options.body,
      credentials: options.credentials,
    });

    if (responseData.status === 200 || responseData.status === 204) {
      return new Response(responseData.body ?? "", {
        status: responseData.status,
        statusText: responseData.statusText,
        headers: responseData.headers,
      });
    }

    const error = new Error(`Request failed with status ${responseData.status}`);
    error.response = responseData;
    throw error;
  } catch (err) {
    return Promise.reject(err);
  }
};
