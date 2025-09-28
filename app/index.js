import { isMarketAlertApp } from "./app.constants";
import { initOverrides } from "./function-overrides";
import { cssOverride } from "./function-overrides/css-override";
import { initListeners } from "./services/listeners";
import { ensureAuthenticated } from "./services/auth/loginManager";

const initAutobuyer = function () {
  let isHomePageLoaded = false;
  isPhone() && $("body").removeClass("landscape").addClass("phone");
  $(".ui-orientation-warning").attr("style", "display: none !important");
  $(".ut-fifa-header-view").attr("style", "display: none !important");
  if (
    services.Localization &&
    $("h1.title").html() === services.Localization.localize("navbar.label.home")
  ) {
    isHomePageLoaded = true;
  }

  if (isHomePageLoaded) {
    cssOverride();
  } else {
    setTimeout(initAutobuyer, 1000);
  }
};

let initializationStarted = false;

const initFunctionOverrides = function () {
  let isPageLoaded = false;
  if (services.Localization) {
    isPageLoaded = true;
  }
  if (isPageLoaded) {
    if (initializationStarted) {
      return;
    }
    initializationStarted = true;

    ensureAuthenticated()
      .then(() => {
        initOverrides();
        initAutobuyer();
        isMarketAlertApp && initListeners();
      })
      .catch((error) => {
        console.error("MagicBuyer authentication failed", error);
        initializationStarted = false;
        setTimeout(initFunctionOverrides, 3000);
      });
  } else {
    setTimeout(initFunctionOverrides, 1000);
  }
};
initFunctionOverrides();
