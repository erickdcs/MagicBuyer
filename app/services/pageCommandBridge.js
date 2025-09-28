import {
  startAutoBuyer,
  stopAutoBuyer,
} from "../handlers/autobuyerProcessor";
import { getValue } from "./repository";
import { clearLogs } from "../utils/logUtil";
import { AutoBuyerViewController } from "../views/AutoBuyerViewController"; // crea un index que exporte el prototipo mostrado en tu mensaje
import { generateMenuItems, clearSettingMenus } from "../views/layouts/MenuItemView";
import { filterHeaderSettingsView } from "../views/layouts/Settings/FilterSettingsView";
import { HeaderView, BuyerStatus } from "../views/layouts/HeaderView";
import { logView, initializeLog } from "../views/layouts/LogView";
import { updateSettingsView } from "../utils/commonUtil";
import { idLog } from "../elementIds.constants";
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
import {
  activateSettingsTab,
  getSettingsCategories,
} from "../views/layouts/MenuItemView";
import { getSavedFilterNames } from "../views/layouts/Settings/FilterSettingsView";


const PAGE_COMMAND_REQUEST = "MAGIC_BUYER_PAGE_COMMAND";
const PAGE_COMMAND_RESPONSE = "MAGIC_BUYER_PAGE_COMMAND_RESPONSE";

const commandHandlers = {
  start: async () => {
    const instance = getAutoBuyerInstance();
    await startAutoBuyer.call(instance);
    return { state: "started" };
  },
  resume: async () => {
    const instance = getAutoBuyerInstance();
    await startAutoBuyer.call(instance, true);
    return { state: "resumed" };
  },
  stop: async () => {
    const instance = getAutoBuyerInstance();
    stopAutoBuyer.call(instance, false);
    return { state: "stopped" };
  },
  pause: async () => {
    const instance = getAutoBuyerInstance();
    stopAutoBuyer.call(instance, true);
    return { state: "paused" };
  },
  clearLogs: async () => {
    clearLogs();
    return { cleared: true };
  },
  getStatus: async () => {
    return collectStatusSnapshot();
  },
  getLogs: async () => {
    const logEl = document.getElementById(idProgressAutobuyer);
    return {
      html: logEl ? logEl.innerHTML : "",
    };
  },
  open: async () => {
    ensureAutoBuyerTab();
    return { opened: true };
  },
  
  getSettingsSummary: async () => {
    const categories = getSettingsCategories();
    const filters = await getSavedFilterNames();
    const activeCategoryIndex = getValue("activeSettingsTab") ?? 0;
    const filterDropdown =
      document.getElementById(idFilterDropdown) ||
      document.getElementById(`${idFilterDropdown}transfer`);
    const activeFilter = filterDropdown?.value || "";
    const selectedFilters = getValue("selectedFilters") || [];

    return {
      categories,
      activeCategoryIndex,
      filters,
      activeFilter,
      selectedFilters,
    };
  },
  setActiveSettingsTab: async ({ index }) => {
    if (typeof index !== "number" || Number.isNaN(index)) {
      throw new Error("A valid settings index is required");
    }

    ensureAutoBuyerTab();

    const updated = activateSettingsTab(index);
    if (!updated) {
      throw new Error(
        "Settings are not available yet. Open the MagicBuyer tab in the web app first."
      );
    }

    return { activeCategoryIndex: index };
  },
  openSettings: async () => {
    ensureAutoBuyerTab();

    // 1) Si la instancia del AutoBuyer no existe, crea/controlador (del dev)
    let instance = getValue("AutoBuyerInstance");
    if (!instance || !instance.__mbDevMounted) {
      instance = mountDevAutoBuyerView();       // ⬅️ (definido abajo)
      setValue("AutoBuyerInstance", instance);
    }

    // 2) Garantiza que el header, status y logs están presentes
    ensureHeaderStatusAndLog();

    // 3) Garantiza que el menú de ajustes está generado y al frente
    await ensureSettingsMenu();

    // 4) (Opcional) Abrir el dropdown/selección de filtros si procede
    const fd = document.getElementById(idFilterDropdown);
    if (fd) fd.focus();

    return { opened: true, section: "settings" };
  },
};

function mountDevAutoBuyerView() {
  try {
    // Esta lógica replica lo que hace tu AutoBuyerViewController del dev:
    // Subclase de UTMarketSearchFiltersViewController y bootstrap de la vista.
    const controller = new AutoBuyerViewController();
    // Empuja el controlador a la navegación de la UT app
    const nav = getNavigationControllerSafe();
    if (nav) {
      nav._viewControllerStack = nav._viewControllerStack || [];
      nav.pushViewController(controller, true);
    }
    controller.__mbDevMounted = true;
    return controller;
  } catch (e) {
    console.error("Failed to mount AutoBuyerViewController:", e);
    throw new Error("No se pudo montar la vista de MagicBuyer (dev). Abre la UT web app y vuelve a intentarlo.");
  }
}

function ensureHeaderStatusAndLog() {
  // Inserta BuyerStatus + HeaderView tras el título UT
  const title = document.querySelector(".title");
  if (title && !title.querySelector(".buyer-header")) {
    // evita duplicar
    try {
      title.appendChild(BuyerStatus());
    } catch {}
    try {
      const header = HeaderView();
      if (header && header.parentNode !== title.parentNode) {
        title.insertAdjacentElement("afterend", header);
      }
    } catch {}
  }

  // Asegura el Log al final del contenido
  const content = document.querySelector(".ut-navigation-container-view--content");
  if (content && !content.querySelector(`#${idLog}`)) {
    content.appendChild(logView());
    initializeLog();
    // Sincroniza settings comunes si existen
    try {
      updateSettingsView(getValue("CommonSettings") || {});
    } catch {}
  }
}

async function ensureSettingsMenu() {
  // Ubica el root de la UT item search
  const root = document.querySelector(".ut-item-search-view");
  if (!root) return;

  // Coloca el header de filtros si no está
  if (!root.querySelector(".filter-place")) {
    const node = await filterHeaderSettingsView.call(getValue("AutoBuyerInstance") || window, /*isTransferSearch*/ true);
    const container = root; // en dev: root.first().prepend(res)
    if (node) container.prepend(node);
  }

  // Genera el menú si no existe
  if (!document.querySelector(".settings-menu")) {
    await clearSettingMenus();
    const menuItems = generateMenuItems.call(getValue("AutoBuyerInstance") || window);
    const searchPrices = document.querySelector(".search-prices") || root;
    const el = menuItems?.__root || menuItems;
    if (el) {
      el.querySelector?.(".menu-container")?.classList?.add("settings-menu");
      searchPrices.appendChild(el);
    }
  }

  // Estilos/aspecto pueden venir de los CSS del dev; si no, añade clases mínimas:
  document.querySelector(".auto-buyer")?.classList?.add("dev-layout");
}

const getAutoBuyerInstance = () => {
  const instance = getValue("AutoBuyerInstance");
  if (!instance) {
    throw new Error(
      "MagicBuyer view is not initialized yet. Open the Ultimate Team web app and visit the MagicBuyer tab first."
    );
  }
  return instance;
};

function ensureAutoBuyerTab() {
  const tabItems = Array.from(document.querySelectorAll(".ut-tab-bar-item"))
    .filter((el) => el.textContent?.trim() === "MagicBuyer");
  if (tabItems.length) {
    const tab = tabItems[0];
    tab.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    tab.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    tab.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
  }
}
function getNavigationControllerSafe() {
  // Heurística típica en UT web app; ajusta si tienes un acceso directo en tu código del dev
  return window._navigationController
      || window.navigationController
      || document.querySelector(".ut-navigation-container-view")?.__vue__?.$root?.navigationController
      || null;
}

const collectStatusSnapshot = () => {
  const textContent = (id) =>
    document.getElementById(id)?.textContent?.trim() || "";

  return {
    statusText: textContent(idAbStatus),
    requestCount: textContent(idAbRequestCount),
    coins: textContent(idAbCoins),
    profit: textContent(idAbProfit),
    won: textContent(idWinCount),
    sold: textContent(idAbSoldItems),
    unsold: textContent(idAbUnsoldItems),
    available: textContent(idAbAvailableItems),
    activeTransfers: textContent(idAbActiveTransfers),
    searchProgress: getProgressWidth(idAbSearchProgress),
    statisticsProgress: getProgressWidth(idAbStatisticsProgress),
    countdown: textContent(idAbCountDown),
  };
};

const getProgressWidth = (id) => {
  const el = document.getElementById(id);
  if (!el) {
    return 0;
  }
  const match = /([0-9.]+)%/.exec(el.style.width || "");
  return match ? Number(match[1]) : 0;
};

const handlePageCommand = async (payload) => {
  if (!payload || !payload.command) {
    throw new Error("Invalid command");
  }
  const handler = commandHandlers[payload.command];
  if (!handler) {
    throw new Error(`Unknown command: ${payload.command}`);
  }
  return await handler(payload.args || {});
};

export const initPageCommandBridge = () => {
  window.addEventListener("message", (event) => {
    if (event.source !== window || !event.data) {
      return;
    }
    const { type, id, payload } = event.data;
    if (type !== PAGE_COMMAND_REQUEST || !id) {
      return;
    }

    Promise.resolve()
      .then(() => handlePageCommand(payload))
      .then((result) => {
        window.postMessage(
          {
            type: PAGE_COMMAND_RESPONSE,
            id,
            success: true,
            payload: result,
          },
          "*"
        );
      })
      .catch((error) => {
        window.postMessage(
          {
            type: PAGE_COMMAND_RESPONSE,
            id,
            success: false,
            error: error?.message || "Unknown command error",
          },
          "*"
        );
      });
  });
};
