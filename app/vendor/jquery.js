import jquery from "jquery";

const globalScope = typeof window !== "undefined" ? window : globalThis;

globalScope.$ = jquery;
globalScope.jQuery = jquery;
export default jquery;
