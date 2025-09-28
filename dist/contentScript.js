// contentScript.js
(() => {
  // ---------- Constantes y tipos de mensaje ----------
  const IDS = {
    PAGE_SCRIPT: "magicbuyer-page-script",
    DISCORD_SDK: "magicbuyer-discord-sdk",
  };

  // Canal popup <-> contentScript
  const POPUP_MESSAGES = {
    OPEN_SETTINGS: "MB_OPEN_SETTINGS",
  };

  // Canal contentScript <-> background (relay solicitado por el page)
  const BG = {
    REQ: "MAGIC_BUYER_BACKGROUND_FETCH",
    RES: "MAGIC_BUYER_BACKGROUND_FETCH_RESPONSE",
  };

  // Canal contentScript <-> page (tu bridge ya usa estos)
  const PAGE = {
    REQ: "MAGIC_BUYER_PAGE_COMMAND",
    RES: "MAGIC_BUYER_PAGE_COMMAND_RESPONSE",
    READY: "MAGIC_BUYER_PAGE_READY",
  };

  // ---------- Utils ----------
  const log = (...args) => console.log("%c[MagicBuyer CS]", "color:#7dd3fc", ...args);
  const warn = (...args) => console.warn("%c[MagicBuyer CS]", "color:#fbbf24", ...args);
  const err  = (...args) => console.error("%c[MagicBuyer CS]", "color:#f87171", ...args);

  const once = (fn) => {
    let ran = false, val;
    return (...a) => (ran ? val : (ran = true, (val = fn(...a))));
  };

  // ---------- Inyección del script de PÁGINA ----------
  // Este script (page.bundle.js) corre en el contexto de la página,
  // donde existen los controladores UT y tus layouts del repo dev.
  const injectPageScript = (id, path) =>
    new Promise((resolve, reject) => {
      if (document.getElementById(id)) return resolve("already");
      const s = document.createElement("script");
      s.id = id;
      s.src = chrome.runtime.getURL(path);
      s.type = "text/javascript";
      s.onload = () => { s.remove(); resolve("loaded"); };
      s.onerror = () => { s.remove(); reject(new Error(`Failed to load ${path}`)); };
      (document.head || document.documentElement).appendChild(s);
    });

  const injectAll = once(async () => {
    // 1) Carga opcional: Discord SDK (si lo necesita tu page)
    try {
      await injectPageScript(IDS.DISCORD_SDK, "external/discord.11.4.2.min.js");
      log("Discord SDK injected.");
    } catch (e) {
      warn("Unable to inject Discord SDK:", e?.message);
    }

    // 2) Carga principal: page.bundle.js (tu lógica dev en page context)
    try {
      await injectPageScript(IDS.PAGE_SCRIPT, "dist/page.bundle.js");
      log("Page bundle injected.");
    } catch (e) {
      // Fallback por compatibilidad con builds anteriores (magicbuyer.js)
      warn("page.bundle.js failed, trying magicbuyer.js fallback…");
      await injectPageScript(IDS.PAGE_SCRIPT, "dist/magicbuyer.js");
      log("Fallback bundle injected (magicbuyer.js).");
    }
  });

  // ---------- Handshake con el script de página ----------
  let pageReady = false;
  let pageReadyResolvers = [];

  const waitForPageReady = (timeoutMs = 6000) =>
    new Promise((resolve, reject) => {
      if (pageReady) return resolve(true);
      pageReadyResolvers.push(resolve);
      const to = setTimeout(() => {
        // Limpia el resolver si no se llamó
        pageReadyResolvers = pageReadyResolvers.filter((r) => r !== resolve);
        reject(new Error("Page script not ready (timeout). Open the UT web app and try again."));
      }, timeoutMs);

      // Cuando se resuelva, limpiamos el timeout
      const wrapped = (val) => {
        clearTimeout(to);
        resolve(val);
      };
      pageReadyResolvers[pageReadyResolvers.length - 1] = wrapped;
    });

  // El page.bundle.js debe postear esto cuando termine boot:
  // window.postMessage({ type: "MAGIC_BUYER_PAGE_READY" }, "*");
  window.addEventListener("message", (ev) => {
    if (ev.source !== window || !ev.data) return;
    if (ev.data.type === PAGE.READY) {
      pageReady = true;
      pageReadyResolvers.splice(0).forEach((r) => r(true));
      log("Page reports READY.");
    }
  });

  // ---------- Puente page <-> background ----------
  // El script de página no puede usar chrome.runtime directamente (seguro),
  // así que nos pide a nosotros (content script) que relayemos.
  const forwardToBackground = (payload) =>
    new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage({ type: BG.REQ, payload }, (response) => {
          if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
          if (!response) return reject(new Error("No response from background"));
          if (response.error) return reject(new Error(response.error));
          resolve(response.data);
        });
      } catch (e) {
        reject(e);
      }
    });

  // El page nos pide background-fetch usando postMessage; respondemos también por postMessage.
  const handlePageBackgroundRequests = (event) => {
    if (event.source !== window || !event.data) return;
    const { type, id, payload } = event.data || {};
    if (type !== BG.REQ || !id) return;

    forwardToBackground(payload)
      .then((data) => {
        window.postMessage({ type: BG.RES, id, success: true, payload: data }, "*");
      })
      .catch((error) => {
        window.postMessage({ type: BG.RES, id, success: false, error: String(error?.message || error) }, "*");
      });
  };
  window.addEventListener("message", handlePageBackgroundRequests);

  // ---------- Puente popup <-> page (comandos) ----------
  // Cola de comandos si el page aún no está listo:
  const pendingPageCommands = [];
  const sendPageCommand = async (payload, timeoutMs = 6000) => {
    await injectAll();
    if (!pageReady) {
      // encolamos hasta que el page diga READY
      return new Promise((resolve, reject) => {
        pendingPageCommands.push({ payload, resolve, reject, timeoutMs });
        // también disparamos la espera por si nadie la espera
        waitForPageReady(timeoutMs).catch(reject);
      });
    }
    return sendPageCommandNow(payload, timeoutMs);
  };

  const sendPageCommandNow = (payload, timeoutMs) =>
    new Promise((resolve, reject) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const onResp = (ev) => {
        if (ev.source !== window || !ev.data) return;
        const { type, id: respId, success, payload: res, error } = ev.data || {};
        if (type !== PAGE.RES || respId !== id) return;
        window.removeEventListener("message", onResp);
        success ? resolve(res) : reject(new Error(error || "Page command failed"));
      };
      window.addEventListener("message", onResp);

      // timeout
      const to = setTimeout(() => {
        window.removeEventListener("message", onResp);
        reject(new Error("Page command timeout"));
      }, timeoutMs);

      // post
      window.postMessage({ type: PAGE.REQ, id, payload }, "*");

      // Si resuelve/rechaza, limpiamos timeout
      const wrap = (fn) => (v) => { clearTimeout(to); fn(v); };
      resolve = wrap(resolve);
      reject  = wrap(reject);
    });

  // Cuando el page esté listo, vaciamos la cola
  const flushPendingWhenReady = async () => {
    try {
      await waitForPageReady();
      while (pendingPageCommands.length) {
        const item = pendingPageCommands.shift();
        sendPageCommandNow(item.payload, item.timeoutMs).then(item.resolve).catch(item.reject);
      }
    } catch (e) {
      // si nunca se marcó READY, rechazamos todos
      while (pendingPageCommands.length) {
        const item = pendingPageCommands.shift();
        item.reject(e);
      }
    }
  };
  // Si se marca READY, dispara flush
  window.addEventListener("message", (ev) => {
    if (ev.source !== window || !ev.data) return;
    if (ev.data.type === PAGE.READY) flushPendingWhenReady();
  });

  // ---------- Listener desde el popup ----------
  chrome.runtime.onMessage.addListener((msg, _sender, _sendResponse) => {
    if (msg?.type === POPUP_MESSAGES.OPEN_SETTINGS) {
      // Abre la pestaña MagicBuyer y muestra Settings (layouts del dev)
      sendPageCommand({ command: "openSettings" })
        .then(() => log("openSettings dispatched"))
        .catch((e) => err("openSettings failed:", e?.message || e));
    }
    // NOTA: devolver true sólo si vas a usar sendResponse async
    return false;
  });

  // ---------- (Opcional) Relay genérico popup -> page ----------
  // Permite que el popup envíe cualquier PAGE_COMMAND_REQUEST vía chrome.runtime
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type !== PAGE.REQ) return false;

    sendPageCommand(message.payload)
      .then((res) => sendResponse({ success: true, payload: res }))
      .catch((e) => sendResponse({ success: false, error: String(e?.message || e) }));

    return true; // respuesta async
  });

  // ---------- Bootstrap ----------
  // Inyecta en cuanto cargue el DOM (por si el usuario pulsa muy rápido el popup)
  const boot = async () => {
    try {
      await injectAll();
      // no esperamos READY aquí; se hará on-demand con cola
      log("Content script boot OK.");
    } catch (e) {
      err("Content script boot failed:", e?.message || e);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
