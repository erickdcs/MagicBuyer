const PAGE_COMMAND_REQUEST = "MAGIC_BUYER_PAGE_COMMAND";

const queryActiveTab = () => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }
      if (!tabs || !tabs.length) {
        reject(new Error("No active tab"));
        return;
      }
      resolve(tabs[0]);
    });
  });
};

const sendCommand = async (command, args = {}) => {
  const tab = await queryActiveTab();
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(
      tab.id,
      {
        type: PAGE_COMMAND_REQUEST,
        payload: { command, args },
        id: `${Date.now()}-${Math.random()}`,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        if (!response) {
          reject(new Error("No response from content script"));
          return;
        }
        if (!response.success) {
          reject(new Error(response.error || "Command failed"));
          return;
        }
        resolve(response.payload);
      }
    );
  });
};

const statusContainer = document.getElementById("status");
const logsContainer = document.getElementById("logs");
const errorContainer = document.getElementById("error");
const categoryContainer = document.getElementById("settings-categories");
const filtersContainer = document.getElementById("settings-filters");
const settingsNote = document.getElementById("settings-note");

const setError = (message) => {
  if (!message) {
    errorContainer.textContent = "";
    errorContainer.hidden = true;
    return;
  }
  errorContainer.textContent = message;
  errorContainer.hidden = false;
};

const updateStatus = async () => {
  try {
    const status = await sendCommand("getStatus");
    const items = [
      ["State", status.statusText || "Unknown"],
      ["Requests", status.requestCount || "0"],
      ["Coins", status.coins || "0"],
      ["Profit", status.profit || "0"],
      ["Won", status.won || "0"],
      ["Sold", status.sold || "0"],
      ["Unsold", status.unsold || "0"],
      ["Available", status.available || "0"],
      ["Active transfers", status.activeTransfers || "0"],
      ["Countdown", status.countdown || "00:00:00"],
    ];
    statusContainer.innerHTML = items
      .map(([label, value]) => `<div><strong>${label}:</strong> ${value}</div>`)
      .join("");
    setError("");
  } catch (error) {
    statusContainer.innerHTML = "";
    setError(error?.message || "Unable to fetch status");
  }
};

const updateLogs = async () => {
  try {
    const { html } = await sendCommand("getLogs");
    logsContainer.innerHTML = `<ul>${html || ""}</ul>`;
  } catch (error) {
    logsContainer.innerHTML = "<em>Unable to load logs.</em>";
    setError(error?.message || "Unable to load logs");
  }
};

const renderChips = (container, items, active, selectedSet) => {
  if (!container) {
    return;
  }

  if (!items || !items.length) {
    container.innerHTML = "<span class='chip empty'>No data</span>";
    return;
  }

  container.innerHTML = items
    .map((item) => {
      const index = typeof item.index === "number" ? item.index : undefined;
      const label = item.label || item;
      const isActive =
        (typeof active === "number" && typeof index === "number" && index === active) ||
        (typeof active === "string" && label === active);
      const isSelected = selectedSet?.has?.(label);
      const classes = ["chip"];
      if (isActive) {
        classes.push("active");
      } else if (isSelected) {
        classes.push("selected");
      }
      return `<span class="${classes.join(" ")}">${label}</span>`;
    })
    .join("");
};

const updateSettingsSummary = async (suppressNote = false) => {
  if (!categoryContainer || !filtersContainer) {
    return;
  }

  try {
    const summary = await sendCommand("getSettingsSummary");
    const categories = summary?.categories || [];
    const filters = summary?.filters || [];
    const activeCategory = summary?.activeCategoryIndex ?? 0;
    const activeFilter = summary?.activeFilter || "";
    const selectedFilters = new Set(summary?.selectedFilters || []);

    if (activeFilter) {
      selectedFilters.add(activeFilter);
    }

    renderChips(categoryContainer, categories, activeCategory);
    renderChips(filtersContainer, filters, activeFilter, selectedFilters);

    if (settingsNote) {
      settingsNote.textContent = "";
      settingsNote.hidden = true;
    }
  } catch (error) {
    console.warn("MagicBuyer popup: unable to load settings summary", error);
    renderChips(categoryContainer, [], 0);
    renderChips(filtersContainer, [], 0);
    if (settingsNote) {
      if (suppressNote) {
        settingsNote.textContent = "";
        settingsNote.hidden = true;
      } else {
        settingsNote.textContent =
          "Open the MagicBuyer tab in the Ultimate Team web app to load settings and filters.";
        settingsNote.hidden = false;
      }
    }
  }
};

const withAction = (fn) => async () => {
  try {
    await fn();
    setError("");
    await updateStatus();
    await updateLogs();
    await updateSettingsSummary(true);
  } catch (error) {
    setError(error?.message || "Action failed");
  }
};

const bindButton = (id, handler) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("click", withAction(handler));
};

bindButton("open", () => sendCommand("open"));
bindButton("start", () => sendCommand("start"));
bindButton("resume", () => sendCommand("resume"));
bindButton("pause", () => sendCommand("pause"));
bindButton("stop", () => sendCommand("stop"));
bindButton("clear", () => sendCommand("clearLogs"));

updateStatus();
updateLogs();
updateSettingsSummary();
setInterval(() => {
  updateStatus();
  updateLogs();
  updateSettingsSummary(true);
}, 5000);
