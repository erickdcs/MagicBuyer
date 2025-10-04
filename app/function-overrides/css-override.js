export const cssOverride = () => {
  const style = document.createElement("style");
  $(".ui-orientation-warning").css("display", "none");
  $(".ut-fifa-header-view").css("display", "none");
  style.innerText = `
  :root {
    --mb-surface: #20263d;
    --mb-surface-alt: #1a2033;
    --mb-surface-elevated: #2b3452;
    --mb-surface-muted: #232a41;
    --mb-surface-deep: #0b0f1f;
    --mb-accent: #4ee6eb;
    --mb-accent-soft: rgba(78, 230, 235, 0.25);
    --mb-brand: #2e86de;
    --mb-success: #c4f750;
    --mb-highlight: #ab92ff;
    --mb-border-soft: rgba(78, 230, 235, 0.45);
    --mb-border-success: rgba(196, 247, 80, 0.4);
    --mb-border-highlight: rgba(171, 146, 255, 0.35);
    --mb-text: #f5f7ff;
    --mb-text-muted: rgba(245, 247, 255, 0.7);
    --mb-disabled-bg: #3a435f;
    --mb-disabled-text: rgba(245, 247, 255, 0.45);
    --mb-neutral: #8a90a8;
    --mb-link: #f0d7a1;
  }
  .buyer-header {
      font-size: 20px !important;
  }
  .with-fifa-header .ut-root-view {
    height: 100%;
  }
  .buyer-settings {
      width: 100%;
      background: radial-gradient(circle at top, rgba(78, 230, 235, 0.12), transparent 55%),
        linear-gradient(160deg, var(--mb-surface) 0%, var(--mb-surface-alt) 100%);
  }
  .buyer-settings-field {
    margin: 15px 0;
    padding: 18px 20px;
    background: var(--mb-surface-muted);
    border-radius: 18px;
    box-shadow: 0 12px 24px rgba(8, 12, 26, 0.25);
    border: 1px solid transparent;
    transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .field__control {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .field__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    color: var(--mb-accent);
    background: rgba(78, 230, 235, 0.1);
    border-radius: 10px;
    box-shadow: inset 0 0 0 1px var(--mb-border-soft);
  }
  .field__input-wrapper {
    position: relative;
    flex: 1;
  }
  .field__input {
    width: 100%;
    background-color: var(--mb-surface-elevated);
    border: 1px solid var(--mb-border-soft);
    border-radius: 12px;
    box-sizing: border-box;
    color: var(--mb-text);
    font-family: UltimateTeam, sans-serif;
    font-size: 1em;
    padding: 16px 18px;
    transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;
  }
  .field__input::placeholder {
    color: transparent;
  }
  .field__input:focus {
    background-color: var(--mb-surface);
    color: var(--mb-text);
    border-color: var(--mb-accent);
    box-shadow: 0 0 0 3px var(--mb-accent-soft);
    outline: none;
  }
  .field__input:disabled {
    background-color: var(--mb-disabled-bg);
    border-color: transparent;
    color: var(--mb-disabled-text);
    cursor: not-allowed;
  }
  .field__label {
    position: absolute;
    top: 50%;
    left: 18px;
    transform: translateY(-50%);
    color: var(--mb-text-muted);
    font-size: 0.95em;
    pointer-events: none;
    transition: transform 0.2s ease, color 0.2s ease, font-size 0.2s ease, top 0.2s ease;
    background: transparent;
  }
  .field__input:focus + .field__label,
  .field__input:not(:placeholder-shown) + .field__label {
    top: 6px;
    font-size: 0.72em;
    color: var(--mb-accent);
    transform: translateY(0);
    padding: 0 6px;
    background: var(--mb-surface-muted);
    border-radius: 6px;
  }
  .field__helper {
    font-size: 0.8em;
    color: var(--mb-text-muted);
    line-height: 1.4;
  }
  .field--with-icon .field__helper {
    padding-left: 40px;
  }
  .field--with-icon .field__input-wrapper {
    width: 100%;
  }
  .buyer-settings-field:focus-within {
    border-color: var(--mb-accent);
    box-shadow: 0 16px 32px rgba(78, 230, 235, 0.25);
    transform: translateY(-1px);
  }
  .buyer-settings-wrapper {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
  }
  .phone .buyer-settings-field{
    margin-top: auto;
    margin-bottom: auto;
    width: 100%;
    padding: 16px;
  }
  .field-toggle {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .field-toggle__label-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
    color: var(--mb-text);
  }
  .field-toggle__label {
    font-size: 1em;
    font-weight: 600;
    letter-spacing: 0.02em;
  }
  .field-toggle__helper {
    font-size: 0.75em;
    color: var(--mb-text-muted);
    line-height: 1.4;
  }
  .toggle-switch {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    width: 54px;
    height: 30px;
    padding: 0;
    border: none;
    border-radius: 999px;
    background: transparent;
    cursor: pointer;
    transition: transform 0.25s ease;
  }
  .toggle-switch:focus-visible {
    outline: 2px solid var(--mb-accent);
    outline-offset: 2px;
  }
  .toggle-switch__track {
    position: absolute;
    inset: 0;
    background: var(--mb-disabled-bg);
    border-radius: 999px;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
    transition: background-color 0.25s ease, box-shadow 0.25s ease;
  }
  .toggle-switch__thumb {
    position: absolute;
    left: 4px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--mb-text);
    box-shadow: 0 6px 16px rgba(8, 12, 26, 0.35);
    transition: transform 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease;
  }
  .toggle-switch.is-on .toggle-switch__track {
    background: linear-gradient(135deg, var(--mb-accent) 0%, var(--mb-highlight) 100%);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.25);
  }
  .toggle-switch.is-on .toggle-switch__thumb {
    transform: translateX(24px);
    background: var(--mb-surface);
    box-shadow: 0 6px 18px rgba(171, 146, 255, 0.35);
  }
  .btn-standard {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 0.85rem 1.8rem;
    border-radius: 16px;
    border: 1px solid var(--mb-border-soft);
    background: linear-gradient(135deg, rgba(78, 230, 235, 0.15), rgba(171, 146, 255, 0.15));
    color: var(--mb-text);
    font-family: UltimateTeam, sans-serif;
    font-size: 1em;
    font-weight: 600;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.25s ease, background-color 0.25s ease, border-color 0.25s ease;
  }
  .btn-standard__label {
    display: inline-flex;
    align-items: center;
  }
  .btn-standard__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.2em;
    height: 1.2em;
    color: inherit;
  }
  .btn-standard__icon svg {
    width: 100%;
    height: 100%;
  }
  .btn-standard--compact {
    padding: 0.6rem 1.2rem;
    font-size: 0.9em;
  }
  .btn-standard--spacious {
    padding: 1.1rem 2.3rem;
    font-size: 1.05em;
  }
  .btn-standard.is-hover,
  .btn-standard:hover {
    border-color: var(--mb-accent);
    background: linear-gradient(135deg, rgba(78, 230, 235, 0.3), rgba(171, 146, 255, 0.3));
    box-shadow: 0 12px 24px rgba(78, 230, 235, 0.25);
    transform: translateY(-1px);
  }
  .btn-standard.is-active,
  .btn-standard:active {
    transform: translateY(0);
    box-shadow: 0 6px 14px rgba(8, 12, 26, 0.35);
    background: linear-gradient(135deg, rgba(78, 230, 235, 0.45), rgba(171, 146, 255, 0.4));
  }
  .btn-standard.is-focus,
  .btn-standard:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--mb-accent-soft), 0 10px 22px rgba(78, 230, 235, 0.2);
    border-color: var(--mb-accent);
  }
  .btn-standard:disabled {
    background: var(--mb-disabled-bg);
    border-color: transparent;
    color: var(--mb-disabled-text);
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
  .btn-test-notification
  {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .field__input:hover:not(:disabled) {
    border-color: var(--mb-accent);
    box-shadow: 0 10px 20px rgba(8, 12, 26, 0.2);
  }
  .autoBuyerLog {
    font-size: ${!isPhone() ? "15px" : "13px"};
    height: 50%;
  }
  .cardPalyerLi {
    width: 100%;
  }
  .cardPalyer {
    transition: 0.3s;
    width: 80%;
    background: var(--mb-surface);
    color: var(--mb-text);
    margin-bottom: 1%;
    font-size: 1rem;
    border-radius: 30px;
    display: flex;
    border: solid var(--mb-brand);
    box-shadow: 0 12px 24px rgba(8, 12, 26, 0.3);
  }
  .cardPalyer:hover {
    box-shadow: 0 16px 30px rgba(78, 230, 235, 0.2);
    transform: translateY(-2px);
  }
  .container {
    display: flex;
    width: 100%;
  }
  .contentContainer {
    padding: 4%;
    width: 100%;
  }
  .typeContent {
    width: 300px;
    background: var(--mb-brand);
    height: 100%;
    border-radius: 30px;
    border-radius-right: 20px;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .typeContentText {
    font-size: 7rem;
    color: var(--mb-text-muted);
  }
  .searchLog {
    font-size: 10px; 
    height: 50%;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] {
    -moz-appearance: textfield;
  }
  .captcha-settings-view input,
  .notification-settings-view input {
    text-transform: none;
  }
  .phone .buyer-header{
    font-size: 1.2em !important;
  }
  .phone .buyer-actions .btn-standard{
    padding: 0;
    font-size: 1.2em;
    text-overflow: unset;
  }
  .filter-header-settings {
    width: 100%;
    padding: 10px;
    font-family: UltimateTeamCondensed, sans-serif;
    font-size: 1.6em;
    color: var(--mb-text-muted);
    text-transform: uppercase;
    background-color: var(--mb-surface-alt);
  }
  .selected-filters-container {
    background: var(--mb-surface-muted);
    border: 1px solid var(--mb-border-soft);
    border-radius: 20px;
    box-shadow: 0 18px 32px rgba(8, 12, 26, 0.28);
    transition: box-shadow 0.3s ease, border-color 0.3s ease;
  }
  .selected-filters-container:hover,
  .selected-filters-container:focus-within {
    border-color: var(--mb-accent);
    box-shadow: 0 24px 38px rgba(78, 230, 235, 0.28);
  }
  .selected-filters-list {
    background-color: var(--mb-surface-alt);
    border: 1px solid var(--mb-accent);
    border-radius: 6px;
  }
  .filter-loader-block {
    background: var(--mb-surface-muted);
    border: 1px solid var(--mb-border-success);
    border-radius: 20px;
    box-shadow: 0 18px 32px rgba(8, 12, 26, 0.28);
    transition: box-shadow 0.3s ease, border-color 0.3s ease;
  }
  .filter-loader-block:hover,
  .filter-loader-block:focus-within {
    border-color: var(--mb-success);
    box-shadow: 0 24px 38px rgba(196, 247, 80, 0.28);
  }
  .filter-loader {
    background-color: var(--mb-surface-deep);
    border: 1px solid var(--mb-success);
    border-radius: 6px;
  }
  .filter-sync-block,
  .filter-actions-block {
    background: var(--mb-surface-muted);
    border: 1px solid var(--mb-border-highlight);
    border-radius: 20px;
    box-shadow: 0 18px 32px rgba(8, 12, 26, 0.28);
    transition: box-shadow 0.3s ease, border-color 0.3s ease;
  }
  .filter-sync-block:hover,
  .filter-sync-block:focus-within,
  .filter-actions-block:hover,
  .filter-actions-block:focus-within {
    border-color: var(--mb-highlight);
    box-shadow: 0 24px 38px rgba(171, 146, 255, 0.25);
  }
  .filter-sync-actions,
  .filter-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .filter-sync-actions .btn-standard,
  .filter-actions .btn-standard {
    flex: 1 1 45%;
    background: var(--mb-accent-soft);
    color: var(--mb-text);
    border-radius: 14px;
    border: 1px solid var(--mb-accent);
  }
  .filter-sync-actions .btn-standard:hover,
  .filter-actions .btn-standard:hover,
  .filter-sync-actions .btn-standard.is-hover,
  .filter-actions .btn-standard.is-hover {
    background: var(--mb-accent);
    color: var(--mb-surface-deep);
    box-shadow: 0 12px 24px rgba(78, 230, 235, 0.3);
  }
  .filter-sync-actions .btn-standard:focus,
  .filter-actions .btn-standard:focus,
  .filter-sync-actions .btn-standard.is-focus,
  .filter-actions .btn-standard.is-focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--mb-accent-soft);
  }
  .filter-sync-actions .btn-standard:disabled,
  .filter-actions .btn-standard:disabled {
    background: var(--mb-disabled-bg);
    color: var(--mb-disabled-text);
    border-color: transparent;
    box-shadow: none;
    transform: none;
  }
  .btn-save-filter {
    width:100%
  }
  .btn-delete-filter {
    width:50%
  }
  .multiple-filter {
    width: 100%  !important;
    display: flex  !important;
    justify-content: center;
    align-items: center;
  }
  .logs-container {
    display: flex;
    justify-content: space-between;
    font-size: 20px;
    align-items: center;
  }
  .button-clear button {
    color: var(--mb-text);
    background-color: unset;
    height: unset;
    line-height: unset;
  }
  .top-nav{
    display:flex; 
  }
  .ut-navigation-button-control.menu-btn:before {
    content: "≡";
    transform: unset;
  }
  .menu-btn {
    min-width: 0px;
    margin-left: 5px;
  }
  .filterSync {
    background: transparent;
    color: var(--mb-success);
    text-overflow: clip;
  }
  .filterSync:hover {
    background: transparent !important;
  }
  .stats-progress {
    float: right;
    height: 10px;
    width: 100px;
    background: var(--mb-neutral);
    margin: ${isPhone() ? "auto 5px" : "5px 0px 5px 5px"};
  }
  .stats-fill {
    background: var(--mb-surface-deep);
    height: 10px;
    width: 0%
  }
  .field__input:invalid {
    color: red;
    border: 1px solid;
  }
  .ignore-players{
    width: 100%;
    display: flex;
    background: transparent;
  }
  .ignore-players .ut-player-search-control{
    width: 90% !important;
  }
  .ignore-players filterSync{
    flex: unset;
  }
  .font15 {
    font-size: 15px;
  }  
  .action-icons {
    display: unset !important;
    width: 10%
  }
  .displayCenterFlx {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .displayNone {
    height: 275px;
  }
  .displayNone .inline-list-select,
  .displayNone .search-prices,
  .displayNone .btn-actions,
  .displayNone .btn-filters,
  .displayNone .btn-report,
  .displayNone .buyer-actions .btn-other {
    display: none !important;
  }
  .mrg10 {
    margin: 10px;
  }
  .ut-toggle-cell-view--label{
    overflow: unset;
  }
  .download-stats {
    line-height: 1;
    display: flex;
  }
  .btn-report {
    display: flex;
    justify-content: center;
  }
  small{
    white-space: break-spaces;
  }  
  .joinServer {
    position: absolute;
    right: 25px;
    top: 50%;
    color: var(--mb-link)
  }
  .phone .joinServer{
    display: none;
  }
  textarea {
    resize: none;
  }  
  .logWrapper {
    position: relative;
    height: 100%
  }
  .ut-navigation-bar-view .view-navbar-currency-coins.ab:before {
    content: unset !important;
  }
  .ut-navigation-bar-view .view-navbar-currency-coins.ab {
    cursor: unset !important;
  } 
  .auto-buyer .autoBuyMin{
    display: none;
  }
  .auto-buyer .search-prices .settings-field{
    display: none;
  }
  `;
  style.innerText += getScrollBarStyle();
  document.head.appendChild(style);
};

const getScrollBarStyle = () => {
  return `
  ::-webkit-scrollbar {
    -webkit-appearance: none;
  }
  ::-webkit-scrollbar:vertical {
      width: 12px;
  }
  ::-webkit-scrollbar:horizontal {
      height: 12px;
  }
  ::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, .5);
      border-radius: 10px;
      border: 2px solid #ffffff;
  }
  ::-webkit-scrollbar-track {
      border-radius: 10px;
      background-color: #ffffff;
  }`;
};
