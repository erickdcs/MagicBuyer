import {
  idAbCloseTabToggle,
  idAbSolveCaptcha,
  idAntiCaptchKey,
  idProxyAddress,
  idProxyLogin,
  idProxyPassword,
  idProxyPort,
} from "../../../elementIds.constants";
import { generateTextInput } from "../../../utils/uiUtils/generateTextInput";
import { generateToggleInput } from "../../../utils/uiUtils/generateToggleInput";
import {
  keyIcon,
  networkIcon,
  userIcon,
  lockIcon,
} from "../../../utils/uiUtils/icons";

export const captchaSettingsView = function () {
  return `<div style='display : none' class='buyer-settings-wrapper captcha-settings-view'>
    ${generateToggleInput(
      "Close Web App on Captcha Trigger",
      { idAbCloseTabToggle },
      "",
      "CommonSettings"
    )}         
    ${generateToggleInput(
      "Auto Solve Captcha",
      { idAbSolveCaptcha },
      "",
      "CommonSettings"
    )}
    ${generateTextInput(
      "Anti-Captcha Key",
      "",
      { idAntiCaptchKey },
      "",
      "CommonSettings",
      "text",
      undefined,
      undefined,
      null,
      keyIcon
    )}
    ${generateTextInput(
      "Proxy Address",
      "",
      { idProxyAddress },
      "",
      "CommonSettings",
      "text",
      undefined,
      undefined,
      null,
      networkIcon
    )}
    ${generateTextInput(
      "Proxy Port",
      "",
      { idProxyPort },
      "",
      "CommonSettings",
      undefined,
      undefined,
      undefined,
      null,
      networkIcon
    )}
    ${generateTextInput(
      "Proxy User Name (Optional)",
      "",
      { idProxyLogin },
      "",
      "CommonSettings",
      "text",
      undefined,
      undefined,
      null,
      userIcon
    )}
    ${generateTextInput(
      "Proxy User Password (Optional)",
      "",
      { idProxyPassword },
      "",
      "CommonSettings",
      "text",
      undefined,
      undefined,
      null,
      lockIcon
    )}
    `;
};
