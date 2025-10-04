import {
  idAbDownloadFilter,
  idAbUploadFilter,
  idFilterDropdown,
  idAbNumberFilterSearch,
  idRunFilterSequential,
  idSelectedFilter,
  idAbToggleRunner,
  idBtnReport,
  idBtnActions,
} from "../../../elementIds.constants";
import { getValue, setValue } from "../../../services/repository";
import { getUserFilters } from "../../../utils/dbUtil";
import { uploadFilters, downloadFilters } from "../../../utils/filterSyncUtil";
import { updateMultiFilterSettings } from "../../../utils/filterUtil";
import { generateButton } from "../../../utils/uiUtils/generateButton";
import { generateTextInput } from "../../../utils/uiUtils/generateTextInput";
import { generateToggleInput } from "../../../utils/uiUtils/generateToggleInput";
import {
  downloadIcon,
  stackIcon,
  uploadIcon,
} from "../../../utils/uiUtils/icons";
import {
  deleteFilter,
  loadFilter,
  saveFilterDetails,
} from "../../../utils/userExternalUtil";
import { createButton } from "../ButtonView";
import { showPopUp } from "../../../utils/popupUtil";

const filters = async () => {
  if (!getValue("filters")) {
    setValue("filters", (await getUserFilters()) || {});
  }

  let filters = getValue("filters");

  filters = Object.keys(filters)
    .sort()
    .reduce((obj, key) => {
      obj[key] = filters[key];
      return obj;
    }, {});

  return filters;
};
$(document).on(
  {
    change: updateMultiFilterSettings,
    click: updateMultiFilterSettings,
    touchend: updateMultiFilterSettings,
  },
  `#${idSelectedFilter}`
);

const handleToggle = (evt, key) => {
  let runSequentially = getValue(key);
  runSequentially = !runSequentially;
  const $target = $(evt.currentTarget);
  $target.toggleClass("is-on", runSequentially);
  $target.attr("aria-checked", runSequentially);
  setValue(key, runSequentially);
  return runSequentially;
};

export const filterSettingsView = async function () {
  if (getValue("runSequentially")) {
    setValue("runSequentially", false);
    setTimeout(() => {
      $(`#${idRunFilterSequential}`).click();
    });
  }
  return `<div style='display : none' class='buyer-settings-wrapper filter-settings-view'>
                <div class="selected-filters-teleporter teleporter">
                  <div class="price-filter buyer-settings-field multiple-filter selected-filters-container">
                    <div class="info">
                      <span class="secondary label">Filtros activos<br/><small>Selecciona los filtros que estarán en ejecución</small></span>
                    </div>
                    <div class="buttonInfo">
                      <div class="inputBox">
                        <select  multiple="multiple" class="multiselect-filter filter-header-settings selected-filters-list" id="${idSelectedFilter}"
                         name="selectedFilters" style="overflow-y : scroll;">
                         ${Object.keys(await filters()).map(
                           (value) => `<option value='${value}'>${value}</option>`
                         )}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                ${generateTextInput(
                  "No. of search For each filter",
                  getValue("fiterSearchCount") || 3,
                  { idAbNumberFilterSearch },
                  "(Count of searches performed before switching to another filter)",
                  "CommonSettings",
                  "number",
                  null,
                  "buyer-settings-field",
                  (value) => setValue("fiterSearchCount", parseInt(value) || 3),
                  stackIcon
                )}
                ${generateToggleInput(
                  "Switch filter sequentially",
                  { idRunFilterSequential },
                  "",
                  "CommonSettings",
                  "buyer-settings-field",
                  (evt) => handleToggle(evt, "runSequentially")
                )}
            </div>
    `;
};

const handleReportProblem = () => {
  showPopUp(
    [
      { labelEnum: atob("RGlzY29yZA==") },
      { labelEnum: atob("VHdpdHRlcg==") },
      { labelEnum: atob("R2l0aHVi") },
    ],
    atob("UmVwb3J0IGEgcHJvYmxlbQ=="),
    atob(
      "QmVsb3cgYXJlIHRoZSBsaXN0IG9mIHdheXMgdG8gcmVwb3J0IGEgcHJvYmxlbSA8YnIgLz5NYWtlIHN1cmUgdG8gZ28gdGhyb3VnaCB0aGUgPGEgaHJlZj0naHR0cHM6Ly95b3V0dWJlLmNvbS9wbGF5bGlzdD9saXN0PVBMR21LTWczYVJrWGpQUjVna2x4TXlxeHRoWW9vV0k1SUMnIHRhcmdldD0nX2JsYW5rJz55b3V0dWJlIHBsYXlsaXN0PC9hPiBpZiBhbnkgc2V0dGluZ3MgYXJlIHVuY2xlYXIgPGJyIC8+"
    ),
    (t) => {
      if (t === atob("R2l0aHVi")) {
        window.open(
          atob(
            "aHR0cHM6Ly9naXRodWIuY29tL2NoaXRoYWt1bWFyMTMvRlVULUF1dG8tQnV5ZXIvaXNzdWVz"
          ),
          atob("X2JsYW5r")
        );
      } else if (t === atob("RGlzY29yZA==")) {
        window.open(
          atob("aHR0cHM6Ly9kaXNjb3JkLmNvbS9pbnZpdGUvY2t0SFltcA=="),
          atob("X2JsYW5r")
        );
      } else if (t === atob("VHdpdHRlcg==")) {
        window.open(
          atob("aHR0cHM6Ly90d2l0dGVyLmNvbS9BbGdvc0Nr"),
          atob("X2JsYW5r")
        );
      }
    }
  );
};

export const filterHeaderSettingsView = async function (isTransferSearch) {
  const context = this;
  const filterId = isTransferSearch ? "transfer" : "";
  $(document).off("change", `#${idFilterDropdown}${filterId}`);
  $(document).on(
    {
      change: function () {
        const filterName = $(`#${idFilterDropdown}${filterId} option`)
          .filter(":selected")
          .val();
        loadFilter.call(context, filterName, isTransferSearch);
      },
    },
    `#${idFilterDropdown}${filterId}`
  );

  const rootHeader =
    $(`<div style="width:100%;display: flex;flex-direction: column;">
            ${
              isPhone() && !isTransferSearch
                ? generateToggleInput(
                    "Runner Mode",
                    { idAbToggleRunner },
                    "",
                    "MisSettings",
                    "runner",
                    (evt) => {
                      const isToggled = handleToggle(evt, "runnerToggle");
                      const selectedFilters = $(`#${idSelectedFilter}`).closest(
                        ".selected-filters-container"
                      );
                      $(".auto-buyer").toggleClass("displayNone");
                      if (isToggled) {
                        $(".filter-place").append(selectedFilters);
                      } else {
                        $(".selected-filters-teleporter").append(selectedFilters);
                      }
                    }
                  )
                : ""
            }
            ${
              !isTransferSearch
                ? `<div id=${idBtnReport} class="btn-report"></div>`
                : ""
            }         
            <div class="price-filter buyer-settings-field multiple-filter filter-place">
            </div>
            <div class="price-filter buyer-settings-field filter-loader-block">
              <div class="info">
                <span class="secondary label">Cargar filtro<br/><small>Selecciona un filtro guardado para aplicarlo</small></span>
              </div>
              <div class="buttonInfo">
                <div class="inputBox">
                  <select class="filter-header-settings filter-loader" id='${idFilterDropdown}${filterId}'>
                    <option selected="true" disabled>Choose filter to load</option>
                    ${
                      !isTransferSearch
                        ? `<option value="_default">_DEFAULT</option>`
                        : ""
                    }
                    ${Object.keys(await filters()).map(
                      (value) => `<option value="${value}">${value}</option>`
                    )}
                  </select>
                </div>
              </div>
            </div>
            ${
              !isTransferSearch
                ? `<div class="price-filter buyer-settings-field filter-sync-block">
                    <div class="info">
                      <span class="secondary label">Sincronizar filtros<br/><small>Sube o descarga tu colección</small></span>
                    </div>
                    <div class="buttonInfo">
                      <div class="button-container btn-filters filter-sync-actions">
                        ${generateButton(
                          idAbUploadFilter,
                          "Upload",
                          () => {
                            uploadFilters();
                          },
                          "filterSync",
                          {
                            leadingIcon: uploadIcon,
                            density: "compact",
                            title: "Upload filters",
                          }
                        )}
                        ${generateButton(
                          idAbDownloadFilter,
                          "Download",
                          () => {
                            downloadFilters();
                          },
                          "filterSync",
                          {
                            leadingIcon: downloadIcon,
                            density: "compact",
                            title: "Download filters",
                          }
                        )}
                      </div>
                    </div>
                  </div>`
                : ""
            }
            ${
              !isTransferSearch
                ? `<div class="price-filter buyer-settings-field filter-actions-block">
                    <div class="info">
                      <span class="secondary label">Gestionar filtro<br/><small>Guarda los cambios o elimina el filtro actual</small></span>
                    </div>
                    <div class="buttonInfo">
                      <div id=${idBtnActions} class="button-container btn-filters filter-actions"></div>
                    </div>
                  </div>`
                : ""
            }
             </div>`);

  !isTransferSearch && appendButtons.call(this, rootHeader, context);
  return rootHeader;
};

const appendButtons = function (rootHeader, context) {
  const buttons = rootHeader.find(`#${idBtnActions}`);
  const btnReport = rootHeader.find(`#${idBtnReport}`);
  buttons.append(
    createButton(
      "Delete Filter",
      () => deleteFilter.call(context),
      "call-to-action btn-delete-filter"
    ).__root
  );
  buttons.append(
    createButton(
      "Save Filter",
      function () {
        saveFilterDetails.call(this, context);
      },
      "call-to-action btn-save-filter"
    ).__root
  );
  btnReport.append(
    createButton(
      "Report a problem",
      () => handleReportProblem(),
      "call-to-action"
    ).__root
  );
};
