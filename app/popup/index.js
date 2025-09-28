// app/index.js
import { initPageCommandBridge } from "../services/pageCommandBridge";
import { clearLogs } from "../utils/logUtil";
import { setValue, getValue } from "../services/repository";

import {
  idAbStatus,
  idAbRequestCount,
  idAbCoins,
  idAbProfit,
  idWinCount,
  idAbSoldItems,
  idAbUnsoldItems,
  idAbAvailableItems,
  idAbActiveTransfers,
  idAbSearchProgress,
  idAbStatisticsProgress,
  idAbCountDown,
  idProgressAutobuyer,
  idFilterDropdown,
} from "../elementIds.constants";

function ensureMagicBuyerTab() {
  const tabBar = document.querySelector(".ut-tab-bar");
  if (!tabBar || tabBar.querySelector('[data-mb-tab="true"]')) return;

  const li = document.createElement("a");
  li.className = "ut-tab-bar-item";
  li.setAttribute("role", "button");
  li.setAttribute("data-mb-tab", "true");
  li.textContent = "MagicBuyer";
  li.addEventListener("click", openMagicBuyer);
  tabBar.appendChild(li);
}

function openMagicBuyer() {
  // contenedor principal/equivalente de la app UT
  const root = document.querySelector(".ut-content") || document.body;

  // limpia y crea root para nuestra vista
  let panel = document.getElementById("magic-buyer-root");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "magic-buyer-root";
    root.appendChild(panel);
  }
  panel.innerHTML = getLayoutHtml();
  wireUpBasicUi();
  setValue("AutoBuyerInstance", window); // para que pageCommandBridge/handlers tengan un "instance"
}

function getLayoutHtml() {
  // Layout mínimo con los IDs que esperan tus servicios/handlers
  return `
  <div class="mb-wrap">
    <div class="mb-header">
      <h1>MagicBuyer</h1>
      <div class="mb-controls">
        <button id="mb-start" class="btn">Start</button>
        <button id="mb-resume" class="btn">Resume</button>
        <button id="mb-pause" class="btn">Pause</button>
        <button id="mb-stop" class="btn">Stop</button>
        <button id="mb-clear" class="btn">Clear Logs</button>
      </div>
    </div>

    <div class="mb-grid">
      <div class="mb-card">
        <h3>Status</h3>
        <div><strong>Estado:</strong> <span id="${idAbStatus}">—</span></div>
        <div><strong>Requests:</strong> <span id="${idAbRequestCount}">0</span></div>
        <div><strong>Coins:</strong> <span id="${idAbCoins}">0</span></div>
        <div><strong>Profit:</strong> <span id="${idAbProfit}">0</span></div>
        <div><strong>Won:</strong> <span id="${idWinCount}">0</span></div>
        <div><strong>Sold:</strong> <span id="${idAbSoldItems}">0</span></div>
        <div><strong>Unsold:</strong> <span id="${idAbUnsoldItems}">0</span></div>
        <div><strong>Available:</strong> <span id="${idAbAvailableItems}">0</span></div>
        <div><strong>Active transfers:</strong> <span id="${idAbActiveTransfers}">0</span></div>
        <div><strong>Countdown:</strong> <span id="${idAbCountDown}">—</span></div>
      </div>

      <div class="mb-card">
        <h3>Progress</h3>
        <div class="progress">
          <div id="${idAbSearchProgress}" class="progress-bar" style="width:0%"></div>
        </div>
        <div class="progress">
          <div id="${idAbStatisticsProgress}" class="progress-bar" style="width:0%"></div>
        </div>
      </div>

      <div class="mb-card">
        <h3>Filters</h3>
        <select id="${idFilterDropdown}">
          <option value="">— Select Filter —</option>
        </select>
      </div>

      <div class="mb-card mb-logs">
        <h3>Logs</h3>
        <div id="${idProgressAutobuyer}" class="mb-logbox"></div>
      </div>
    </div>
  </div>
  `;
}

function wireUpBasicUi() {
  const $ = (id) => document.getElementById(id);

  $("mb-start").onclick = () => window.postMessage({ type: "MAGIC_BUYER_PAGE_COMMAND", id: "start1", payload: { command: "start" } }, "*");
  $("mb-resume").onclick = () => window.postMessage({ type: "MAGIC_BUYER_PAGE_COMMAND", id: "resume1", payload: { command: "resume" } }, "*");
  $("mb-pause").onclick = () => window.postMessage({ type: "MAGIC_BUYER_PAGE_COMMAND", id: "pause1", payload: { command: "pause" } }, "*");
  $("mb-stop").onclick = () => window.postMessage({ type: "MAGIC_BUYER_PAGE_COMMAND", id: "stop1", payload: { command: "stop" } }, "*");
  $("mb-clear").onclick = () => clearLogs();
}

// Estilos mínimos (puedes moverlos a un .css si prefieres)
function injectStyles() {
  if (document.getElementById("mb-styles")) return;
  const style = document.createElement("style");
  style.id = "mb-styles";
  style.textContent = `
    .mb-wrap { padding: 16px; }
    .mb-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
    .mb-controls .btn { margin-right:8px; }
    .mb-grid { display:grid; grid-template-columns: 1fr 1fr; gap:16px; }
    .mb-card { background:#111; color:#eee; padding:12px; border-radius:8px; }
    .progress { background:#333; height:10px; border-radius:6px; overflow:hidden; margin:8px 0; }
    .progress-bar { background:#2aa; height:10px; transition:width .3s ease; }
    .mb-logs { grid-column: 1 / span 2; }
    .mb-logbox { background:#000; min-height:160px; border:1px solid #333; padding:8px; overflow:auto; }
    .ut-tab-bar-item[data-mb-tab="true"] { cursor:pointer; }
  `;
  document.head.appendChild(style);
}

// app/popup/index.js (solo el fragmento del botón Settings)

function openOptionsPage() {
  try {
    if (chrome.runtime?.openOptionsPage) chrome.runtime.openOptionsPage();
    else window.open(chrome.runtime.getURL("options.html"), "_blank");
  } catch (e) {
    console.error("Error opening options:", e);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-settings")?.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs?.length) return;
      chrome.tabs.sendMessage(tabs[0].id, { type: "MB_OPEN_SETTINGS" });
    });
  });
});


function boot() {
  injectStyles();
  initPageCommandBridge();

  // espera la UI de la webapp y añade el tab
  const iv = setInterval(() => {
    try {
      ensureMagicBuyerTab();
    } catch {}
  }, 800);

  // opcional: abrir automáticamente el panel al inyectar
  // openMagicBuyer();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
