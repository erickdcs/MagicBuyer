import { getValue, setValue } from "../../services/repository";
let eventMappers = new Set();

const clickHandler = (key, settingKey, evt) => {
  evt.preventDefault();
  const $switch = $(evt.currentTarget);
  const buyerSetting = getValue(settingKey) || {};
  const isActive = !$switch.hasClass("is-on");
  buyerSetting[key] = isActive;
  $switch.toggleClass("is-on", isActive);
  $switch.attr("aria-checked", isActive);
  setValue(settingKey, buyerSetting);
};

export const generateToggleInput = (
  label,
  id,
  info,
  settingKey,
  additionalClasses = "buyer-settings-field",
  customCallBack = null
) => {
  const key = Object.keys(id)[0];
  const buyerSetting = getValue(settingKey) || {};
  const isActive = Boolean(buyerSetting[key]);
  if (!eventMappers.has(key)) {
    const handler = (evt) => {
      !customCallBack && clickHandler(key, settingKey, evt);
      customCallBack && customCallBack(evt);
    };

    $(document).on("click touchend", `#${id[key]}`, handler);
    $(document).on("keydown", `#${id[key]}`, (evt) => {
      if (evt.key === " " || evt.key === "Enter") {
        evt.preventDefault();
        handler(evt);
      }
    });
    eventMappers.add(key);
  }
  const helperMarkup =
    info && info.trim() !== ""
      ? `<div class="field-toggle__helper">${info}</div>`
      : "";
  return `
    <div class="field field-toggle ${additionalClasses}">
      <div class="field-toggle__label-group">
        <span class="field-toggle__label">${label}</span>
        ${helperMarkup}
      </div>
      <button type="button" id='${id[key]}' class="toggle-switch${
        isActive ? " is-on" : ""
      }" role="switch" aria-checked="${isActive}">
        <span class="toggle-switch__track"></span>
        <span class="toggle-switch__thumb"></span>
      </button>
    </div>
  `;
};
