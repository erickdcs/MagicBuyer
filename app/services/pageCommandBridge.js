import {
  startAutoBuyer,
  stopAutoBuyer,
} from "../handlers/autobuyerProcessor";
import { getValue } from "./repository";
import { clearLogs } from "../utils/logUtil";
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
import { getSettingsCategories } from "../views/layouts/MenuItemView";
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
};

const getAutoBuyerInstance = () => {
  const instance = getValue("AutoBuyerInstance");
  if (!instance) {
    throw new Error(
      "MagicBuyer view is not initialized yet. Open the Ultimate Team web app and visit the MagicBuyer tab first."
    );
  }
  return instance;
};

const ensureAutoBuyerTab = () => {
  const tabItems = Array.from(
    document.querySelectorAll(".ut-tab-bar-item")
  ).filter((el) => el.textContent?.trim() === "MagicBuyer");
  if (tabItems.length) {
    const tab = tabItems[0];
    tab.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    tab.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    tab.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
  }
};

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
