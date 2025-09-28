// app/page/index.js
import "../vendor/jquery";
// 🔽 IMPORTA TUS VISTAS/LAYOUTS DEL DEV
import { idLog, idFilterDropdown } from "../elementIds.constants";
import * as processors from "../handlers/autobuyerProcessor";
import { statsProcessor } from "../handlers/statsProcessor";
import { getValue, setValue } from "../services/repository";
import { updateSettingsView } from "../utils/commonUtil";
import { clearLogs } from "../utils/logUtil";
import { createButton } from "../views/layouts/ButtonView";
import { BuyerStatus, HeaderView } from "../views/layouts/HeaderView";
import { initializeLog, logView } from "../views/layouts/LogView";
import { clearSettingMenus, generateMenuItems } from "../views/layouts/MenuItemView";
import { filterHeaderSettingsView } from "../views/layouts/Settings/FilterSettingsView";

const { startAutoBuyer, stopAutoBuyer } = processors;

// Helper: comprueba disponibilidad de clases UT
function hasUTControllers() {
  return typeof window.UTMarketSearchFiltersViewController !== "undefined";
}

// Monta el controlador del dev (tal y como está en tu repo)
function mountAutoBuyerController() {
  if (!hasUTControllers()) {
    throw new Error("UT controllers not found. Open Ultimate Team web app first.");
  }

  const Base = window.UTMarketSearchFiltersViewController;

  const AutoBuyerViewController = function (t) {
    Base.call(this);
  };

  // Copiamos el código de herencia y hooks de tu dev (ligeramente adaptado):
  const searchFiltersViewInit = Base.prototype.init;
  const realViewDidAppear = Base.prototype.viewDidAppear;

  window.JSUtils?.inherits?.(AutoBuyerViewController, Base);
  window.JSUtils?.inherits?.(Base, Base); // esto existe igual en tu snippet

  AutoBuyerViewController.prototype.init = function () {
    searchFiltersViewInit.call(this);
    let view = this.getView();
    if (typeof window.isPhone === "function" ? !window.isPhone() : true) {
      view.__root.style = "width: 100%; float: left;";
    }
    setValue("AutoBuyerInstance", this);

    const menuItems = generateMenuItems.call(this);
    let root = $(view.__root);
    const createButtonWithContext = createButton.bind(this);
    const stopBtn = createButtonWithContext("Stop", () => stopAutoBuyer.call(this));
    const clearLogBtn = createButtonWithContext("Clear Log", () => clearLogs.call(this), "btn-other");
    const searchBtn = createButtonWithContext("Start", () => {
      startAutoBuyer.call(this);
      $(`.ut-navigation-container-view--content`).animate(
        { scrollTop: $(`.ut-navigation-container-view--content`).prop("scrollHeight") },
        400
      );
    }, "call-to-action");

    statsProcessor();

    root.addClass("auto-buyer");
    const btnContainer = root.find(".button-container");
    btnContainer.addClass("buyer-actions");
    btnContainer.find(".call-to-action").remove();
    const btnReset = btnContainer.find('button:contains("Reset")');
    btnReset.on("click touchend", async function () {
      $(`#${idFilterDropdown}`).prop("selectedIndex", 0);
      await clearSettingMenus();
    });
    btnReset.addClass("btn-other");
    btnContainer.append($(searchBtn.__root));
    btnContainer.append($(stopBtn.__root));
    btnContainer.append($(clearLogBtn.__root));
    $(menuItems.__root).find(".menu-container").addClass("settings-menu");

    root.find(".search-prices").append(menuItems.__root);
  };

  AutoBuyerViewController.prototype.viewDidAppear = function () {
    this.getNavigationController().setNavigationVisibility(true, true);
    viewDidAppearInternal.call(this, false);
  };

  Base.prototype.viewDidAppear = function () {
    viewDidAppearInternal.call(this, true);
  };

  function viewDidAppearInternal(isTransferSearch) {
    realViewDidAppear.call(this);
    let view = this.getView();
    let root = $(view.__root);
    if (!root.find(".filter-place").length) {
      filterHeaderSettingsView.call(this, isTransferSearch).then((res) => {
        root.find(".ut-item-search-view").first().prepend(res);
      });
    }
  }

  AutoBuyerViewController.prototype.getNavigationTitle = function () {
    setTimeout(() => {
      const title = $(".title");
      if (typeof window.isPhone === "function" ? window.isPhone() : false) {
        title.addClass("buyer-header");
      }
      $(".view-navbar-currency").remove();
      $(".view-navbar-clubinfo").remove();
      title.append(BuyerStatus());
      $(HeaderView()).insertAfter(title);
      $(".ut-navigation-container-view--content").find(`#${idLog}`).remove();
      $(".ut-navigation-container-view--content").append(logView());
      initializeLog();
      updateSettingsView(getValue("CommonSettings") || {});
    });
    return `MagicBuyer `;
  };

  return AutoBuyerViewController;
}

// Pulsa la pestaña “MagicBuyer” si existe
function ensureAutoBuyerTab() {
  const tab = Array.from(document.querySelectorAll(".ut-tab-bar-item"))
    .find((el) => el.textContent?.trim() === "MagicBuyer");
  if (tab) {
    tab.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    tab.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    tab.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
  }
}

// Abre Ajustes con los layouts del dev
async function openSettingsDev() {
  ensureAutoBuyerTab();

  // Reutiliza instancia si ya existe
  let instance = getValue("AutoBuyerInstance");
  if (!instance || !instance.__mbDevMounted) {
    const Controller = mountAutoBuyerController();
    // Empuja el controlador a la navegación de la UT (heurística común)
    const nav = window._navigationController || window.navigationController;
    if (nav?.pushViewController) {
      instance = new Controller();
      nav.pushViewController(instance, true);
      instance.__mbDevMounted = true;
      setValue("AutoBuyerInstance", instance);
    } else {
      throw new Error("Navigation controller not found.");
    }
  }

  // Asegura cabecera/estado/log
  const title = document.querySelector(".title");
  if (title && !title.querySelector(".buyer-header")) {
    try { title.appendChild(BuyerStatus()); } catch {}
    try { $(HeaderView()).insertAfter($(title)); } catch {}
  }
  const content = document.querySelector(".ut-navigation-container-view--content");
  if (content && !content.querySelector(`#${idLog}`)) {
    content.appendChild(logView());
    initializeLog();
  }

  // Menú de settings al frente
  const root = document.querySelector(".ut-item-search-view");
  if (root && !root.querySelector(".settings-menu")) {
    await clearSettingMenus();
    const menuItems = generateMenuItems.call(instance);
    const searchPrices = document.querySelector(".search-prices") || root;
    const el = menuItems?.__root || menuItems;
    if (el) {
      el.querySelector?.(".menu-container")?.classList?.add("settings-menu");
      searchPrices.appendChild(el);
    }
  }
}

// Listener de comandos desde el content script/popup
window.addEventListener("message", (event) => {
  if (event.source !== window || !event.data) return;
  const { type, payload } = event.data;
  if (type !== "MAGIC_BUYER_PAGE_COMMAND") return;

  const cmd = payload?.command;
  if (cmd === "openSettings") {
    Promise.resolve()
      .then(() => openSettingsDev())
      .catch((e) => console.error("[MagicBuyer] openSettings error:", e));
  }
});

// Notifica al content script que el bundle de página está listo para recibir comandos
if (!window.__mbPageReadyNotified) {
  window.__mbPageReadyNotified = true;
  try {
    window.postMessage({ type: "MAGIC_BUYER_PAGE_READY" }, "*");
  } catch (e) {
    console.error("[MagicBuyer] Failed to dispatch PAGE_READY event:", e);
  }
}
