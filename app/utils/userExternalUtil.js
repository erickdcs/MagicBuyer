/* global ko */

import { defaultBuyerSetting, defaultCommonSetting } from "../app.constants";
import * as ElementIds from "../elementIds.constants";
import { getValue, getBuyerSettings, setValue } from "../services/repository";
import {
  clearSettingMenus,
  updateCommonSettings,
} from "../views/layouts/MenuItemView";
import { updateSettingsView, downloadJson } from "./commonUtil";
import { deleteFilters, insertFilters } from "./dbUtil";
import { checkAndAppendOption, updateMultiFilterSettings } from "./filterUtil";
import { sendUINotification } from "./notificationUtil";

const safeSerialize = (value) => {
  const seen = new WeakSet();

  return JSON.stringify(value, function (key, currentValue) {
    if (typeof currentValue === "function") {
      return undefined;
    }

    if (typeof currentValue === "bigint") {
      return Number(currentValue);
    }

    if (currentValue && typeof currentValue === "object") {
      if (currentValue.nodeType && typeof currentValue.cloneNode === "function") {
        return undefined;
      }

      if (currentValue instanceof Map) {
        if (seen.has(currentValue)) {
          return undefined;
        }
        seen.add(currentValue);
        const mapResult = {};
        currentValue.forEach((mapValue, mapKey) => {
          mapResult[mapKey] = mapValue;
        });
        return mapResult;
      }

      if (currentValue instanceof Set) {
        if (seen.has(currentValue)) {
          return undefined;
        }
        seen.add(currentValue);
        return Array.from(currentValue.values());
      }

      if (seen.has(currentValue)) {
        return undefined;
      }
      seen.add(currentValue);
    }

    return currentValue;
  });
};

const cloneForStorage = (value, fallbackValue) => {
  if (value === undefined) {
    return fallbackValue;
  }

  try {
    const serialized = safeSerialize(value);

    if (typeof serialized !== "string") {
      return fallbackValue;
    }

    return JSON.parse(serialized);
  } catch (err) {
    return fallbackValue;
  }

};

const createFilterSnapshot = (viewModel, buyerSetting) => {
  const criteria = viewModel?.searchCriteria
    ? cloneForStorage(viewModel.searchCriteria, {})
    : {};
  const playerData =
    viewModel?.playerData !== undefined && viewModel?.playerData !== null
      ? cloneForStorage(viewModel.playerData, null)
      : null;
  const buyerSettings = buyerSetting
    ? cloneForStorage(buyerSetting, {})
    : {};

  return {
    searchCriteria: {
      criteria,
      playerData,
      buyerSettings,
    },
  };
};

const validateSettings = () => {
  if (document.querySelectorAll(":invalid").length) {
    sendUINotification(
      "Settings with invalid value found, fix these values for autobuyer to work as intended",
      UINotificationType.NEGATIVE
    );
  }
};

const filterDropdownId = `#${ElementIds.idFilterDropdown}`;
const selectedFilterId = `#${ElementIds.idSelectedFilter}`;

export const saveFilterDetails = function (self) {
  const btnContext = this;
  $(btnContext).addClass("active");
  let buyerSetting = getBuyerSettings(true);
  let commonSettings = getValue("CommonSettings");
  setTimeout(function () {
    const viewModel = self._viewmodel;
    const settingsJson = createFilterSnapshot(viewModel, buyerSetting);

    let currentFilterName = $(`${filterDropdownId} option`)
      .filter(":selected")
      .val();

    if (currentFilterName === "Choose filter to load") {
      currentFilterName = undefined;
    }
    let filterName = prompt("Enter a name for this filter", currentFilterName);
    validateSettings();
    if (filterName) {
      if (filterName.toLocaleUpperCase() === "_DEFAULT") {
        return sendUINotification(
          "Cannot override _DEFAULT filter",
          UINotificationType.NEGATIVE
        );
      }
      saveFilterInDB(filterName, settingsJson);
      insertFilters(
        "CommonSettings",
        JSON.stringify(commonSettings),
        "CommonSettings"
      );
      setValue("currentFilter", filterName);
      $(btnContext).removeClass("active");
      sendUINotification("Changes saved successfully");
    } else {
      $(btnContext).removeClass("active");
      sendUINotification("Filter Name Required", UINotificationType.NEGATIVE);
    }
  }, 200);
};

export const downloadCurrentFilter = function (self) {
  const btnContext = this;
  $(btnContext).addClass("active");
  setTimeout(function () {
    const buyerSetting = getBuyerSettings(true);
    const viewModel = self._viewmodel;
    const currentFilter = getValue("currentFilter") || "CURRENT_FILTER";
    let filterName = prompt(
      "Enter a name for the exported filter",
      currentFilter
    );

    if (!filterName) {
      $(btnContext).removeClass("active");
      sendUINotification("Filter Name Required", UINotificationType.NEGATIVE);
      return;
    }

    filterName = filterName.trim();

    if (!filterName.length) {
      $(btnContext).removeClass("active");
      sendUINotification("Filter Name Required", UINotificationType.NEGATIVE);
      return;
    }

    const sanitizedFilterName = filterName.toUpperCase();
    const downloadFileName = `${filterName
      .replace(/\s+/g, "_")
      .toLowerCase()}_filter`;

    const settingsJson = createFilterSnapshot(viewModel, buyerSetting);
    const downloadPayload = {
      filters: {
        [sanitizedFilterName]: settingsJson,
      },
    };

    const commonSettings = getValue("CommonSettings");
    if (commonSettings) {
      downloadPayload.commonSettings = cloneForStorage(commonSettings, {});
    }

    downloadJson(downloadPayload, downloadFileName);
    $(btnContext).removeClass("active");
    sendUINotification("Filter downloaded successfully");
  }, 200);
};

export const saveFilterInDB = (filterName, settingsJson) => {
  filterName = filterName.toUpperCase();
  checkAndAppendOption(filterDropdownId, filterName);
  checkAndAppendOption(`#${ElementIds.idSelectedFilter}`, filterName);
  $(`${filterDropdownId} option[value="${filterName}"]`).attr("selected", true);
  const filters = getValue("filters") || {};
  filters[filterName] = JSON.stringify(settingsJson);
  setValue("filters", filters);
  insertFilters(filterName, filters[filterName]);
};

const loadDefaultFilter = () => {
  setValue("BuyerSettings", Object.assign({}, defaultBuyerSetting));
  setValue("CommonSettings", Object.assign({}, defaultCommonSetting));
  const buyerSettings = getBuyerSettings();
  updateSettingsView(buyerSettings);
};

export const loadFilter = async function (currentFilterName, isTransferSearch) {
  if (currentFilterName === "_default") {
    loadDefaultFilter();
    return false;
  }
  if (!getValue("runnerToggle") && !isTransferSearch) await clearSettingMenus();
  const filterSetting = getValue("filters")[currentFilterName];
  if (!filterSetting) return false;
  let {
    searchCriteria: { criteria, playerData, buyerSettings },
  } = JSON.parse(filterSetting);

  this.viewmodel.resetSearch();
  this.viewDidAppear();

  this.viewmodel.playerData = {};
  Object.assign(this.viewmodel.searchCriteria, criteria);
  Object.assign(this.viewmodel.playerData, playerData);

  if ($.isEmptyObject(this.viewmodel.playerData)) {
    this.viewmodel.playerData = null;
  }

  this.viewDidAppear();

  if (isTransferSearch) {
    return;
  }

  await updateCommonSettings();
  const commonSettings = getValue("CommonSettings") || {};
  setValue("BuyerSettings", buyerSettings);
  setValue("currentFilter", currentFilterName);
  buyerSettings = Object.assign({}, buyerSettings, commonSettings);

  updateSettingsView(buyerSettings);

  if (
    buyerSettings["idAddIgnorePlayersList"] &&
    buyerSettings["idAddIgnorePlayersList"].length
  ) {
    for (let { displayName } of buyerSettings["idAddIgnorePlayersList"]) {
      checkAndAppendOption(
        `#${ElementIds.idAddIgnorePlayersList}`,
        displayName
      );
    }
  }
  validateSettings();

  return true;
};

export const deleteFilter = async function () {
  const filterName = $(`${filterDropdownId} option`).filter(":selected").val();
  if (filterName.toLocaleUpperCase() === "_DEFAULT") {
    return sendUINotification(
      "Cannot delete _DEFAULT filter",
      UINotificationType.NEGATIVE
    );
  }
  if (filterName != "Choose filter to load") {
    $(`${filterDropdownId}` + ` option[value="${filterName}"]`).remove();
    $(`${filterDropdownId}`).prop("selectedIndex", 0);

    await clearSettingMenus();
    this.viewDidAppear();

    delete getValue("filters")[filterName];
    $(`${selectedFilterId}` + ` option[value="${filterName}"]`).remove();
    updateMultiFilterSettings();
    deleteFilters(filterName);
    sendUINotification("Changes saved successfully");
  }
};
