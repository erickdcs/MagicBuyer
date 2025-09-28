import { sendExtensionRequest } from "../utils/extensionBridge";

const defaultFetch = window.fetch;
window.fetch = function (request, options = {}) {
  if (
    request &&
    (/discordapp/.test(request) || /exp.host/.test(request)) &&
    (options.method === "POST" || options.method === "DELETE")
  ) {
    return new Promise((resolve, reject) => {
      const headers = Object.assign({}, options.headers, {
        "User-Agent": "From Node",
      });

      sendExtensionRequest({
        method: options.method,
        headers,
        url: request,
        data: options.body,
      })
        .then((res) => {
          if (res.status === 200 || res.status === 204) {
            res.text = () => Promise.resolve(res.responseText);
            if (!res.headers || !(res.headers instanceof Map)) {
              res.headers = res.responseHeaders
                .split("\r\n")
                .filter(Boolean)
                .reduce((acc, current) => {
                  const [name, ...valueParts] = current.split(": ");
                  if (name) {
                    acc.set(name, valueParts.join(": "));
                  }
                  return acc;
                }, new Map());
            }
            resolve(res);
          } else {
            reject(res);
          }
        })
        .catch(reject);
    });
  }
  const response = defaultFetch.call(this, request, options);
  return response;
};
