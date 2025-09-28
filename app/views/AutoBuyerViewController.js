import { idAbStatus, idFilterDropdown, idLog } from "../elementIds.constants";
import * as processors from "../handlers/autobuyerProcessor";
import { statsProcessor } from "../handlers/statsProcessor";
import {
  getAuthenticatedUser,
  isAuthenticated,
  requireAuthentication,
} from "../services/auth/loginManager";
import { getValue, setValue } from "../services/repository";
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

AutoBuyerViewController.prototype.init = function () {
  searchFiltersViewInit.call(this);
  setValue("AutoBuyerInstance", this);
  this.__magicbuyerLayoutReady = false;
  this.__magicbuyerAuthPromise = null;
};

AutoBuyerViewController.prototype.viewDidAppear = function () {
  this.getNavigationController().setNavigationVisibility(true, true);
  searchFiltersViewAppear.call(this, false);

  if (this.__magicbuyerLayoutReady) {
    decorateNavigationAfterLogin();
    return;
  }

  if (isAuthenticated()) {
    initializeAutoBuyerLayout.call(this);
    return;
  }

  if (!this.__magicbuyerAuthPromise) {
    this.__magicbuyerAuthPromise = requireAuthentication()
      .then(() => {
        this.__magicbuyerAuthPromise = null;
        initializeAutoBuyerLayout.call(this);
      })
      .catch((error) => {
        this.__magicbuyerAuthPromise = null;
        /* eslint-disable no-console */
        console.error(
          "No se pudo completar la autenticación de MagicBuyer",
          error
        );
        /* eslint-enable no-console */
      });
  }
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
  return `MagicBuyer`;
};

const initializeAutoBuyerLayout = function () {
  if (this.__magicbuyerLayoutReady) {
    decorateNavigationAfterLogin();
    return;
  }

  this.__magicbuyerLayoutReady = true;

  const view = this.getView();
  if (!isPhone() && view && view.__root) {
    view.__root.style = "width: 100%; float: left;";
  }

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

  decorateNavigationAfterLogin();
};

const decorateNavigationAfterLogin = () => {
  if (!isAuthenticated()) {
    return;
  }

  setTimeout(() => {
    const title = $(".title");
    if (!title.length) {
      return;
    }

    isPhone() && title.addClass("buyer-header");
    title.find(".magicbuyer-user-badge").remove();
    $(".view-navbar-currency").remove();
    $(".view-navbar-clubinfo").remove();
    title.find(`#${idAbStatus}`).remove();

    const user = getAuthenticatedUser();
    if (user) {
      const displayName =
        user.username || user.email || user.name || user.id || "Usuario";
      const badge = $("<span>")
        .addClass("magicbuyer-user-badge")
        .text(`Conectado como ${displayName}`);
      title.append(badge);
    }

    title.append(BuyerStatus());
    $(HeaderView()).insertAfter(title);
    const container = $(".ut-navigation-container-view--content");
    container.find(`#${idLog}`).remove();
    container.append(logView());
    initializeLog();
    updateSettingsView(getValue("CommonSettings") || {});
  }, 0);
};
