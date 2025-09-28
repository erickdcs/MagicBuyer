export const cssOverride = () => {
  const style = document.createElement("style");
  $(".ui-orientation-warning").css("display", "none");
  $(".ut-fifa-header-view").css("display", "none");
  style.innerText = `
  .buyer-header {
      font-size: 20px !important;
  }
  .with-fifa-header .ut-root-view {
    height: 100%;
  }
  .buyer-settings {
      width: 100%;
  }
  .buyer-settings-field {
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .phone .buyer-settings-field{
    margin-top: auto;
    margin-bottom: auto;
    width: 100%;
    padding: 10px;
  }
  .buyer-settings-wrapper {
    display: flex; 
    flex-wrap: wrap; 
    margin-top: 20px;
  }
  .buyer-settings-field .ut-toggle-cell-view{
    justify-content: center;
  }
  .buyer-settings-field input:disabled {
    background-color: #c3c6ce;
    cursor: not-allowed;
  }
  .btn-test-notification
  {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  input[type="number"]{
    padding: 0 .5em;
    border-radius: 0;
    background-color: #262c38;
    border: 1px solid #4ee6eb;
    box-sizing: border-box;
    color: #4ee6eb;
    font-family: UltimateTeam,sans-serif;
    font-size: 1em;
    height: 2.8em;
    opacity: 1;
    width: 100%;
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
    background: #222F3E;
    color: white;
    margin-bottom: 1%;
    font-size: 1rem;
    border-radius: 30px;
    display: flex;
    border: solid #2E86DE;
  }
  .cardPalyer:hover {
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
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
    background: #2E86DE;
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
    color: #C8D6E5;
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
    color: #e2dde2;
    text-transform: uppercase;
    background-color: #171826;
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
    color: #fff;
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
    color: #c4f750;
    text-overflow: clip;
  }
  .filterSync:hover {
    background: transparent !important;
  }
  .stats-progress {
    float: right; 
    height: 10px; 
    width: 100px; 
    background: #888; 
    margin: ${isPhone() ? "auto 5px" : "5px 0px 5px 5px"};
  }
  .stats-fill {
    background: #000; 
    height: 10px; 
    width: 0%
  }
  .numericInput:invalid {
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
    color: wheat
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
  .magicbuyer-login-overlay {
    position: fixed;
    inset: 0;
    background: rgba(7, 9, 18, 0.85);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    backdrop-filter: blur(2px);
  }
  .magicbuyer-login-card {
    background: #1a2233;
    border: 1px solid #4ee6eb;
    border-radius: 12px;
    padding: 24px;
    max-width: 360px;
    width: 100%;
    font-family: UltimateTeam, sans-serif;
    color: #f2f2f2;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
  }
  .magicbuyer-login-card h2 {
    margin: 0 0 16px 0;
    text-align: center;
    font-size: 1.4em;
    color: #e8f5ff;
  }
  .magicbuyer-login-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .magicbuyer-login-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.95em;
    color: #c8d6e5;
  }
  .magicbuyer-login-field input {
    background: #0f1724;
    border: 1px solid #4ee6eb;
    color: #ffffff;
    padding: 10px;
    border-radius: 6px;
  }
  .magicbuyer-login-form button {
    background: linear-gradient(120deg, #4ee6eb, #4c6ef5);
    border: none;
    border-radius: 6px;
    color: #0b1320;
    cursor: pointer;
    font-weight: bold;
    padding: 10px;
    text-transform: uppercase;
    transition: filter 0.2s ease;
  }
  .magicbuyer-login-form button:hover:not(:disabled) {
    filter: brightness(1.05);
  }
  .magicbuyer-login-form button:disabled,
  .magicbuyer-login-form button.is-loading {
    cursor: wait;
    filter: grayscale(0.4);
    opacity: 0.7;
  }
  .magicbuyer-login-status {
    min-height: 18px;
    font-size: 0.9em;
    text-align: center;
    color: #c8d6e5;
  }
  .magicbuyer-login-error {
    color: #ff6b6b;
  }
  .magicbuyer-login-success {
    color: #4df59b;
  }
  .magicbuyer-login-footer {
    text-align: center;
    font-size: 0.85em;
    margin-top: 18px;
    color: #a5b1c2;
  }
  .magicbuyer-user-badge {
    margin-left: 12px;
    font-size: 0.8em;
    color: #4ee6eb;
    background: rgba(76, 110, 245, 0.18);
    padding: 4px 8px;
    border-radius: 8px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
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
