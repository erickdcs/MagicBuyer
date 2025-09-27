const BACKGROUND_FETCH_REQUEST = "MAGIC_BUYER_BACKGROUND_FETCH";
const BACKGROUND_FETCH_RESPONSE = "MAGIC_BUYER_BACKGROUND_FETCH_RESPONSE";

let requestCounter = 0;

export const backgroundFetch = (requestOptions) => {
  return new Promise((resolve, reject) => {
    const requestId = `${BACKGROUND_FETCH_REQUEST}_${Date.now()}_${requestCounter++}`;

    const handleResponse = (event) => {
      if (event.source !== window || !event.data) {
        return;
      }

      const { type, id, success, payload, error } = event.data;
      if (type !== BACKGROUND_FETCH_RESPONSE || id !== requestId) {
        return;
      }

      window.removeEventListener("message", handleResponse);

      if (!success) {
        reject(new Error(error || "Background fetch failed"));
        return;
      }

      resolve(payload);
    };

    window.addEventListener("message", handleResponse);

    window.postMessage(
      {
        type: BACKGROUND_FETCH_REQUEST,
        id: requestId,
        payload: requestOptions,
      },
      "*"
    );
  });
};

export { BACKGROUND_FETCH_REQUEST, BACKGROUND_FETCH_RESPONSE };
