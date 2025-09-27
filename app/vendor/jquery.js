const globalScope = typeof window !== "undefined" ? window : globalThis;

const jquery = (() => {
  if (globalScope.jQuery) {
    return globalScope.jQuery;
  }

  if (globalScope.$) {
    return globalScope.$;
  }

  throw new Error(
    "MagicBuyer: jQuery is not available in the current context."
  );
})();

globalScope.$ = jquery;
globalScope.jQuery = jquery;

export default jquery;
