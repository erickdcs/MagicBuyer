(() => {
  const SCRIPT_ID = "magicbuyer-page-script";
  if (document.getElementById(SCRIPT_ID)) {
    return;
  }

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.src = chrome.runtime.getURL("dist/magicbuyer.js");
  script.type = "text/javascript";
  script.onload = () => {
    script.remove();
  };

  (document.head || document.documentElement).appendChild(script);
})();
