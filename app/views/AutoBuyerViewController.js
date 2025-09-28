import { idFilterDropdown, idLog } from "../elementIds.constants";
import * as processors from "../handlers/autobuyerProcessor";
import { statsProcessor } from "../handlers/statsProcessor";
import { getValue, setValue } from "../services/repository";
import { promptLoginIfNeeded } from "../services/auth/authClient";
import { updateSettingsView } from "../utils/commonUtil";
import { clearLogs } from "../utils/logUtil";
import { createButton } from "./layouts/ButtonView";
import { BuyerStatus, HeaderView } from "./layouts/HeaderView";
import { initializeLog, logView } from "./layouts/LogView";
import { clearSettingMenus, generateMenuItems } from "./layouts/MenuItemView";
import { filterHeaderSettingsView } from "./layouts/Settings/FilterSettingsView";

const { startAutoBuyer, stopAutoBuyer } = processors;

export const AutoBuyerViewController = function (t) {
  UTMarketSearchFiltersViewController.call(this);
};

const searchFiltersViewInit =
  UTMarketSearchFiltersViewController.prototype.init;

const searchFiltersAppear =
  UTMarketSearchFiltersViewController.prototype.viewDidAppear;

JSUtils.inherits(AutoBuyerViewController, UTMarketSearchFiltersViewController);
JSUtils.inherits(
  UTMarketSearchFiltersViewController,
  UTMarketSearchFiltersViewController
);

const initializeAutoBuyerView = function () {
  if (this.__magicBuyerInitialized) {
    return;
  }

  this.__magicBuyerInitialized = true;

  const view = this.getView();
  const menuItems = generateMenuItems.call(this);
  const root = $(view.__root);
  const createButtonWithContext = createButton.bind(this);
  const stopBtn = createButtonWithContext("Stop", () =>
    stopAutoBuyer.call(this)
  );
  const clearLogBtn = createButtonWithContext(
    "Clear Log",
    () => clearLogs.call(this),
    "btn-other"
  );
  const searchBtn = createButtonWithContext(
    "Start",
    () => {
      startAutoBuyer.call(this);
      $(`.ut-navigation-container-view--content`).animate(
        {
          scrollTop: $(`.ut-navigation-container-view--content`).prop(
            "scrollHeight"
          ),
        },
        400
      );
    },
    "call-to-action"
  );

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

AutoBuyerViewController.prototype.init = function () {
  searchFiltersViewInit.call(this);
  const view = this.getView();
  if (!isPhone()) {
    view.__root.style = "width: 100%; float: left;";
  }

  setValue("AutoBuyerInstance", this);

  promptLoginIfNeeded()
    .then(() => {
      initializeAutoBuyerView.call(this);
    })
    .catch((error) => {
      /* eslint-disable no-console */
      console.error("MagicBuyer authentication failed", error);
      /* eslint-enable no-console */
    });
};

AutoBuyerViewController.prototype.viewDidAppear = function () {
  this.getNavigationController().setNavigationVisibility(true, true);
  searchFiltersViewAppear.call(this, false);
};

UTMarketSearchFiltersViewController.prototype.viewDidAppear = function () {
  searchFiltersViewAppear.call(this, true);
};

const searchFiltersViewAppear = function (isTransferSearch) {
  searchFiltersAppear.call(this);
  let view = this.getView();
  let root = $(view.__root);
  if (!root.find(".filter-place").length) {
    filterHeaderSettingsView.call(this, isTransferSearch).then((res) => {
      root.find(".ut-item-search-view").first().prepend(res);
    });
  }
};

AutoBuyerViewController.prototype.getNavigationTitle = function () {
  setTimeout(() => {
    const title = $(".title");
    isPhone() && title.addClass("buyer-header");
    $(".view-navbar-currency").remove();
    $(".view-navbar-clubinfo").remove();
    title.append(BuyerStatus());
    const authState = getValue("MagicBuyerAuthState");
    const username =
      authState && authState.user
        ? authState.user.username ||
          authState.user.email ||
          authState.user.name ||
          authState.user.id
        : null;
    if (username) {
      const badge = document.createElement("span");
      badge.className = "magicbuyer-header-username";
      badge.textContent = ` | ${username}`;
      const nativeTitle = title.get(0);
      nativeTitle && nativeTitle.appendChild(badge);
    }
    $(HeaderView()).insertAfter(title);
    $(".ut-navigation-container-view--content").find(`#${idLog}`).remove();
    $(".ut-navigation-container-view--content").append(logView());
    initializeLog();
    updateSettingsView(getValue("CommonSettings") || {});
  });
  return `MagicBuyer `;
};
