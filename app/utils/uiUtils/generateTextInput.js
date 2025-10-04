import { getValue, setValue } from "../../services/repository";
let eventMappers = new Set();

const updateCache = (key, settingKey, value, type, isDefaultValue = false) => {
  const buyerSetting = getValue(settingKey) || {};
  if (type === "number") value = parseInt(value);
  buyerSetting[key] = value || null;
  buyerSetting[key + "isDefaultValue"] = isDefaultValue;
  setValue(settingKey, buyerSetting);
};

export const generateTextInput = (
  label,
  placeholder,
  id,
  info,
  settingKey,
  type = "number",
  pattern = ".*",
  additionalClasses = "buyer-settings-field",
  customCallBack = null,
  icon = null
) => {
  const key = Object.keys(id)[0];
  if (placeholder) {
    customCallBack && customCallBack(placeholder);
    updateCache(key, settingKey, placeholder, type, true);
  }
  if (!eventMappers.has(key)) {
    $(document).on("input", `#${id[key]}`, ({ target: { value } }) => {
      customCallBack && customCallBack(value);
      updateCache(key, settingKey, value || placeholder, type, !value);
    });
    eventMappers.add(key);
  }
  const helperMarkup =
    info && info.trim() !== ""
      ? `<div class="field__helper">${info}</div>`
      : "";

  const placeholderValue = placeholder ?? "";
  const sanitizedValue =
    placeholderValue !== "" && placeholderValue !== null
      ? String(placeholderValue).replace(/"/g, "&quot;")
      : null;
  const valueAttribute = sanitizedValue !== null ? `value="${sanitizedValue}"` : "";

  return `
    <div class="field ${additionalClasses} ${icon ? "field--with-icon" : ""}">
      <div class="field__control">
        ${
          icon
            ? `<span class="field__icon" aria-hidden="true">${icon}</span>`
            : ""
        }
        <div class="field__input-wrapper">
          <input pattern="${pattern}" type="${type}" class="field__input" id='${id[key]}' placeholder=" " ${valueAttribute}>
          <label class="field__label" for="${id[key]}">${label}</label>
        </div>
      </div>
      ${helperMarkup}
    </div>
  `;
};
