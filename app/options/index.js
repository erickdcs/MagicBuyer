// app/options/index.js

// ---- Utilidades de almacenamiento (sync con fallback a local) ----
const storage = {
  get(keys) {
    return new Promise((resolve) => {
      const area = chrome.storage?.sync ?? chrome.storage?.local;
      area.get(keys, (items) => resolve(items || {}));
    });
  },
  set(items) {
    return new Promise((resolve, reject) => {
      const area = chrome.storage?.sync ?? chrome.storage?.local;
      area.set(items, () => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        else resolve();
      });
    });
  },
  remove(keys) {
    return new Promise((resolve, reject) => {
      const area = chrome.storage?.sync ?? chrome.storage?.local;
      area.remove(keys, () => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        else resolve();
      });
    });
  }
};

// ---- Claves de configuración (ajústalas a tus necesidades reales) ----
const DEFAULTS = {
  enabled: false,
  theme: "dark",            // "dark" | "light" | "system"
  searchIntervalMs: 1200,   // intervalo entre peticiones
  defaultFilter: "",        // nombre del filtro por defecto
};

const KEYS = Object.keys(DEFAULTS);

// ---- Helpers UI ----
function $(sel) { return document.querySelector(sel); }

function showToast(msg, type = "info") {
  const toast = document.createElement("div");
  toast.className = `mb-toast mb-toast--${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  // animate in
  requestAnimationFrame(() => toast.classList.add("is-visible"));
  // auto remove
  setTimeout(() => {
    toast.classList.remove("is-visible");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// ---- Carga inicial de opciones ----
async function loadOptions() {
  const saved = await storage.get(KEYS);
  const cfg = { ...DEFAULTS, ...saved };

  $("#opt-enabled").checked = !!cfg.enabled;
  $("#opt-theme").value = cfg.theme;
  $("#opt-interval").value = String(cfg.searchIntervalMs);
  // Rellenar lista de filtros (si los tienes en storage)
  await populateFilters(cfg.defaultFilter);
}

// Simula rellenar el select de filtros (puedes traerlos de storage o de API)
async function populateFilters(active) {
  const select = $("#opt-default-filter");
  select.innerHTML = "";

  // 1) podrías cargar filtros guardados en storage si ya los guardas ahí:
  const { savedFilters = [] } = await storage.get(["savedFilters"]);
  // Si no hay nada, muestra placeholders:
  const items = savedFilters.length ? savedFilters : ["", "Snipers", "BPM Low", "TradeList"];

  for (const name of items) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name || "— None —";
    select.appendChild(opt);
  }
  if (active != null) select.value = active;
}

// ---- Guardar opciones ----
async function saveOptions() {
  try {
    const enabled = $("#opt-enabled").checked;
    const theme = $("#opt-theme").value;
    let searchIntervalMs = parseInt($("#opt-interval").value, 10);
    const defaultFilter = $("#opt-default-filter").value;

    // Validación básica
    if (!["dark", "light", "system"].includes(theme)) {
      showToast("Tema inválido.", "error");
      return;
    }
    if (Number.isNaN(searchIntervalMs)) {
      showToast("Intervalo inválido.", "error");
      return;
    }
    // Reglas: mínimo 300ms, máximo 10s
    searchIntervalMs = clamp(searchIntervalMs, 300, 10000);

    await storage.set({ enabled, theme, searchIntervalMs, defaultFilter });
    showToast("Settings saved", "success");
  } catch (err) {
    console.error(err);
    showToast("Error saving settings", "error");
  }
}

// ---- Reset a valores por defecto ----
async function resetOptions() {
  try {
    await storage.remove(KEYS);          // elimina claves
    await storage.set({ ...DEFAULTS });  // guarda defaults
    await loadOptions();                 // recarga UI
    showToast("Settings reset", "success");
  } catch (err) {
    console.error(err);
    showToast("Error resetting", "error");
  }
}

// ---- Listeners ----
function bindEvents() {
  $("#btn-save")?.addEventListener("click", (e) => {
    e.preventDefault();
    saveOptions();
  });

  $("#btn-reset")?.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Restore default settings?")) resetOptions();
  });

  // Accesibilidad/UX: Enter guarda si el foco está en un input
  document.addEventListener("keydown", (e) => {
    const el = document.activeElement;
    const isFormEl = el && (el.tagName === "INPUT" || el.tagName === "SELECT");
    if (isFormEl && e.key === "Enter") {
      e.preventDefault();
      saveOptions();
    }
  });
}

// ---- Bootstrap ----
function injectBaseStyles() {
  const css = `
    :root { color-scheme: light dark; }
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 0; padding: 24px; }
    .wrap { max-width: 860px; margin: 0 auto; }
    h1 { margin: 0 0 16px; font-size: 20px; }
    .card { background: rgba(0,0,0,0.05); border-radius: 10px; padding: 16px; margin-bottom: 16px; }
    .row { display: grid; grid-template-columns: 240px 1fr; gap: 12px; align-items: center; margin-bottom: 12px; }
    label { font-weight: 600; }
    input[type="number"], select { width: 220px; padding: 8px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.2); }
    .actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
    .btn { padding: 8px 12px; border-radius: 8px; border: 0; cursor: pointer; }
    .btn-primary { background: #2563eb; color: #fff; }
    .btn-secondary { background: #374151; color: #fff; }
    .hint { color: #6b7280; font-size: 12px; }
    .mb-toast { 
      position: fixed; left: 50%; transform: translateX(-50%) translateY(20px);
      bottom: 20px; background: #111; color: #fff; padding: 10px 16px;
      border-radius: 10px; opacity: 0; pointer-events: none; transition: opacity .25s, transform .25s;
      z-index: 9999;
    }
    .mb-toast--success { background: #16a34a; }
    .mb-toast--error { background: #dc2626; }
    .mb-toast.is-visible { opacity: 1; transform: translateX(-50%) translateY(0); }
    @media (prefers-color-scheme: light) {
      .card { background: #f3f4f6; }
    }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
}

async function boot() {
  injectBaseStyles();
  await loadOptions();
  bindEvents();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
