(()=>{"use strict";var e={d:(t,n)=>{for(var i in n)e.o(n,i)&&!e.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:n[i]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{idAbActiveTransfers:()=>ze,idAbAddBuyDelay:()=>ue,idAbAddFilterGK:()=>me,idAbAvailableItems:()=>je,idAbBidExact:()=>X,idAbBidFutBin:()=>Ct,idAbBuyPrice:()=>z,idAbCardCount:()=>G,idAbCloseTabToggle:()=>fe,idAbCoins:()=>Le,idAbCountDown:()=>Pt,idAbCustomDiscordNameNotificationToggle:()=>be,idAbCycleAmount:()=>te,idAbDelayToAdd:()=>pe,idAbDontMoveWon:()=>Tt,idAbDownloadFilter:()=>lt,idAbDownloadStats:()=>It,idAbFiltersFileToUpload:()=>ht,idAbFiltersToUpload:()=>ct,idAbIgnoreAllowToggle:()=>wt,idAbItemExpiring:()=>Y,idAbMaxBid:()=>J,idAbMaxPurchases:()=>Wt,idAbMaxRating:()=>re,idAbMaxSearchPage:()=>de,idAbMessageNotificationToggle:()=>ge,idAbMinDeleteCount:()=>Q,idAbMinRating:()=>se,idAbNumberFilterSearch:()=>Ge,idAbOverSearchWarning:()=>Ot,idAbPauseFor:()=>ne,idAbProfit:()=>dt,idAbRandMinBidInput:()=>oe,idAbRandMinBidToggle:()=>ce,idAbRandMinBuyInput:()=>ae,idAbRandMinBuyToggle:()=>le,idAbReportProblem:()=>xt,idAbRequestCount:()=>Ue,idAbResumeAfterErrorOccured:()=>Bt,idAbSearchProgress:()=>Re,idAbSearchResult:()=>q,idAbSellPrice:()=>K,idAbSellToggle:()=>Z,idAbSendListingNotificationToggle:()=>he,idAbShouldSort:()=>Et,idAbSoldItems:()=>Ve,idAbSolveCaptcha:()=>Ne,idAbSortBy:()=>_t,idAbSortOrder:()=>Mt,idAbSoundToggle:()=>ye,idAbStatisticsProgress:()=>ke,idAbStatus:()=>We,idAbStopAfter:()=>ie,idAbStopErrorCode:()=>Je,idAbStopErrorCodeCount:()=>qe,idAbToggleRunner:()=>At,idAbUnsoldItems:()=>He,idAbUploadBtn:()=>yt,idAbUploadFilter:()=>at,idAbUseFutWiz:()=>Vt,idAbWaitTime:()=>ee,idAddIgnorePlayers:()=>mt,idAddIgnorePlayersList:()=>gt,idAntiCaptchKey:()=>tt,idAutoClearExpired:()=>vt,idAutoClearLog:()=>it,idBtnActions:()=>Dt,idBtnReport:()=>Nt,idBuyFutBinPercent:()=>$t,idBuyFutBinPrice:()=>St,idCalcBinPrice:()=>_e,idCapatchaMp3:()=>Ke,idClearLogButton:()=>Ie,idDeleteFilter:()=>De,idDiscordChannelId:()=>Ae,idDiscordToken:()=>$e,idFUTMarketAlertToken:()=>Ce,idFilterDropdown:()=>V,idFilterDropdownHeader:()=>H,idFinishMp3:()=>Ut,idFutBinDuration:()=>bt,idInfoWrapper:()=>xe,idLog:()=>Lt,idNotificationType:()=>Se,idPreserveChanges:()=>Pe,idProgressAutobuyer:()=>Te,idProxyAddress:()=>Qe,idProxyLogin:()=>et,idProxyPassword:()=>nt,idProxyPort:()=>Ze,idRemoveIgnorePlayers:()=>ft,idRunFilterSequential:()=>pt,idSearchCancelButton:()=>Be,idSearchWrapper:()=>Ye,idSelectFilterCount:()=>Ee,idSelectedFilter:()=>j,idSellAfterTax:()=>Fe,idSellCheckBuyPrice:()=>ut,idSellFutBinPercent:()=>ot,idSellFutBinPrice:()=>rt,idSellRatingThreshold:()=>st,idSession:()=>Rt,idTelegramBotToken:()=>ve,idTelegramChatId:()=>we,idTestNotification:()=>Me,idTooltip:()=>Ft,idWebHookUrl:()=>kt,idWinCount:()=>Oe,idWinMp3:()=>Xe});var n={};e.r(n),e.d(n,{R:()=>Ki,T:()=>Qi});const i=typeof window!=="undefined"?window:globalThis,s=(()=>{if(i.jQuery)return i.jQuery;if(i.$)return i.$;const globalScope = i;

const directEventMap = new WeakMap();
const delegatedEventMap = new WeakMap();

const isElement = (value) => value instanceof Element;

const toArray = (value) => {
  if (!value) return [];
  if (value instanceof MiniQueryCollection) {
    return value.toArray();
  }
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  if (value instanceof NodeList || value instanceof HTMLCollection) {
    return Array.from(value).filter(Boolean);
  }
  if (
    value instanceof Element ||
    value instanceof Document ||
    value === globalScope
  ) {
    return [value];
  }
  return [];
};

const createElementsFromHTML = (html) => {
  const template = globalScope.document?.createElement?.("template");
  if (!template) {
    return [];
  }
  template.innerHTML = html.trim();
  return Array.from(template.content.childNodes);
};

const resolveSelectorElements = (selector, context) => {
  if (selector instanceof MiniQueryCollection) {
    return selector.toArray();
  }

  if (typeof selector === "function") {
    const readyState = globalScope.document?.readyState;
    if (readyState === "complete" || readyState === "interactive") {
      selector();
    } else {
      globalScope.document?.addEventListener?.(
        "DOMContentLoaded",
        selector,
        { once: true }
      );
    }
    return [];
  }

  if (typeof selector === "string") {
    const trimmed = selector.trim();
    if (trimmed.startsWith("<") && trimmed.endsWith(">")) {
      return createElementsFromHTML(trimmed);
    }
    const ctxNodes = context
      ? resolveSelectorElements(context)
      : [globalScope.document];
    const result = [];
    ctxNodes.forEach((ctx) => {
      if (!ctx?.querySelectorAll) return;
      result.push(...Array.from(ctx.querySelectorAll(trimmed)));
    });
    return result;
  }

  return toArray(selector);
};

const normalizeClassList = (value) =>
  (value || "")
    .toString()
    .split(/\s+/)
    .map((cls) => cls.trim())
    .filter(Boolean);

const normalizeStyleProperty = (prop) =>
  prop.replace(/-([a-z])/g, (_, chr) => chr.toUpperCase());

const cssNumberProperties = new Set(["opacity", "zIndex", "fontWeight", "zoom"]);

const matchesWithinRoot = (root, target, selector) => {
  if (!(target instanceof Element)) {
    return null;
  }
  const matched = target.closest(selector);
  if (!matched) {
    return null;
  }
  if (root === globalScope.document || root === matched) {
    return matched;
  }
  return root?.contains?.(matched) ? matched : null;
};

class MiniQueryCollection {
  constructor(elements = []) {
    this.elements = elements.filter(Boolean);
    this.length = this.elements.length;
    this.elements.forEach((element, index) => {
      this[index] = element;
    });
  }

  toArray() {
    return this.elements.slice();
  }

  each(callback) {
    this.elements.forEach((element, index) => {
      callback.call(element, index, element);
    });
    return this;
  }

  first() {
    return new MiniQueryCollection(this.length ? [this.elements[0]] : []);
  }

  addClass(classNames) {
    const classes = normalizeClassList(classNames);
    if (!classes.length) {
      return this;
    }
    return this.each(function () {
      this.classList?.add(...classes);
    });
  }

  removeClass(classNames) {
    const classes = normalizeClassList(classNames);
    if (!classes.length) {
      return this;
    }
    return this.each(function () {
      this.classList?.remove(...classes);
    });
  }

  toggleClass(className, state) {
    if (!className) {
      return this;
    }
    const hasExplicitState = typeof state === "boolean";
    return this.each(function () {
      if (!this.classList) return;
      if (hasExplicitState) {
        this.classList.toggle(className, state);
      } else {
        this.classList.toggle(className);
      }
    });
  }

  attr(name, value) {
    if (value === undefined) {
      const element = this.elements[0];
      return isElement(element) ? element.getAttribute(name) : undefined;
    }
    return this.each(function () {
      if (!isElement(this)) return;
      if (value === null || value === undefined) {
        this.removeAttribute(name);
      } else {
        this.setAttribute(name, value);
      }
    });
  }

  removeAttr(name) {
    return this.each(function () {
      if (isElement(this)) {
        this.removeAttribute(name);
      }
    });
  }

  prop(name, value) {
    if (value === undefined) {
      const element = this.elements[0];
      return element ? element[name] : undefined;
    }
    return this.each(function () {
      this[name] = value;
    });
  }

  val(value) {
    const element = this.elements[0];
    if (value === undefined) {
      if (!element) return undefined;
      if (element instanceof HTMLSelectElement && element.multiple) {
        return Array.from(element.selectedOptions).map((opt) => opt.value);
      }
      return element.value ?? "";
    }
    return this.each(function () {
      if (this instanceof HTMLSelectElement && this.multiple && Array.isArray(value)) {
        const selected = new Set(value.map((val) => `${val}`));
        Array.from(this.options).forEach((option) => {
          option.selected = selected.has(`${option.value}`);
        });
      } else if (Array.isArray(value)) {
        this.value = value[0] ?? "";
      } else if (value === null || value === undefined) {
        this.value = "";
      } else {
        this.value = value;
      }
    });
  }

  html(value) {
    if (value === undefined) {
      const element = this.elements[0];
      return element ? element.innerHTML : undefined;
    }
    return this.each(function () {
      this.innerHTML = value ?? "";
    });
  }

  text(value) {
    if (value === undefined) {
      const element = this.elements[0];
      return element ? element.textContent : undefined;
    }
    return this.each(function () {
      this.textContent = value ?? "";
    });
  }

  css(property, value) {
    if (typeof property === "string" && value === undefined) {
      const element = this.elements[0];
      if (!isElement(element)) {
        return undefined;
      }
      const styleName = normalizeStyleProperty(property);
      return globalScope.getComputedStyle?.(element)?.[styleName];
    }

    const styles =
      typeof property === "object" && property !== null
        ? property
        : { [property]: value };

    return this.each(function () {
      if (!isElement(this)) return;
      Object.entries(styles).forEach(([prop, val]) => {
        if (val === undefined || val === null) return;
        const styleName = normalizeStyleProperty(prop);
        let valueToApply = val;
        if (typeof valueToApply === "number" && !cssNumberProperties.has(styleName)) {
          valueToApply = `${valueToApply}px`;
        }
        this.style[styleName] = valueToApply;
      });
    });
  }

  _resolveContent(content) {
    const nodes = resolveSelectorElements(content);
    if (!nodes.length) {
      return [];
    }
    return nodes.map((node) =>
      node instanceof Node ? node : globalScope.document?.createTextNode?.(`${node}`)
    );
  }

  append(content) {
    const nodes = this._resolveContent(content);
    if (!nodes.length) {
      return this;
    }
    return this.each(function (index) {
      const isFirst = index === 0;
      nodes.forEach((node) => {
        const toInsert = isFirst ? node : node.cloneNode(true);
        this.appendChild(toInsert);
      });
    });
  }

  prepend(content) {
    const nodes = this._resolveContent(content);
    if (!nodes.length) {
      return this;
    }
    return this.each(function (index) {
      const isFirst = index === 0;
      const reference = this.firstChild;
      nodes.forEach((node) => {
        const toInsert = isFirst ? node : node.cloneNode(true);
        this.insertBefore(toInsert, reference);
      });
    });
  }

  insertAfter(target) {
    const targets = resolveSelectorElements(target);
    if (!targets.length) {
      return this;
    }
    const nodes = this.toArray();
    targets.forEach((targetNode, targetIndex) => {
      const parent = targetNode?.parentNode;
      if (!parent) return;
      nodes.forEach((node, nodeIndex) => {
        const shouldClone = targetIndex !== 0 || nodeIndex !== 0;
        const toInsert = shouldClone ? node.cloneNode(true) : node;
        parent.insertBefore(toInsert, targetNode.nextSibling);
      });
    });
    return this;
  }

  insertBefore(target) {
    const targets = resolveSelectorElements(target);
    if (!targets.length) {
      return this;
    }
    const nodes = this.toArray();
    targets.forEach((targetNode, targetIndex) => {
      const parent = targetNode?.parentNode;
      if (!parent) return;
      nodes.forEach((node, nodeIndex) => {
        const shouldClone = targetIndex !== 0 || nodeIndex !== 0;
        const toInsert = shouldClone ? node.cloneNode(true) : node;
        parent.insertBefore(toInsert, targetNode);
      });
    });
    return this;
  }

  remove() {
    return this.each(function () {
      this.parentNode?.removeChild?.(this);
    });
  }

  find(selector) {
    const found = [];
    this.each(function () {
      if (!this.querySelectorAll) return;
      found.push(...Array.from(this.querySelectorAll(selector)));
    });
    return new MiniQueryCollection(found);
  }

  filter(criteria) {
    let filtered = [];
    if (typeof criteria === "function") {
      filtered = this.elements.filter((element, index) =>
        !!criteria.call(element, index, element)
      );
    } else if (typeof criteria === "string") {
      if (criteria === ":selected") {
        filtered = this.elements.filter((element) => element?.selected);
      } else {
        filtered = this.elements.filter((element) =>
          element?.matches?.(criteria)
        );
      }
    } else {
      filtered = this.elements.filter((element) => element === criteria);
    }
    return new MiniQueryCollection(filtered);
  }

  trigger(eventName, detail) {
    if (!eventName) {
      return this;
    }
    const names = eventName.split(/\s+/).filter(Boolean);
    return this.each(function () {
      names.forEach((name) => {
        const init = { bubbles: true, cancelable: true };
        const event =
          detail === undefined
            ? new Event(name, init)
            : new CustomEvent(name, { ...init, detail });
        this.dispatchEvent(event);
      });
    });
  }

  click(handler) {
    if (handler) {
      return this.on("click", handler);
    }
    return this.trigger("click");
  }

  on(events, selector, handler) {
    if (!events) {
      return this;
    }

    if (typeof events === "object" && events !== null) {
      Object.entries(events).forEach(([eventName, fn]) => {
        this.on(eventName, selector, fn);
      });
      return this;
    }

    if (typeof selector === "function" || selector === false) {
      handler = selector;
      selector = undefined;
    }

    if (typeof handler !== "function") {
      return this;
    }

    const eventNames = events.split(/\s+/).filter(Boolean);
    return this.each(function () {
      const element = this;
      eventNames.forEach((eventName) => {
        if (selector) {
          const wrapper = (event) => {
            const match = matchesWithinRoot(element, event.target, selector);
            if (match) {
              handler.call(match, event);
            }
          };
          const stored = delegatedEventMap.get(element) || {};
          const listeners = stored[eventName] || [];
          listeners.push({ selector, handler, wrapper });
          stored[eventName] = listeners;
          delegatedEventMap.set(element, stored);
          element.addEventListener(eventName, wrapper);
        } else {
          const wrapper = (event) => handler.call(element, event);
          const stored = directEventMap.get(element) || {};
          const listeners = stored[eventName] || [];
          listeners.push({ handler, wrapper });
          stored[eventName] = listeners;
          directEventMap.set(element, stored);
          element.addEventListener(eventName, wrapper);
        }
      });
    });
  }

  off(events, selector, handler) {
    if (!events) {
      return this;
    }

    if (typeof events === "object" && events !== null) {
      Object.entries(events).forEach(([eventName, fn]) => {
        this.off(eventName, selector, fn);
      });
      return this;
    }

    if (typeof selector === "function" || selector === false) {
      handler = selector;
      selector = undefined;
    }

    const eventNames = events.split(/\s+/).filter(Boolean);
    return this.each(function () {
      const element = this;
      eventNames.forEach((eventName) => {
        if (selector) {
          const stored = delegatedEventMap.get(element);
          if (!stored) return;
          const listeners = stored[eventName] || [];
          for (let i = listeners.length - 1; i >= 0; i -= 1) {
            const item = listeners[i];
            if (item.selector !== selector) continue;
            if (handler && item.handler !== handler) continue;
            element.removeEventListener(eventName, item.wrapper);
            listeners.splice(i, 1);
          }
          if (!listeners.length) {
            delete stored[eventName];
          }
          if (!Object.keys(stored).length) {
            delegatedEventMap.delete(element);
          }
        } else {
          const stored = directEventMap.get(element);
          if (!stored) return;
          const listeners = stored[eventName] || [];
          for (let i = listeners.length - 1; i >= 0; i -= 1) {
            const item = listeners[i];
            if (handler && item.handler !== handler) continue;
            element.removeEventListener(eventName, item.wrapper);
            listeners.splice(i, 1);
          }
          if (!listeners.length) {
            delete stored[eventName];
          }
          if (!Object.keys(stored).length) {
            directEventMap.delete(element);
          }
        }
      });
    });
  }

  animate(properties) {
    if (!properties) {
      return this;
    }
    return this.each(function () {
      Object.entries(properties).forEach(([prop, value]) => {
        if (prop === "scrollTop" || prop === "scrollLeft") {
          this[prop] = typeof value === "number" ? value : parseFloat(value) || 0;
        } else {
          $(this).css(prop, value);
        }
      });
    });
  }
}

const $ = function (selector, context) {
  const elements = resolveSelectorElements(selector, context);
  return new MiniQueryCollection(elements);
};

$.fn = MiniQueryCollection.prototype;

$.isEmptyObject = (obj) => {
  if (!obj || typeof obj !== "object") {
    return true;
  }
  return Object.keys(obj).length === 0;
};

$.each = (collection, callback) => {
  if (!collection) {
    return collection;
  }
  if (Array.isArray(collection) || collection instanceof MiniQueryCollection) {
    const items = collection instanceof MiniQueryCollection ? collection.toArray() : collection;
    items.forEach((item, index) => {
      callback.call(item, index, item);
    });
  } else if (typeof collection === "object") {
    Object.keys(collection).forEach((key) => {
      callback.call(collection[key], key, collection[key]);
    });
  }
  return collection;
};
return $;})();i.$=s;i.jQuery=s;const r="Paused",o="Stopped",a={521:"Request Rejected",512:"Request Rejected",429:"Too many request from this user",426:"Other user won the (card / bid)",461:"Other user won the (card / bid)"},l={idBuyFutBinPercent:95,idAbCardCount:1e3,idAbCardCountisDefaultValue:!0,idAbItemExpiring:"1H",idAbItemExpiringisDefaultValue:!0,idAbSearchResult:21,idAbSearchResultisDefaultValue:!0,idSellFutBinPercent:"105-110",idFutBinDuration:"1H",idFutBinDurationisDefaultValue:!0,idAbMinDeleteCount:10,idSellRatingThreshold:100,idSellRatingThresholdisDefaultValue:!0,idAbMinRating:10,idAbMinRatingisDefaultValue:!0,idAbMaxRating:100,idAbMaxRatingisDefaultValue:!0,idAbMaxSearchPage:5,idAbMaxSearchPageisDefaultValue:!0,idAbRandMinBidInput:300,idAbRandMinBidInputisDefaultValue:!0,idAbRandMinBuyInput:300,idAbRandMinBuyInputisDefaultValue:!0,idBuyFutBinPrice:!0,idSellFutBinPrice:!0,idSellCheckBuyPrice:!0,idAbSellToggle:!1,idAbRandMinBidToggle:!0},c={idAbAddBuyDelay:!0,idAbCycleAmount:"15-20",idAbDelayToAdd:"3S",idAbMaxPurchases:1,idAbNumberFilterSearch:3,idAbNumberFilterSearchisDefaultValue:!0,idAbPauseFor:"15-30S",idAbSoundToggle:!0,idAbStopAfter:"1-2H",idAbStopErrorCodeCount:3,idAbWaitTime:"5-8",idAbWaitTimeisDefaultValue:!1,idAutoClearExpired:!0,idAutoClearLog:!0},d=!!window.ReactNativeWebView;let u;const p=()=>{let e=(window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB||window.shimIndexedDB).open("userDatasAB",2);e.onupgradeneeded=function(t){u=e.result;try{t.oldVersion<1&&u.createObjectStore("Filters",{keyPath:"filterName"}),t.oldVersion<2&&u.createObjectStore("CommonSettings",{keyPath:"filterName"})}catch(t){}},e.onsuccess=function(){u=e.result}},m=e=>new Promise((t,n)=>{const i=u.transaction("Filters","readwrite");i.objectStore("Filters").delete(e),i.oncomplete=function(){t()},i.onerror=function(){n()}}),f=(e,t,n="Filters")=>new Promise((i,s)=>{const r=u.transaction(n,"readwrite");r.objectStore(n).put({filterName:e,jsonData:t}),r.oncomplete=function(){i()},r.onerror=function(){s()}}),g=(e="Filters")=>new Promise((t,n)=>{const i=u.transaction(e,"readonly").objectStore(e).getAll();i.onsuccess=function(){const e={};if(i.result.length)for(let t=0;t<i.result.length;t++)e[i.result[t].filterName]=i.result[t].jsonData;t(e)},i.onerror=function(){n()}}),b=(e="Filters")=>g(e),h=(e,t,n="Filters")=>f(e,t,n),y=new Map,v=(e,t)=>{y.set(e,t)},w=e=>{const t=y.get(e);return t&&t.expiryTimeStamp&&t.expiryTimeStamp<Date.now()?(y.delete(e),null):t},S=(e=!1)=>{const t=w("BuyerSettings")||{};if(e)return t;const n=w("CommonSettings")||{};return Object.assign({},t,n)},A=e=>{let t=w(e)||0;return t++,v(e,t),t},C=()=>((w("CommonSettings")||{}).idAbUseFutWiz?"futwiz":"futbin").toUpperCase(),T=()=>{let e=window.XMLHttpRequest.prototype.open;window.XMLHttpRequest.prototype.open=function(t,n,i){this.addEventListener("readystatechange",function(){if(4===this.readyState)if(d&&this.responseURL.includes("/ut/game/fifa23/usermassinfo")){let e=JSON.parse(this.responseText);if(e){const{personaId:t,personaName:n}=e.userInfo,i=w("useremail");window.ReactNativeWebView.postMessage(JSON.stringify({payload:{personaId:t,personaName:n,userEmail:i,language:services.Localization.locale.language},type:"initUser"}))}}else if(d&&this.responseURL.includes("/ut/game/fifa23/tradepile")){let e=JSON.parse(this.responseText);if(e){const t=e.auctionInfo.filter(e=>e.itemData.assetId).map(({itemData:e})=>{const{id:t,assetId:n,definitionId:i,rareflag:s,rating:r}=e;return{id:t,assetId:n,definitionId:i,rareflag:s,rating:r}});window.ReactNativeWebView.postMessage(JSON.stringify({payload:t,type:"transferList"}))}}else if(this.responseURL.includes("https://gateway.ea.com/proxy/identity/pids/me")){let e=JSON.parse(this.responseText);e&&e.pid&&!w("useremail")&&v("useremail",e.pid.email)}},!1),e.call(this,t,n,i)}},B=e=>{let t="",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(var i=0;i<e;i++)t+=n.charAt(Math.floor(62*Math.random()));return t},x=async(e=1)=>{const t=Math.floor(Math.random());await new Promise(n=>setTimeout(n,1e3*(t+e)))},P=(e,t)=>{window.ReactNativeWebView.postMessage(JSON.stringify({type:"downloadFile",payload:{data:JSON.stringify(e,null,4),fileName:t}}))},I=(e,t)=>{window.ReactNativeWebView.postMessage(JSON.stringify({type:"downloadFile",payload:{data:e,fileName:t}}))},_=(e,t)=>{const n="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(e,null,4)),i=document.createElement("a");i.setAttribute("href",n),i.setAttribute("download",`${t}.json`),document.body.appendChild(i),i.click(),document.body.removeChild(i)},M=(e,t)=>{const n="data:text/csv;charset=utf-8,%EF%BB%BF"+encodeURIComponent(e),i=document.createElement("a");i.setAttribute("href",n),i.setAttribute("download",`${t}.csv`),document.body.appendChild(i),i.click(),document.body.removeChild(i)},E=e=>{if(e){let t=(e+="")[e.length-1].toUpperCase(),n=N(e.substring(0,e.length-1))/1e3;return n&&(n*="M"===t?60:"H"===t?3600:1),n}return 0},D=e=>{const t=k(e);return t.length>=2?R(t[0],t[1]):t[0]||0},N=e=>{if(e){const[t,n]=e.split("-").map(e=>parseInt(e));return 1e3*Math.round(Math.random()*(n-t)+t)}return 0},F=e=>{if(e){let t=e[e.length-1].toUpperCase(),n=parseInt(e.substring(0,e.length-1));return n&&(n*="M"===t?60:"H"===t?3600:1),n}return 0},R=(e,t)=>Math.round(Math.random()*(t-e)+e),k=e=>e?(e+"").split("-").map(e=>parseInt(e)):[],U=(e,t)=>(e.length<=t&&(e+=" ".repeat(t-e.length)),e),L=function(e){const t=S();if(!d&&t.idAbSoundToggle){let t=document.getElementById(Xe);"capatcha"==e?t=document.getElementById(Ke):"finish"==e?t=document.getElementById(Ut):"cardWon"==e&&(t=document.getElementById(Xe)),t.currentTime=0,t.play()}},O=function(e){if(!e)return 0;var t=(new Date).getTime();return Math.max(0,e.end-t)/(e.end-e.start)*100},W=function(e){for(let n of Object.keys(e)){const i=e[n];if(e[n+"isDefaultValue"])continue;const s=`#${t[n]}`;if("boolean"==typeof i){if(i){$(s).addClass("toggled");continue}$(s).removeClass("toggled")}else $(s).val(i)}},V="elem_"+B(15),H="elem_"+B(15),j="elem_"+B(15),z="elem_"+B(15),G="elem_"+B(15),J="elem_"+B(15),q="elem_"+B(15),Y="elem_"+B(15),X="elem_"+B(15),K="elem_"+B(15),Q="elem_"+B(15),Z="elem_"+B(15),ee="elem_"+B(15),te="elem_"+B(15),ne="elem_"+B(15),ie="elem_"+B(15),se="elem_"+B(15),re="elem_"+B(15),oe="elem_"+B(15),ae="elem_"+B(15),le="elem_"+B(15),ce="elem_"+B(15),de="elem_"+B(15),ue="elem_"+B(15),pe="elem_"+B(15),me="elem_"+B(15),fe="elem_"+B(15),ge="elem_"+B(15),be="elem_"+B(15),he="elem_"+B(15),ye="elem_"+B(15),ve="elem_"+B(15),we="elem_"+B(15),Se="elem_"+B(15),$e="elem_"+B(15),Ae="elem_"+B(15),Ce="elem_"+B(15),Te="elem_"+B(15),Be="elem_"+B(15),xe="elem_"+B(15),Pe="elem_"+B(15),Ie="elem_"+B(15),_e="elem_"+B(15),Me="elem_"+B(15),Ee="elem_"+B(15),De="elem_"+B(15),Ne="elem_"+B(15),Fe="elem_"+B(15),Re="elem_"+B(15),ke="elem_"+B(15),Ue="elem_"+B(15),Le="elem_"+B(15),Oe="elem_"+B(15),We="elem_"+B(15),Ve="elem_"+B(15),He="elem_"+B(15),je="elem_"+B(15),ze="elem_"+B(15),Ge="elem_"+B(15),Je="elem_"+B(15),qe="elem_"+B(15),Ye="elem_"+B(15),Xe="elem_"+B(15),Ke="elem_"+B(15),Qe="elem_"+B(15),Ze="elem_"+B(15),et="elem_"+B(15),tt="elem_"+B(15),nt="elem_"+B(15),it="elem_"+B(15),st="elem_"+B(15),rt="elem_"+B(15),ot="elem_"+B(15),at="elem_"+B(15),lt="elem_"+B(15),ct="elem_"+B(15),dt="elem_"+B(15),ut="elem_"+B(15),pt="elem_"+B(15),mt="elem_"+B(15),ft="elem_"+B(15),gt="elem_"+B(15),bt="elem_"+B(15),ht="elem_"+B(15),yt="elem_"+B(15),vt="elem_"+B(15),wt="elem_"+B(15),St="elem_"+B(15),$t="elem_"+B(15),At="elem_"+B(15),Ct="elem_"+B(15),Tt="elem_"+B(15),Bt="elem_"+B(15),xt="elem_"+B(15),Pt="elem_"+B(15),It="elem_"+B(15),_t="elem_"+B(15),Mt="elem_"+B(15),Et="elem_"+B(15),Dt="elem_"+B(15),Nt="elem_"+B(15),Ft="elem_"+B(15),Rt=B(15),kt="elem_"+B(15),Ut="elem_"+B(15),Lt="elem_"+B(15),Ot="elem_"+B(15),Wt="elem_"+B(15),Vt="elem_"+B(15);v("sessionStats",{soldItems:"-",unsoldItems:"-",activeTransfers:"-",availableItems:"-",coins:"-",winCount:0,coinsNumber:0,previousPause:0,searchCount:0,profit:0,transactions:[],searchPerMinuteCount:0});const Ht=()=>{const e=O(w("searchInterval")),t=w("sessionStats");$("#"+Ue).html(t.searchCount),$("#"+dt).html(t.profit),$("#"+Le).html(t.coins),$("#"+Oe).html(t.winCount),$("#"+Re).css("width",e),zt()},jt=()=>{const e=O(w("searchInterval")),t=w("sessionStats");$("#"+Re).css("width",e),$("#"+ke).css("width",e),$("#"+Le).html(t.coins),$("#"+Oe).html(t.winCount),$("#"+Ue).html(t.searchCount),$("#"+Ve).html(t.soldItems),$("#"+He).html(t.unsoldItems),$("#"+je).html(t.availableItems),$("#"+ze).html(t.activeTransfers),$("#"+dt).html(t.profit),zt(),t.unsoldItems?$("#"+He).css("color","red"):$("#"+He).css("color",""),t.availableItems?$("#"+je).css("color","orange"):$("#"+je).css("color","")},zt=()=>{const e=w("botStartTime");if(e&&w("autoBuyerActive")){const t=Math.abs(new Date-e)/1e3,n=Math.floor(t/60/60%24),i=Math.floor(t/60%60),s=Math.floor(t%60),r=(n<10?"0":"")+n+":"+(i<10?"0":"")+i+":"+(s<10?"0":"")+s;$("#"+Pt).html(r),Gt("runningTime",r)}},Gt=(e,t)=>{const n=w("sessionStats");n[e]=t,v("sessionStats",n)},Jt=e=>w("sessionStats")[e]||0,qt=function(e,t,n){const i=new UTStandardButtonControl;if(i.init(),i.addTarget(i,t,EventType.TAP),i.setText(e),n){const e=n.split(" ");for(let t of e)i.getRootElement().classList.add(t)}return i},Yt=()=>{$("#"+Te).empty()};let Xt=new Set;const Kt=(e,t,n,i,s=!1)=>{const r=w(t)||{};"number"===i&&(n=parseInt(n)),r[e]=n||null,r[e+"isDefaultValue"]=s,v(t,r)},Qt=(e,t,n,i,s,r="number",o=".*",a="buyer-settings-field",l=null)=>{const c=Object.keys(n)[0];return t&&(l&&l(t),Kt(c,s,t,r,!0)),Xt.has(c)||($(document).on("input",`#${n[c]}`,({target:{value:e}})=>{l&&l(e),Kt(c,s,e||t,r,!e)}),Xt.add(c)),`<div class="price-filter ${a}">\n       <div class="info">\n           <span class="secondary label">${e} :<br/><small>${i}</small></span>\n       </div>\n       <div class="buttonInfo">\n           <div class="inputBox">\n               <input pattern="${o}" type="${r}" class="numericInput" id='${n[c]}' placeholder=${t}>\n           </div>\n       </div>\n    </div>`};let Zt=new Set;const en=(e,t,n,i,s="buyer-settings-field",r=null)=>{const o=Object.keys(t)[0];return Zt.has(o)||($(document).on("click touchend",`#${t[o]}`,e=>{!r&&((e,t,n)=>{const i=w(t)||{};i[e]?(i[e]=!1,$(n.currentTarget).removeClass("toggled")):(i[e]=!0,$(n.currentTarget).addClass("toggled")),v(t,i)})(o,i,e),r&&r(e)}),Zt.add(o)),`\n    <div class="price-filter  ${s}">\n        <div class="ut-toggle-cell-view">\n           <span class="ut-toggle-cell-view--label">${e} <br/><small>${n}</small></span>\n             <div id='${t[o]}' class="ut-toggle-control">\n               <div class="ut-toggle-control--track">\n              </div>\n              <div class= "ut-toggle-control--grip" >\n          </div> \n           </div> \n       </div>\n    </div> `},tn=function(){const e=C();return`<div class='buyer-settings-wrapper buy-settings-view'>\n      ${en("Find Buy Price",{idBuyFutBinPrice:St},`(Uses ${e} price for Buy)`,"BuyerSettings")}\n      ${Qt("Buy/Bid Price Percent",100,{idBuyFutBinPercent:$t},`(Buy/Bid Price percent of ${e} Price)`,"BuyerSettings")}\n      ${en(`Bid For ${e} Price`,{idAbBidFutBin:Ct},`(Bid if the current bid is lesser than ${e} Price)`,"BuyerSettings")}\n      ${Qt("Buy Price","",{idAbBuyPrice:z},"<br/>","BuyerSettings")}\n      ${Qt("No. of cards to buy",1e3,{idAbCardCount:G},"(Works only with Buy price)","BuyerSettings")}\n      ${Qt("Bid Price","",{idAbMaxBid:J},"<br/>","BuyerSettings")}\n      ${Qt("Bid items expiring in","1H",{idAbItemExpiring:Y},"(S for seconds, M for Minutes, H for hours)","BuyerSettings","text","\\d+[H|M|S|h|m|s]$")} \n      ${Qt("Search result threshold",21,{idAbSearchResult:q},"(Buy or bid cards only if the no.of search results is lesser than the specified value)","BuyerSettings")}\n      ${en("Bid Exact Price",{idAbBidExact:X},"","BuyerSettings")}      \n     </div>\n    `};$(document).on("keyup","#"+K,function({target:{value:e}}){nn(e)});const nn=e=>{const t=parseInt(e);if(isNaN(t))return void $("#"+Fe).html(0);const n=(e-e/100*5).toLocaleString();$("#"+Fe).html(n)},sn=function(){const e=C();return`<div style='display : none' class='buyer-settings-wrapper sell-settings-view'>\n  ${en("Find Sale Price",{idSellFutBinPrice:rt},`(Uses ${e} price for listing)`,"BuyerSettings")}\n  ${Qt("Sell Price Percent","100-100",{idSellFutBinPercent:ot},`(Sale Price percent of ${e} Price)`,"BuyerSettings","text","\\d+-\\d+$")}\n  ${en("Check buy price before listing",{idSellCheckBuyPrice:ut},"(List only if Buy Price is lesser than Sale Price)","BuyerSettings")}\n  ${Qt("Sell Price","",{idAbSellPrice:K},`(-1 to send to transferlist)<br />Receive After Tax: <span id=${Fe}>0</span>`,"BuyerSettings")} \n   ${Qt("List Duration","1H",{idFutBinDuration:bt},"List Duration when listing","BuyerSettings","text","\\d+[H|M|S|h|m|s]$")}\n  ${Qt("Clear sold count",10,{idAbMinDeleteCount:Q},"(Clear sold items when reach a specified count)","BuyerSettings")}\n  ${Qt("Rating Threshold",100,{idSellRatingThreshold:st},"(Rating threshold to list the sniped player)","BuyerSettings")}\n  ${en("Relist Unsold Items",{idAbSellToggle:Z},"","BuyerSettings")}\n  ${en("Dont move won items",{idAbDontMoveWon:Tt},"(Keep won items in Unassigned or Transfer Targets)","BuyerSettings")}\n  </div>`},rn=function(){return`<div style='display : none' class='buyer-settings-wrapper safety-settings-view'>\n  ${Qt("Wait Time","7-15",{idAbWaitTime:ee},"(Random second range eg. 7-15)","CommonSettings","text","\\d+-\\d+$")}\n  ${Qt("Max purchases per search request",1,{idAbMaxPurchases:Wt},"Increase this, only if you are Adding Delay After Buy of alteast 3S","CommonSettings")}\n  ${Qt("Pause Cycle","10-15",{idAbCycleAmount:te},"(No. of searches performed before triggering Pause eg. 10-15)","CommonSettings","text","\\d+-\\d+$")}\n  ${Qt("Pause For","5-8S",{idAbPauseFor:ne},"(S for seconds, M for Minutes, H for hours eg. 0-0S)","CommonSettings","text","\\d+-\\d+[H|M|S|h|m|s]$")}\n  ${en("Add Delay After Buy",{idAbAddBuyDelay:ue},"(Adds Delay after trying to buy / bid a card)","CommonSettings")}\n  ${Qt("Delay To Add","1S",{idAbDelayToAdd:pe},"(S for seconds, M for Minutes, H for hours)","CommonSettings","text","\\d+[H|M|S|h|m|s]$")}\n  ${Qt("Stop After","3-4H",{idAbStopAfter:ie},"(S for seconds, M for Minutes, H for hours  eg. 3-4H)","CommonSettings","text","\\d+-\\d+[H|M|S|h|m|s]$")}\n  ${en("Show Search Exceed Warning",{idAbOverSearchWarning:Ot},"(Shows a warning in log if number of search per minute exceeds 15)","CommonSettings")} \n  </div>`},on=function(){return`<div style='display : none' class='buyer-settings-wrapper captcha-settings-view'>\n    ${en("Close Web App on Captcha Trigger",{idAbCloseTabToggle:fe},"","CommonSettings")}         \n    ${en("Auto Solve Captcha",{idAbSolveCaptcha:Ne},"","CommonSettings")}\n    ${Qt("Anti-Captcha Key","",{idAntiCaptchKey:tt},"","CommonSettings","text")}\n    ${Qt("Proxy Address","",{idProxyAddress:Qe},"","CommonSettings","text")}\n    ${Qt("Proxy Port","",{idProxyPort:Ze},"","CommonSettings")}\n    ${Qt("Proxy User Name (Optional)","",{idProxyLogin:et},"","CommonSettings","text")}\n    ${Qt("Proxy User Password (Optional)","",{idProxyPassword:nt},"","CommonSettings","text")} \n    `};let an=new Set;const ln=(e,t,n,i)=>(an.has(e)||(cn(e,n),an.add(e)),`<button class="btn-standard ${i}" id="${e}">${t}</button>`),cn=(e,t)=>{$(document).on({mouseenter:function(){$(this).addClass("hover")},mouseleave:function(){$(this).removeClass("hover")},click:function(){t()},touchenter:function(){$(this).addClass("hover")},touchleave:function(){$(this).removeClass("hover")},touchend:function(){t()}},`#${e}`)},dn=function(){return`<div style='display : none' class='buyer-settings-wrapper notification-settings-view'> \n ${d?"":`${Qt("Telegram Bot Token","",{idTelegramBotToken:ve},"Token of your own bot","CommonSettings","text")}\n  ${Qt("Telegram Chat ID","",{idTelegramChatId:we},"Your Telegram ChatID","CommonSettings","text")}\n  ${Qt("Discord Bot Token","",{idDiscordToken:$e},"Your Discord Bot Token","CommonSettings","text")}\n  ${Qt("Discord Channel ID","",{idDiscordChannelId:Ae},"Your Discord Channel ID","CommonSettings","text")}\n  ${Qt("Discord WebHook Url","",{idWebHookUrl:kt},"Your Discord Channel Webhook Url","CommonSettings","text")}\n  ${Qt("Fut Market Alert Notification Token","",{idFUTMarketAlertToken:Ce},"Your FUT Market Alert App's Token","CommonSettings","text")}\n  ${en("Send Listing Notification",{idAbSendListingNotificationToggle:he},"","CommonSettings")}`}\n  ${Qt("Notification Type","",{idNotificationType:Se},"Type A for all notifications, B for buy or L for lost","CommonSettings","text","[A|B|L]$")}\n  ${en("Send Notification",{idAbMessageNotificationToggle:ge},"","CommonSettings")}\n   ${d?"":`${en("Sound Notification",{idAbSoundToggle:ye},"","CommonSettings")}\n  <audio id='${Xe}' hidden>\n    <source src="https://notificationsounds.com/storage/sounds/file-sounds-869-coins.ogg" type="audio/ogg">\n    <source src="https://notificationsounds.com/storage/sounds/file-sounds-869-coins.mp3" type="audio/mpeg">\n      "Your browser does not support the audio element"\n  </audio>\n  <audio id='${Ke}' hidden>\n    <source src="https://notificationsounds.com/storage/sounds/file-sounds-897-alarm-frenzy.ogg" type="audio/ogg">\n    <source src="https://notificationsounds.com/storage/sounds/file-sounds-897-alarm-frenzy.mp3" type="audio/mpeg">\n      "Your browser does not support the audio element"\n  </audio>\n  <audio id='${Ut}' hidden>\n    <source src="https://freesound.org/data/previews/220/220763_4104696-lq.ogg" type="audio/ogg">\n    <source src="https://freesound.org/data/previews/220/220763_4104696-lq.mp3" type="audio/mpeg">\n      "Your browser does not support the audio element"\n  </audio> `}\n     ${en("Use Custom Discord Webhook Name",{idAbCustomDiscordNameNotificationToggle:be},"","CommonSettings")}\n   <div class="btn-test-notification buyer-settings-field">\n   ${ln(Me,"Test Notification",()=>Jn("Test Notification Message",!0,!0),"call-to-action")}\n   </div>\n  `},un=function(){return`<div style='display : none' class='buyer-settings-wrapper common-settings-view'>\n  ${Qt("Error Codes to stop bot (csv)","",{idAbStopErrorCode:Je},"(Eg. 412,421,521)","CommonSettings","text","^\\d+(,\\d+)*$")}\n  ${Qt("No. of times error code should occur",3,{idAbStopErrorCodeCount:qe},"<br />","CommonSettings")}\n  ${Qt("Resume bot after","",{idAbResumeAfterErrorOccured:Bt},"(S for seconds, M for Minutes, H for hours eg. 0-0S)","CommonSettings","text","\\d+-\\d+[H|M|S|h|m|s]$")}\n  ${en("Auto Clear Log",{idAutoClearLog:it},"(Automatically clear logs every 2 minutes)","CommonSettings")}\n  ${en("Auto Clear Expired Items",{idAutoClearExpired:vt},"(Automatically clear expired items from transfer targets)","CommonSettings")}\n  ${en("Use Futwiz Price",{idAbUseFutWiz:Vt},"(Uses Futwiz price for buying/selling cards)","CommonSettings")}\n  </div>`},pn=function(e,t){let n=!1;return $(`${e} option`).each(function(){if(this.value===t)return n=!0,!1}),n||$(e).append($("<option></option>").attr("value",t).text(t)),n},mn=function(){const e=$(`#${j}`).val()||[];e.length?v("selectedFilters",e):v("selectedFilters",[])};let fn;$(document).on({change:()=>{const e=$(`#${_t}`).val()||"buy",t=w("BuyerSettings")||{};t.idAbSortBy=e,v("BuyerSettings",t)}},`#${_t}`);const gn=function(){if("function"!=typeof UTPlayerSearchControl)return $('<div class="price-filter buyer-settings-field">\n        <div class="info">\n          <span class="secondary label">\n            Players List :<br/>\n            <small>Player search is unavailable. Open the MagicBuyer tab in the web app first.</small>\n          </span>\n        </div>\n      </div>');fn=new UTPlayerSearchControl;const e=`#${gt}`,t=$(`\n            <div class="price-filter buyer-settings-field">\n              <div class="info">\n               <span class="secondary label">\n                  <button id=${Ft} style="font-size:16px" class="flat camel-case">Players List</button><br/>\n                </span>\n              </div>\n              <div class="ignore-players displayCenterFlx">\n                ${ln(mt,"+",()=>{const t=`${fn._playerNameInput.value}(${fn.selected.rating})`,n=pn(e,t);if($(`${e} option[value="${t}"]`).attr("selected",!0),!n){const e=w("BuyerSettings")||{},n=e.idAddIgnorePlayersList||[];n.push({id:fn.selected.id,displayName:t}),e.idAddIgnorePlayersList=n,v("BuyerSettings",e)}},"btn-standard filterSync action-icons")}                \n                </div>\n              </div>\n              <div class="price-filter buyer-settings-field">\n                <div class="info">\n                <span class="secondary label">\n                  <button id=${Ft} style="font-size:16px" class="flat camel-case">Remove from Players List</button><br/>\n                </span>\n                </div>\n                <div class="displayCenterFlx">\n                  <select style="width:90%;height: 3rem;font-size: 1.5rem;" class="filter-header-settings" id=${gt}>\n                    <option selected="true" disabled>Players List</option>                            \n                  </select>\n                  ${ln(ft,"❌",()=>{const t=$(`${e} option`).filter(":selected").val();if("Ignored Players List"!=t){$(`${e} option[value="${t}"]`).remove(),$(`${e}`).prop("selectedIndex",0);const n=w("BuyerSettings")||{};let i=n.idAddIgnorePlayersList||[];i=i.filter(({displayName:e})=>e!=t),n.idAddIgnorePlayersList=i,v("BuyerSettings",n)}},"btn-standard filterSync font15 action-icons")}\n                </div>\n              </div>              \n              `);return fn&&($(fn.__root).insertBefore(t.find(`#${mt}`)),fn.init(),fn._playerNameInput.setPlaceholder("Search Players")),t},bn=function(){const e=$(`<div style='display : none' class='buyer-settings-wrapper results-filter-view'>\n    <div class="place-holder">\n    </div>\n    ${en("Ignore/Buy Players List",{idAbIgnoreAllowToggle:wt},"(If toggled bot will only buy/bid the above players else bot will ignore the players when bidding/buying )","BuyerSettings")}\n    ${Qt("Min Rating",10,{idAbMinRating:se},"Minimum Player Rating","BuyerSettings")}\n    ${Qt("Max Rating",100,{idAbMaxRating:re},"Maximum Player Rating","BuyerSettings")}    \n    ${Qt("Search result page limit",5,{idAbMaxSearchPage:de},"No of. pages bot should move forward before going back to page 1","BuyerSettings")}\n    ${Qt("Max value of random min bid",300,{idAbRandMinBidInput:oe},"","BuyerSettings")}\n    ${en("Use random min bid",{idAbRandMinBidToggle:ce},"","BuyerSettings")}\n    ${Qt("Max value of random min buy",300,{idAbRandMinBuyInput:ae},"","BuyerSettings")}\n    ${en("Use random min buy",{idAbRandMinBuyToggle:le},"","BuyerSettings")}\n    ${en("SKIP GK",{idAbAddFilterGK:me},"(Skip all goalkeepers to buy / bid a card)","BuyerSettings")}\n    ${en("Sort players",{idAbShouldSort:Et},"","BuyerSettings")}\n    <div class="price-filter buyer-settings-field">\n      <div class="displayCenterFlx">\n      <select style="width:95%;height: 3rem;font-size: 1.5rem;" class="select-sortBy filter-header-settings" id="${_t}">\n        <option disabled selected>--Select Sort Attribute--</option>\n        <option value="expires">Expires on</option>          \n        <option value="buy">Buy now price</option>\n        <option value="bid">Bid now price</option>\n        <option value="rating">Player rating</option>\n      </select>\n      </div>\n    </div>\n    ${en("Order",{idAbSortOrder:Mt},"(Enabled = descending, Disabled = ascending)","BuyerSettings")}\n  </div>`),t=e.find(".place-holder");return gn().insertAfter(t),e},hn=(e,t,n,i)=>{const s=new EADialogViewController({dialogOptions:e,message:n,title:t});s.init(),s.onExit.observe(void 0,function(e,t){e.unobserve(this),i.call(this,t)}),gPopupClickShield.setActivePopup(s)};$(document).on({touchend:function(){$(`#${ht}`).trigger("click")}},`#${ht}`);const yn=e=>{const t={},n=$(`#${ct}`).val()||[];if(n.length){for(let i of n){const n=e[i],s=JSON.parse(n);t[i]=s}var i,s;i={filters:t},s="filters",d?P(i,s):_(i,s),zn("Filters downloaded successfully")}else zn("No filter selected",UINotificationType.NEGATIVE)},vn=()=>{const e=$(`#${ht}`).prop("files");if(!e||!e[0])return void zn("No filter file selected",UINotificationType.NEGATIVE);const t=e[0],n=new FileReader;n.onload=e=>{const t=JSON.parse(e.target.result);if(t&&t.filters){for(let e in t.filters)Wn(e,t.filters[e]);zn("Filters uploaded successfully")}else zn("Not a valid filters file")},n.readAsText(t)},wn=async()=>{w("filters")||v("filters",await b()||{});let e=w("filters");return e=Object.keys(e).sort().reduce((t,n)=>(t[n]=e[n],t),{}),e},Sn=async()=>Object.keys(await wn());$(document).on({change:mn,click:mn,touchend:mn},`#${j}`);const $n=(e,t)=>{let n=w(t);return n?(n=!1,$(e.currentTarget).removeClass("toggled")):(n=!0,$(e.currentTarget).addClass("toggled")),v(t,n),n},An=async function(){return w("runSequentially")&&(v("runSequentially",!1),setTimeout(()=>{$(`#${pt}`).click()})),`<div style='display : none' class='buyer-settings-wrapper filter-settings-view'>\n                <div class="price-filter buyer-settings-field multiple-filter teleporter">\n                    <select  multiple="multiple" class="multiselect-filter filter-header-settings" id="${j}"\n                     name="selectedFilters" style="overflow-y : scroll;">\n                     ${Object.keys(await wn()).map(e=>`<option value='${e}'>${e}</option>`)}\n                    </select>\n                </div>\n                ${Qt("No. of search For each filter",w("fiterSearchCount")||3,{idAbNumberFilterSearch:Ge},"(Count of searches performed before switching to another filter)","CommonSettings","number",null,"buyer-settings-field",e=>v("fiterSearchCount",parseInt(e)||3))}\n                ${en("Switch filter sequentially",{idRunFilterSequential:pt},"","CommonSettings","buyer-settings-field",e=>$n(e,"runSequentially"))}\n            </div>\n    `},Cn=async function(e){const t=this,n=e?"transfer":"";$(document).off("change",`#${V}${n}`),$(document).on({change:function(){const i=$(`#${V}${n} option`).filter(":selected").val();Vn.call(t,i,e)}},`#${V}${n}`);const i=$(`<div style="width:100%;display: flex;flex-direction: column;">\n            ${isPhone()&&!e?en("Runner Mode",{idAbToggleRunner:At},"","MisSettings","runner",e=>{const t=$n(e,"runnerToggle");$(".auto-buyer").toggleClass("displayNone"),t?$(".filter-place").append($(`#${j}`)):$(".teleporter").append($(`#${j}`))}):""}\n            ${e?"":`<div id=${Nt} class="btn-report"></div>`}         \n            <div class="price-filter buyer-settings-field multiple-filter filter-place">\n            </div> \n            <div class="button-container btn-filters">\n                 <select class="filter-header-settings" id='${V}${n}'>\n                    <option selected="true" disabled>Choose filter to load</option>\n                    ${e?"":'<option value="_default">_DEFAULT</option>'}  \n                    ${Object.keys(await wn()).map(e=>`<option value="${e}">${e}</option>`)}                    \n                 </select>                 \n                ${e?"":ln(at,"⇧",()=>{(()=>{let e=`Upload Filter Json file <br /> <br />\n  <input accept=".json" type="file" id="${ht}">\n   </input> <br /> <br /> <br />\n   Uploading filters will override filters with the same name`;hn([{labelEnum:enums.UIDialogOptions.OK},{labelEnum:enums.UIDialogOptions.CANCEL}],"Upload filters",e,e=>{2===e&&vn()})})()},"filterSync")}\n               ${e?"":ln(lt,"⇩",()=>{(()=>{const e=w("filters");let t=`Choose filters to Download <br /> <br />\n  <select  multiple="multiple" class="multiselect-filter filter-header-settings" id="${ct}"\n      style="overflow-y : scroll">\n      ${Object.keys(e).map(e=>`<option value='${e}'>${e}</option>`)}\n   </select> <br /> <br /> <br />`;hn([{labelEnum:enums.UIDialogOptions.OK},{labelEnum:enums.UIDialogOptions.CANCEL}],"Download filters",t,async t=>{2===t&&await yn(e)})})()},"filterSync")}\n             </div> \n               ${e?"":`<div id=${Dt} style="margin-top: 1%;" class="button-container btn-filters"></div>`}\n             </div>`);return!e&&Tn.call(this,i,t),i},Tn=function(e,t){const n=e.find(`#${Dt}`),i=e.find(`#${Nt}`);n.append(qt("Delete Filter",()=>Hn.call(t),"call-to-action btn-delete-filter").__root),n.append(qt("Save Filter",function(){On.call(this,t)},"call-to-action btn-save-filter").__root),i.append(qt("Report a problem",()=>{hn([{labelEnum:atob("RGlzY29yZA==")},{labelEnum:atob("VHdpdHRlcg==")},{labelEnum:atob("R2l0aHVi")}],atob("UmVwb3J0IGEgcHJvYmxlbQ=="),atob("QmVsb3cgYXJlIHRoZSBsaXN0IG9mIHdheXMgdG8gcmVwb3J0IGEgcHJvYmxlbSA8YnIgLz5NYWtlIHN1cmUgdG8gZ28gdGhyb3VnaCB0aGUgPGEgaHJlZj0naHR0cHM6Ly95b3V0dWJlLmNvbS9wbGF5bGlzdD9saXN0PVBMR21LTWczYVJrWGpQUjVna2x4TXlxeHRoWW9vV0k1SUMnIHRhcmdldD0nX2JsYW5rJz55b3V0dWJlIHBsYXlsaXN0PC9hPiBpZiBhbnkgc2V0dGluZ3MgYXJlIHVuY2xlYXIgPGJyIC8+"),e=>{e===atob("R2l0aHVi")?window.open(atob("aHR0cHM6Ly9naXRodWIuY29tL2NoaXRoYWt1bWFyMTMvRlVULUF1dG8tQnV5ZXIvaXNzdWVz"),atob("X2JsYW5r")):e===atob("RGlzY29yZA==")?window.open(atob("aHR0cHM6Ly9kaXNjb3JkLmNvbS9pbnZpdGUvY2t0SFltcA=="),atob("X2JsYW5r")):e===atob("VHdpdHRlcg==")&&window.open(atob("aHR0cHM6Ly90d2l0dGVyLmNvbS9BbGdvc0Nr"),atob("X2JsYW5r"))})},"call-to-action").__root)},Bn=new Map;let xn,Pn;Bn.set(0,{label:"Buy/Bid Settings",selector:".buy-settings-view"}),Bn.set(1,{label:"Sell Settings",selector:".sell-settings-view"}),Bn.set(2,{label:"Search Settings",selector:".results-filter-view"}),Bn.set(3,{label:"Safety Settings",selector:".safety-settings-view"}),Bn.set(4,{label:"Filter Settings",selector:".filter-settings-view"}),Bn.set(5,{label:"Captcha Settings",selector:".captcha-settings-view"}),Bn.set(6,{label:"Notification Settings",selector:".notification-settings-view"}),Bn.set(7,{label:"Common Settings",selector:".common-settings-view"});const In=function(){return Pn=new EAFilterBarView,Bn.forEach((e,t)=>{Pn.addTab(t,e.label)}),Pn.setActiveTab(0),Pn.layoutSubviews(),v("activeSettingsTab",0),Pn.addTarget(this,Nn,EventType.TAP),Pn.__root.style="margin-top: 20px;",xn=$(Pn.__root),xn.find(".menu-container").css("overflow-x","auto"),En(!0),Pn},_n=async function(){Dn(),Rn(),await En();const e=w("AutoBuyerInstance");UTMarketSearchFiltersViewController.prototype._eResetSelected.call(e)},Mn=async e=>{let t=await b("CommonSettings");if(t=JSON.parse(t.CommonSettings||"{}"),!$.isEmptyObject(t)){const n=e?w("CommonSettings"):{};v("CommonSettings",Object.assign({},n,t))}},En=async function(e){Pn.setActiveTab(0),v("activeSettingsTab",0),xn.append(tn.call(this)),xn.append(sn.call(this)),xn.append(bn.call(this)),xn.append(rn.call(this));const t=await An.call(this);xn.append(t),xn.append(on.call(this)),xn.append(dn.call(this)),xn.append(un.call(this)),$(".menu-container").animate({scrollLeft:0}),setTimeout(async()=>{const t=w("selectedFilters")||[],{idAbSortBy:n}=w("BuyerSettings")||{};n&&$(`${_t} option[value='${n}']`).prop("selected","selected"),$.each(t,function(e,t){$(".multiselect-filter option[value='"+t+"']").prop("selected","selected")}),e&&await Mn()})},Dn=()=>{Bn.forEach((e,t)=>{$(e.selector).remove()}),fn&&"function"==typeof fn.destroy&&fn.destroy(),fn=null},Nn=function(e,t,n){Fn(),v("activeSettingsTab",n.index);const i=Bn.get(n.index).selector;$(i).css("display","")},Fn=()=>{Bn.forEach((e,t)=>{$(e.selector).css("display","none")})},Rn=()=>{v("currentFilter",null),v("BuyerSettings",{}),v("currentFilter",{})},kn=()=>{document.querySelectorAll(":invalid").length&&zn("Settings with invalid value found, fix these values for autobuyer to work as intended",UINotificationType.NEGATIVE)},Un=`#${V}`,Ln=`#${j}`,On=function(e){const t=this;$(t).addClass("active");let n=S(!0),i=w("CommonSettings");setTimeout(function(){let s={};const r=e._viewmodel;s.searchCriteria={criteria:r.searchCriteria,playerData:r.playerData,buyerSettings:n};let o=$(`${Un} option`).filter(":selected").val();"Choose filter to load"===o&&(o=void 0);let a=prompt("Enter a name for this filter",o);if(kn(),a){if("_DEFAULT"===a.toLocaleUpperCase())return zn("Cannot override _DEFAULT filter",UINotificationType.NEGATIVE);Wn(a,s),h("CommonSettings",JSON.stringify(i),"CommonSettings"),v("currentFilter",a),$(t).removeClass("active"),zn("Changes saved successfully")}else $(t).removeClass("active"),zn("Filter Name Required",UINotificationType.NEGATIVE)},200)},Wn=(e,t)=>{e=e.toUpperCase(),pn(Un,e),pn(`#${j}`,e),$(`${Un} option[value="${e}"]`).attr("selected",!0),w("filters")[e]=JSON.stringify(t),h(e,w("filters")[e])},Vn=async function(e,t){if("_default"===e)return(()=>{v("BuyerSettings",Object.assign({},l)),v("CommonSettings",Object.assign({},c));const e=S();W(e)})(),!1;w("runnerToggle")||t||await _n();const n=w("filters")[e];if(!n)return!1;let{searchCriteria:{criteria:i,playerData:s,buyerSettings:r}}=JSON.parse(n);if(this.viewmodel.resetSearch(),this.viewDidAppear(),this.viewmodel.playerData={},Object.assign(this.viewmodel.searchCriteria,i),Object.assign(this.viewmodel.playerData,s),$.isEmptyObject(this.viewmodel.playerData)&&(this.viewmodel.playerData=null),this.viewDidAppear(),t)return;await Mn();const o=w("CommonSettings")||{};if(v("BuyerSettings",r),v("currentFilter",e),r=Object.assign({},r,o),W(r),r.idAddIgnorePlayersList&&r.idAddIgnorePlayersList.length)for(let{displayName:e}of r.idAddIgnorePlayersList)pn(`#${gt}`,e);return kn(),!0},Hn=async function(){const e=$(`${Un} option`).filter(":selected").val();if("_DEFAULT"===e.toLocaleUpperCase())return zn("Cannot delete _DEFAULT filter",UINotificationType.NEGATIVE);"Choose filter to load"!=e&&($(`${Un} option[value="${e}"]`).remove(),$(`${Un}`).prop("selectedIndex",0),await _n(),this.viewDidAppear(),delete w("filters")[e],$(`${Ln} option[value="${e}"]`).remove(),mn(),(e=>{m(e)})(e),zn("Changes saved successfully"))};let jn=null;const zn=function(e,t){t=t||UINotificationType.POSITIVE,services.Notification.queue([e,t])},Gn=e=>{services.PIN.sendData(PINEventType.PAGE_VIEW,{type:PIN_PAGEVIEW_EVT_TYPE,pgid:e})},Jn=(e,t,n)=>{const i=S();(i.idAbMessageNotificationToggle||n)&&(d?qn(e):Kn(i,t,e),n&&zn("Test Notification Sent"))},qn=e=>{window.ReactNativeWebView.postMessage(JSON.stringify({type:"Notification",message:e}))},Yn=(e,t,n)=>{let i={embeds:[{description:e,color:t?2555648:16711680,footer:{text:`Auto Buyer Alert - ${(new Date).toLocaleTimeString()}`,icon_url:"https://cdn.discordapp.com/icons/768336764447621122/9de9ea0a7c6239e2f2fbfbd716189e79.webp"}}],avatar_url:"https://cdn.discordapp.com/icons/768336764447621122/9de9ea0a7c6239e2f2fbfbd716189e79.webp",username:"Fut Market Alert"};return n&&delete i.username,i},Xn=e=>{const{embeds:[t]}=e;return(new Discord.RichEmbed).setColor(t.color).setDescription(t.description).setFooter(t.footer.text,t.footer.icon_url)},Kn=(e,t,n)=>{const i=e.idTelegramBotToken,s=e.idTelegramChatId,r=e.idWebHookUrl,o=e.idDiscordChannelId,a=e.idFUTMarketAlertToken,l=e.idAbCustomDiscordNameNotificationToggle;Qn(i,s,n),ei(o,t,n,l),Zn(r,t,n,l),ni(a,n)},Qn=(e,t,n)=>{if(e&&t){const i=`https://api.telegram.org/bot${e}/sendMessage?chat_id=${t}&parse_mode=Markdown&text=${n}`,s=new XMLHttpRequest;s.open("GET",i,!0),s.send()}},Zn=(e,t,n,i)=>{e&&fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Yn(n,t,i))})},ei=(e,t,n,i)=>{if(e)if(jn){const s=jn.channels.get(e);s&&s.send(Xn(Yn(n,t,i)))}else jn=ti(()=>{setTimeout(()=>{if(jn){const s=jn.channels.get(e);s&&s.send(Xn(Yn(n,t,i)))}},200)})},ti=e=>{const t=S(),n=new Discord.Client;let i=t.idDiscordToken;if(!i)return null;try{n.login(i),n.on("ready",function(){e&&e()}),n.on("message",async function(e){if(e.author.id!=n.user.id)if(/start/i.test(e.content)){const t=w("AutoBuyerInstance");Ki.call(t),e.channel.send(Xn(Yn("Bot started successfully",!0)))}else if(/stop/i.test(e.content))Qi(),e.channel.send(Xn(Yn("Bot stopped successfully",!0)));else if(/runfilter/i.test(e.content)){let t=e.content.split("-")[1];if(t){t=t.toUpperCase(),Qi(),v("selectedFilters",[]);const n=w("AutoBuyerInstance");if(!await Vn.call(n,t))return void e.channel.send(Xn(Yn(`unable to find filter${t}`,!1)));Ki.call(n),e.channel.send(Xn(Yn(`${t} started successfully`,!0)))}else e.channel.send(Xn(Yn("Unable to find filter name",!1)))}})}catch(e){}return n},ni=(e,t)=>{e&&fetch("https://exp.host/--/api/v2/push/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify([{to:`ExponentPushToken[${e}]`,title:t,body:t}])})},ii=function(e){Jn("Captcha, please solve the problem so that the bot can work again.",!1),e?window.location.href="about:blank":si("[!!!] Autostopping bot since Captcha got triggered",Te)},si=function(e,t,n,i){setTimeout(()=>{var s=$("#"+t);const r=$(`\n              <li class="cardPalyerLi">\n              <div class="cardPalyer" style="${"success"===i?"border: solid #10AC84;":"error"===i?"border: solid #EE5253;":"warning"===i?"border: solid #FF9F43;":"border: solid #2E86DE;"}">\n              ${n?`<img\n                  style="width:30%; padding-left: 15px;"\n                  src="https://www.ea.com/ea-sports-fc/ultimate-team/web-app/content/24B23FDE-7835-41C2-87A2-F453DFDB2E82/2024/fut/items/images/mobile/portraits/${n?._metaData?.id}.png"\n                />`:""}\n              \n              <div class="container">\n                <span class="contentContainer" >${e}</span>\n                <div class="typeContent" style="${"success"===i?"background: #10AC84;":"error"===i?"background: #EE5253;":"warning"===i?"background: #FF9F43;":"background: #2E86DE;"}">\n                  <span class="typeContentText">${"success"===i?"✓":"error"===i?"X":"warning"===i?"!":"↻"}</span>\n                </div>\n              </div>\n              </div>\n              </li>\n          `);s.append(r),s[0]&&s.scrollTop(s[0].scrollHeight)},50)},ri=()=>{$("#"+Te).val(""),Yt()};setInterval(()=>{const e=S();e&&e.idAutoClearLog&&ri()},12e4);const oi=()=>{let e=w("userPlatform");return e||(services.User.getUser().getSelectedPersona().isPC?(v("userPlatform","pc"),"pc"):(v("userPlatform","ps"),"ps"))},ai=()=>new Promise(e=>{services.User.requestCurrencies().observe(void 0,function(t,n){e()})});let li,ci;const di=function(e){if(!w("autoBuyerActive"))return;const t=1e3*E(e.idAbPauseFor);ci=ci||D(e.idAbCycleAmount);const{searchCount:n,previousPause:i}=w("sessionStats");return!n||(n-i)%ci?void 0:(Gt("previousPause",n),ai(),Qi(!0),setTimeout(()=>{ci=D(e.idAbCycleAmount),Ki.call(this,!0)},t))},ui=async function(){const e=w("selectedFilters"),t=w("fiterSearchCount"),n=w("currentFilterCount");if(!e||!e.length||t>n)return A("currentFilterCount"),!1;v("currentFilterCount",1),v("currentPage",1);const i=w("currentFilterIndex")||0;let s=w("runSequentially")?i%e.length:R(0,e.length-1);v("currentFilterIndex",s+1);let r=e[s];return await Vn.call(this,r),si(`Running for filter ${r}`,Te),!0},pi="MAGIC_BUYER_BACKGROUND_FETCH";let mi=0;const fi=e=>new Promise((t,n)=>{const i=`${pi}_${Date.now()}_${mi++}`,s=e=>{if(e.source!==window||!e.data)return;const{type:r,id:o,success:a,payload:l,error:c}=e.data;"MAGIC_BUYER_BACKGROUND_FETCH_RESPONSE"===r&&o===i&&(window.removeEventListener("message",s),a?t(l):n(new Error(c||"Background fetch failed")))};window.addEventListener("message",s),window.postMessage({type:pi,id:i,payload:e},"*")}),gi=async e=>{d?bi(e):await hi(e)},bi=e=>{v(e.identifier,e.onload),delete e.onload,window.ReactNativeWebView.postMessage(JSON.stringify({type:"fetchFromExternalAB",payload:{options:e}}))},hi=async e=>{try{const t=await fi({method:e.method,url:e.url,headers:e.headers,body:e.data});e.onload?.({status:t.status,response:t.body,responseText:t.body,responseHeaders:t.headersRaw})}catch(t){e.onerror?e.onerror(t):console.error("Failed to perform external request",t)}},yi=(e,t,n)=>new Promise((i,s)=>{gi({method:t,identifier:n,url:e,onload:e=>200!==e.status?s():i(e.response)})}),vi=async(e,t)=>{try{const n=await wi(e),i=oi();if(!n)return;const s=await yi(`https://www.futwiz.com/en/app/sold23/${n[0].lineid}/console`,"GET",`${e.definitionId}_fetchFutWizPlayerPrices`),r=JSON.parse(s);let o=r.prices[i].bin;"ps"!==i||o||(o=r.prices.xb.bin);const a=parseInt(o.replace(/[,.]/g,"")),l=`${e.definitionId}_futwiz_price`,c={expiryTimeStamp:new Date(Date.now()+9e5),price:a};v(l,c),t.set(l,a)}catch(e){console.log(e)}},wi=e=>new Promise((t,n)=>{const i=TextUtils.stripSpecialCharacters("---"!==e._staticData.knownAs?e._staticData.knownAs:e._staticData.name);gi({url:`https://www.futwiz.com/en/searches/player23/${i}`,method:"GET",identifier:`${e.definitionId}_getFutWizPlayerUrl`,onload:n=>{if(200!==n.status)return t();const i=JSON.parse(n.response);if(!i)return t();let s=i.filter(t=>parseInt(t.rating)===e.rating);i&&!s.length&&(s=i),s&&s.length>1&&(s=s.filter(t=>t.rare===e.rareflag.toString()&&t.club===e.teamId+"")),t(s)}})}),Si=async e=>{const t=new Map,n=new Map;let i=[];for(const i of e){if(!i.definitionId)continue;const e=w(`${i.definitionId}_futwiz_price`);e?t.set(`${i.definitionId}_futwiz_price`,e.price):i.isPlayer()&&n.set(i.definitionId,i)}if(n.size)for(const e of n.values())i.push(vi(e,t));return await Promise.all(i),t},$i=e=>{const t=services.Localization;return t?e.isManagerContract()?t.localize("card.title.managercontracts"):e.isPlayerContract()?t.localize("card.title.playercontracts"):e.isStyleModifier()?UTLocalizationUtil.playStyleIdToName(e.subtype,t):e.isPlayerPositionModifier()?t.localize("card.desc.training.pos."+e._staticData.trainPosFrom+"_"+e._staticData.trainPosTo).replace(" >> ","->"):e._staticData.name:""},Ai=(e,t,n)=>e>=t&&e<=n,Ci=new Set(["Position","Chemistry Style"]),Ti=async(e,t)=>{const n=Array.from(e),i=oi();for(;n.length;){const e=n.splice(0,30),s=e.shift();if(!s)continue;const r=e.join(",");try{const n=await yi(`https://www.futbin.com/24/playerPrices?player=${s}&rids=${r}`,"GET",`${Math.floor(+new Date)}_fetchPlayerPrices`),o=JSON.parse(n);for(const n of[s,...e]){const e=o[n].prices[i].LCPrice;if(!e)continue;const s=parseInt(e.replace(/[,.]/g,"")),r=`${n}_futbin_price`,a={expiryTimeStamp:new Date(Date.now()+9e5),price:s};v(r,a),t.set(r,s)}}catch(e){console.log(e)}}},Bi=async(e,t)=>{const n=oi(),i="ps"===n?"PS":"xbox"===n?"XB":"PC",s=Array.from(e.keys());for(const n of s)try{const s=n.split(" ")[0],r=await yi(`https://www.futbin.org/futbin/api/fetchConsumables?category=${s}&platformtype=${i}`,"GET",`${Math.floor(+new Date)}_fetchConsumablesPrices`),o=JSON.parse(r).data.reduce((e,t)=>(e.set(t.SubType.toUpperCase(),t.LCPrice),e),new Map),a=e.get(n)||[];for(const{definitionId:e,subType:n}of a){let i=o.get(n);const s=`${e}_futbin_price`;if(i){const e={expiryTimeStamp:new Date(Date.now()+9e5),price:i};v(s,e),t.set(s,i)}}}catch(e){console.log(e)}},xi=async e=>{const t=new Map,n=new Set,i=new Map;for(const s of e){if(!s.definitionId)continue;const e=w(`${s.definitionId}_futbin_price`);e?t.set(`${s.definitionId}_futbin_price`,e.price):s.isPlayer()?n.add(s.definitionId):s.isTraining()&&Ci.has(s._staticData.name)&&(i.has(s._staticData.name)||i.set(s._staticData.name,[]),i.get(s._staticData.name).push({definitionId:s.definitionId,subType:$i(s)}))}const s=[];return n.size&&s.push(Ti(n,t)),i.size&&s.push(Bi(i,t)),await Promise.all(s),t},Pi=async e=>{const t=C();return"FUTWIZ"===t?Si(e):"FUTBIN"===t?xi(e):void 0},Ii=e=>{let t=JSUtils.find(UTCurrencyInputControl.PRICE_TIERS,function(t){return e>=t.min});var n=Math.round(e/t.inc)*t.inc;return Math.max(Math.min(n,14999e3),0)},_i=e=>e<=1e3?e-50:e>1e3&&e<=1e4?e-100:e>1e4&&e<=5e4?e-250:e>5e4&&e<=1e5?e-500:e-1e3,Mi=e=>e<1e3?e+50:e>=1e3&&e<1e4?e+100:e>=1e4&&e<5e4?e+250:e>=5e4&&e<1e5?e+500:e+1e3,Ei=async(e,t,n)=>{let i;try{const s=n.definitionId,r=C();if("player"!==n.type)return i;await Pi([n]);const o=w(`${s}_${r.toLowerCase()}_price`);if(o&&o.price){i=o.price;const s=D(e.idSellFutBinPercent)||100;let a=i*s/100;await Di(n),n.hasPriceLimits()&&(a=Ii(Math.min(n._itemPriceLimits.maximum,Math.max(n._itemPriceLimits.minimum,a))),a===n._itemPriceLimits.minimum&&(a=Mi(a))),a=Ii(a),si(`= ${r} price for ${t}: ${i}: ${s}% of sale price: ${a}`,Te),i=a}else i=null,si(`= Unable to get ${r} price for ${t}`,Te)}catch(e){e=e.statusText||e.status||e,i=null,si(`= Unable to get Futbin price for ${t}, err: ${e||"error occured"}`,Te)}return i},Di=async e=>new Promise(t=>{e.hasPriceLimits()?t():services.Item.requestMarketData(e).observe(void 0,async function(e,n){t()})}),Ni=e=>{const t=w("sessionStats");t.transactions=t.transactions||[],t.transactions.push(e),v("sessionStats",t)},Fi=()=>{const{coinsNumber:e,searchCount:t,profit:n,runningTime:i,transactions:s}=w("sessionStats");let r="Available Coins,Search Count,Profit,Running Time,BIN Won Count,BID Won Count,Loss Count\n";r+=`${e||""},${t||""},${n||0},${i||""},${w("winCount")||0},${w("bidCount")||0},${w("lossCount")||0}\n\n`,r+="Transactions\n",r+=s.map(e=>`${e}\n`).join(""),((e,t)=>{d?I(e,t):M(e,t)})(r,"Stats")};setInterval(()=>{const e=w("sessionStats");e.searchPerMinuteCount=0,v("sessionStats",e)},55e3);const Ri=new Map,ki=(e,t,n,i,s,r)=>{const o=S();return new Promise(l=>{services.Item.bid(e,n).observe(void 0,async function(c,d){let u=U(n.toString(),6);const p=o.idNotificationType;if(d.success){s&&(A("purchasedCardCount"),L("cardWon"));const a=o.idSellRatingThreshold;let l=parseInt(e.rating);const c=!a||l<=a,d=o.idSellFutBinPrice;c&&d&&s&&(i=await Ei(o,t,e));o.idSellCheckBuyPrice&&n>95*i/100&&(i=-1);const m=i&&!isNaN(i)&&c,f=.95*i-n;if(s){const s=A("winCount");if(Ni(`[${(new Date).toLocaleTimeString()}] ${t.trim()} achat avec succès - Prix : ${n}`),Gt("winCount",s),si(`<h2>${t}</h2> <br>Acheté à ${n} <br>Vendu à ${i} <br>Bénéfice de ${f}`,Te,e,"success"),!o.idAbDontMoveWon){const n=w("sellQueue")||[];n.push({player:e,playerName:t,sellPrice:i,shouldList:m,profit:f}),v("sellQueue",n)}}else{const i=A("bidCount");Ni(`${t.trim()} succès de l'enchère - Prix : ${n}`),si(`B:${i} ${t} succès de l'enchère`,Te,e,"success");const s=w("currentFilter")||"default";if(s){const e=w("filterBidItems")||new Map;e.has(s)?e.get(s).add(r):e.set(s,new Set([r])),v("filterBidItems",e)}}"B"!==p&&"A"!==p||Jn("| "+t.trim()+" | "+u.trim()+` | ${s?"buy":"bid"} |`,!0)}else{A("lossCount");Ni(`[${(new Date).toLocaleTimeString()}] ${t.trim()} buy failed - Price : ${n}`);let i=(d.error&&d.error.code||d.status)+"";if(si(`${t} - échec de l'${s?"achat":"enchère"} - ERR: (${a[i]+"("+i+")"||0})`,Te,e,"error"),"L"!==p&&"A"!==p||Jn("| "+t.trim()+" | "+u.trim()+" | failure |",!1),o.idAbStopErrorCode){const t=new Set(o.idAbStopErrorCode.split(","));if(Ri.has(i)||Ri.set(i,{currentVal:0}),Ri.get(i).currentVal++,t.has(i)&&Ri.get(i).currentVal>=o.idAbStopErrorCodeCount&&(si(`[!!!] Autostopping bot since error code ${i} has occured ${Ri.get(i).currentVal} times\n`,Te,e,"error"),Ri.clear(),Qi(),o.idAbResumeAfterErrorOccured)){const t=E(o.idAbResumeAfterErrorOccured);si(`Le bot reprendra dans ${t}(s)`,Te,e,"error"),setTimeout(()=>{Ki.call(w("AutoBuyerInstance"))},1e3*t)}}}o.idAbAddBuyDelay&&await x(F(o.idAbDelayToAdd)),l()})})},Ui=new Set,Li=function(e){return Gn("Transfer Targets - List View"),new Promise(t=>{services.Item.clearTransferMarketCache(),services.Item.requestWatchedItems().observe(this,function(n,i){let s=e.idAbMaxBid,r=e.idAbSellPrice,o=i.response.items.filter(function(e){return!!e._auction});if(!o.length)return t();services.Item.refreshAuctions(o).observe(this,function(n,i){services.Item.requestWatchedItems().observe(this,async function(n,i){const o=w("autoBuyerActive"),a=w("currentFilter")||"default",l=(w("filterBidItems")||new Map).get(a)||new Set,c=w("userWatchItems");if(o&&s){let t=i.response.items.filter(function(e){return"outbid"===e._auction._bidState&&(!a||l.has(e._auction.tradeId))&&!c.has(e._auction.tradeId)&&"active"===e._auction._tradeState});if(t.length){const n=t[R(0,t.length-1)];await Oi(n,s,r,e)}}const d=e.idSellFutBinPrice;if(o&&!e.idAbDontMoveWon&&(r&&!isNaN(r)||d)){let t=i.response.items.filter(function(e){return e.getAuctionData().isWon()&&(!a||l.has(e._auction.tradeId))&&!c.has(e._auction.tradeId)&&!Ui.has(e._auction.tradeId)});for(var u=0;u<t.length;u++){const n=t[u],i=e.idSellRatingThreshold;let s=parseInt(n.rating);const o=!i||s<=i;let a=U(n._staticData.name,15),l=n._auction.currentBid;o&&d&&(r=await Ei(e,a,n));e.idSellCheckBuyPrice&&l>95*r/100&&(r=-1);const c=r&&!isNaN(r)&&o;if(c&&Ui.add(n._auction.tradeId),!e.idAbDontMoveWon){const e=w("sellQueue")||[],t=.95*r-l;e.push({player:n,sellPrice:r,playerName:a,shouldList:c,profit:t}),v("sellQueue",e)}}}let p=i.response.items.filter(e=>{var t=e.getAuctionData();return t.isExpired()||t.isClosedTrade()&&!t.isWon()});e.idAutoClearExpired&&p.length&&(services.Item.untarget(p),si(`${p.length} élément(s) expirés et supprimés de la liste d'objectifs`,Te)),services.Item.clearTransferMarketCache(),t()})})})})},Oi=async(e,t,n,i)=>{let s=e._auction,r=s.currentBid,o=s.currentBid||s.startingBid,a=U(e._staticData.name,15);const l=w("autoBuyerActive");let c=i.idAbBidExact?t:r?_i(t):t,d=i.idAbBidExact?t:r?Mi(o):o;l&&o<=c&&(si("Enchèr sur un élement en surenchère -> Prix d'enchère :"+d,Te),await ki(e,a,d,n),i.idAbAddBuyDelay&&await x(1))},Wi=()=>{const e=S();let t=e.idAntiCaptchKey,n=e.idProxyAddress,i=e.idProxyPort,s=e.idProxyLogin,r=e.idProxyPassword;if(!n||!i||!t)return si("Proxy info not filled properly",Te),void ii(e.idAbCloseTabToggle);function o(e){let n={clientKey:t,taskId:e};var i=new XMLHttpRequest;i.open("POST","https://api.anti-captcha.com/getTaskResult",!0),i.setRequestHeader("Content-Type","application/json"),i.onreadystatechange=function(){if(4===i.readyState&&200===i.status){var t=JSON.parse(i.responseText);if(0==t.errorId)if("ready"==t.status){new UTCaptchaViewModel(accessobjects.Captcha).validateToken(t.solution.token).observe(this,function(e,t){if(t.success){si("Captcha Solved",Te);const e=w("AutoBuyerInstance");Ki.call(e)}})}else setTimeout(()=>o(e),1e3);else si("Error occured when checking captcha result : "+t.errorCode+", "+t.errorDescription,Te)}};var s=JSON.stringify(n);i.send(s)}!function(){accessobjects.Captcha.getCaptchaData().observe(this,function(e,a){if(a.success){if(!(c=a.response.blob))return!1;let e={clientKey:t,task:{type:"FunCaptchaTask",websiteURL:"https://www.ea.com/ea-sports-fc/ultimate-team/web-app/",websitePublicKey:"A4EECF77-AC87-8C8D-5754-BF882F72063B",funcaptchaApiJSSubdomain:"ea-api.arkoselabs.com",data:a.response,proxyType:"http",proxyAddress:n,proxyPort:i,proxyLogin:s,proxyPassword:r,userAgent:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36"}};var l=new XMLHttpRequest;l.open("POST","https://api.anti-captcha.com/createTask",!0),l.setRequestHeader("Content-Type","application/json"),l.onreadystatechange=function(){if(4===l.readyState&&200===l.status){var e=JSON.parse(l.responseText);0==e.errorId?o(e.taskId):si("Got error from Captcha API: "+e.errorCode+", "+e.errorDescription,Te)}};var c=JSON.stringify(e);return l.send(c),!0}})}()},Vi=new Set,Hi=function(e){return new Promise(t=>{const n=F(e.idAbItemExpiring),i=e.idAbRandMinBidToggle,s=e.idAbRandMinBuyToggle,r=e.idBuyFutBinPercent||100;let o=w("currentPage")||1;Jt("searchPerMinuteCount")>15&&(e.idAbOverSearchWarning||void 0===e.idAbOverSearchWarning)&&si("<h2>Attention !</h2> <br>Plus de 15 recherches effectuées en une minute, vous devez augmenter votre temps d'attente entre les recherches !",Te,null,"warning");const a=new Set((e.idAddIgnorePlayersList||[]).map(({id:e})=>e)),l=C();let c=e.idAbMaxBid,d=e.idAbBuyPrice,u=e.idBuyFutBinPrice||e.idAbBidFutBin;if(!d&&!c&&!u)return si("skip search >>> (No Buy or Bid Price given)",Te),t();Gn("Transfer Market Search"),(()=>{const e=w("sessionStats");e.searchCount++,e.searchPerMinuteCount++,v("sessionStats",e)})();let p=this.viewmodel.searchCriteria;i&&(p.minBid=Ii(R(0,e.idAbRandMinBidInput))),s&&(p.minBuy=Ii(R(0,e.idAbRandMinBuyInput))),services.Item.clearTransferMarketCache(),services.Item.searchTransferMarket(p,o).observe(this,async function(i,s){if(s.success){v("searchFailedCount",0);let t=!0;si(`<h2>Aucun élément trouvé !</h2> <br>Page n°${o} <br>Enchère min à ${p.minBid} <br>Achat immédiat min à ${p.minBuy}`,Te),s.data.items.length>0&&(1===o&&Gn("Transfer Market Results - List View"),u&&"player"===s.data.items[0].type&&await Pi(s.data.items)),s.data.items.length>e.idAbSearchResult&&(t=!1);let i=e.idAbMaxPurchases||1;e.idAbShouldSort&&(s.data.items=((e,t,n)=>{let i=e=>e._auction.buyNowPrice;return"bid"===t?i=e=>e._auction.currentBid||e._auction.startingBid:"rating"===t?i=e=>parseInt(e.rating):"expires"===t&&(i=e=>parseInt(e._auction.expires)),e.sort((e,t)=>{const s=i(e),r=i(t);return n?s-r:r-s}),e})(s.data.items,e.idAbSortBy||"buy",e.idAbSortOrder));for(let o=s.data.items.length-1;o>=0&&w("autoBuyerActive");o--){let p=s.data.items[o],m=p._auction,f=services.Localization.localizeAuctionTimeRemaining(m.expires),g=p.type,{id:b}=p._metaData||{},h=parseInt(p.rating);if(u&&"player"===g){const t=w(`${p.definitionId}_${l.toLowerCase()}_price`);if(!t||!t.price){si(`Price unavailable for ${p._staticData.name}`,Te);continue}{const n=Ii(t.price*r/100);d=n,e.idAbBidFutBin&&(c=n)}}let y=m.buyNowPrice,v=m.currentBid||m.startingBid,S=m.currentBid,$=e.idAbBidExact?c:S?_i(c):c,A=e.idAbBidExact?$:S?Mi(v):v,C=e.idAbSellPrice,T=e.idAbMinRating,B=e.idAbMaxRating,x=p._staticData.name;const P=!(T||B)||Ai(h,T,B),I=ji(`${x}(${h}) Prix: ${y} temps: ${f}`);if(!e.idAbIgnoreAllowToggle&&a.has(b)||e.idAbIgnoreAllowToggle&&!a.has(b)){I("(Joueur ignoré)");continue}if(!t){I("(Seuil de résultats de recherche dépassé)");continue}if(i<1)break;if(!p.preferredPosition&&e.idAbAddFilterGK){I("(est un Gardien)");continue}if(!P){I("(la note ne correspond pas aux critères)");continue}if(Vi.has(m.tradeId)){I("(Cached Item)");continue}const _=services.User.getUser().coins.amount;if(!c&&_<y||c&&_<A)I("(Coins insuffisants pour acheter/enchérir)");else if(y<=d)I("essaye d'achat à: "+y),i--,Vi.add(m.tradeId),await ki(p,x,y,C,!0,m.tradeId);else if(c&&v<=$){if(m.expires>n){I("(Attente de l'heure d'expiration spécifiée)");continue}I("tentative d'enchère à: "+A),Vi.add(m.tradeId),i--,await ki(p,x,A,C,A===y,m.tradeId)}else I(d&&y>d||c&&v>$?`Prix d'achat: ${d||$} (supérieur au prix d'achat/offre spécifié)`:"(Aucune action requise)")}}else((e,t,n)=>{let i=!1;if(e.status===UtasErrorCode.CAPTCHA_REQUIRED||e.error&&e.error.code==UtasErrorCode.CAPTCHA_REQUIRED)i=!0,t?(si("[!!!] Captcha got triggered, trying to solve it",Te),Wi()):ii(n);else{const t=A("searchFailedCount");t>=3?(i=!0,si(`[!!!] Autostopping bot as search failed for ${t} consecutive times, please check if you can access transfer market in Web App ${e.status}`,Te)):si(`[!!!] Search failed - ${e.status}`,Te)}i&&(L("capatcha"),Qi())})(s,e.idAbSolveCaptcha,e.idAbCloseTabToggle);Gn("Transfer Market Search"),o<e.idAbMaxSearchPage&&21===s.data.items.length?A("currentPage"):v("currentPage",1),t()})})},ji=e=>t=>{si(e+" "+t,Te)},zi=function(e,t,n){return Gn("Transfer List - List View"),new Promise(i=>{n||repositories.Item.isDirty(ItemPile.TRANSFER)?services.Item.requestTransferItems().observe(this,async function(n,s){let r=s.response.items.filter(function(e){return e.getAuctionData().isSold()}).length;Jt("soldItems")<r&&await ai(),Gt("soldItems",r);const o=s.response.items.filter(function(e){return!e.getAuctionData().isSold()&&e.getAuctionData().isExpired()}).length;Gt("unsoldItems",o);const a=r>=t;o&&e&&services.Item.relistExpiredAuctions().observe(this,function(e,t){!a&&UTTransferListViewController.prototype.refreshList()});const l=s.response.items.filter(function(e){return e.getAuctionData().isSelling()}).length;Gt("activeTransfers",l);const c=s.response.items.filter(function(e){return e.getAuctionData().isInactive()}).length;Gt("availableItems",c);const d=services.User.getUser().coins.amount;Gt("coinsNumber",d),Gt("coins",d.toLocaleString()),a&&(si("[TRANSFER-LIST] > "+r+" item(s) sold\n",Te),UTTransferListViewController.prototype._clearSold()),i()}):i()})},Gi=function(){return{switchFilterWithContext:ui.bind(this),srchTmWithContext:Hi.bind(this),watchListWithContext:Li.bind(this),transferListWithContext:zi.bind(this),pauseBotWithContext:di.bind(this)}},Ji=async()=>{const e=w("sellQueue")||[],t=S();t.idAbSendListingNotificationToggle,e.length;for(;e.length;){const{player:n,sellPrice:i,shouldList:s,playerName:r,profit:o}=e.pop();await qi(n,i,o,s,t);e.length&&await x(2)}},qi=(e,t,n,i,s)=>new Promise(r=>{if(t<0)services.Item.move(e,ItemPile.TRANSFER).observe(void 0,async function(){r()});else if(i){if(repositories.Item.isPileFull(ItemPile.TRANSFER))return r("Unable to list, transfer List if Full");(e=>{const t=w("sessionStats");t.profit+=e,v("sessionStats",t)})(n),services.Item.list(e,_i(t),t,F(s.idFutBinDuration||"1H")||3600).observe(void 0,async function(e,t){r()})}else services.Item.move(e,ItemPile.CLUB).observe(void 0,async function(e,t){r()})});let Yi=null,Xi=null;const Ki=async function(e){$("#"+We).css("color","#2cbe2d").html("RUNNING");if(w("autoBuyerActive"))return;(e=>{zn(e?"Autobuyer Resumed":"Autobuyer Started"),v("autoBuyerActive",!0),v("autoBuyerState","Active"),isPhone()&&$(".ut-tab-bar-item").attr("disabled",!0),e||(v("botStartTime",new Date),v("purchasedCardCount",0),v("searchFailedCount",0),v("currentPage",1))})(e);const{switchFilterWithContext:t,srchTmWithContext:n,watchListWithContext:i,transferListWithContext:s,pauseBotWithContext:r}=Gi.call(this);await t();let o=S();!e&&await new Promise((e,t)=>{services.Item.requestWatchedItems().observe(void 0,function(t,n){if(n.success){const e=w("filterBidItems")||new Map,t=new Set(Array.from(e.values()).flat(1).reduce((e,t)=>e.concat([...t]),[])),i=n.response.items.filter(e=>e._auction&&!t.has(e._auction.tradeId)).map(e=>e._auction.tradeId)||[];v("userWatchItems",new Set(i)),i.length&&si(`${i.length} élément(s) trouvé(s) dans la liste d'objectifs de transferts et ignoré(s)`,Te)}e()})}),Gn("Hub - Transfers"),await n(o),Gn("Hub - Transfers"),await s(o.idAbSellToggle,o.idAbMinDeleteCount,!0);let a=!1;w("autoBuyerActive")&&(Yi=((e,t,n)=>{let i,s=!1;const r=()=>{if(s)return;const o={start:Date.now()},a=1e3*parseFloat((Math.random()*(n-t)+t).toFixed(1));o.end=o.start+a,v("searchInterval",o),i=setTimeout(()=>{e(),r()},a)};return r(),{clear(){s=!0,clearTimeout(i)}}})(async()=>{Xi=r(o),(e=>{const t=w("purchasedCardCount"),n=e.idAbCardCount,i=w("botStartTime").getTime();let s=li||E(e.idAbStopAfter);li||(li=s);let r=((new Date).getTime()-i)/1e3>=s;(r||n&&t>=n)&&(si("Autobuyer stopped | "+(r?"Time elapsed":"Max purchases count reached"),Te),li=null,ci=null,Qi())})(o);w("autoBuyerActive")&&!a&&(a=!0,await Ji(),await t(),o=S(),Gn("Hub - Transfers"),await n(o),Gn("Hub - Transfers"),await i(o),Gn("Hub - Transfers"),await s(o.idAbSellToggle,o.idAbMinDeleteCount)),a=!1},...k(o.idAbWaitTime)))},Qi=e=>{Yi&&Yi.clear(),!e&&Xi&&clearTimeout(Xi);const t=w("autoBuyerState");if(e&&t===r||!e&&t===o)return;v("autoBuyerActive",!1);const n=w("searchInterval")||{};v("searchInterval",{start:n.start,end:Date.now()}),e||L("finish"),isPhone()&&$(".ut-tab-bar-item").removeAttr("disabled"),v("autoBuyerState",e?r:o),zn(e?"Autobuyer Paused":"Autobuyer Stopped"),e||Ji(),$("#"+We).css("color","red").html(e?"PAUSED":"IDLE")},Zi=()=>`<div class="view-navbar-currency">\n            <span id=${Pt} style="font-weight: bold;\n            margin: auto 2px;">00:00:00</span>\n            <div style="margin: auto 2px;">Search:</div> \n            <div class="stats-progress">\n              <div id=${Re} class="stats-fill"></div>\n            </div>\n            <div class="view-navbar-currency-coins ab">Coins: <span id=${Le}></span></div>\n            <div class="view-navbar-currency-coins ab">Profit: <span id=${dt}></span></div>\n            <div class="view-navbar-currency-coins ab">Won: <span id=${Oe}></span></div>\n            ${ln(It,"⇩",()=>{Fi()},"filterSync download-stats")} \n          </div>`,es=()=>`\n  <div class="view-navbar-clubinfo-data">\n    <div class="view-navbar-clubinfo-name">\n    ${ln(It,"⇩",()=>{Fi()},"filterSync")}\n    </div>\n  </div>\n  <div class="view-navbar-clubinfo">\n    <div class="view-navbar-clubinfo-data">\n      <div class="view-navbar-clubinfo-name">\n        <span id=${Pt} style="font-weight: bold;">00:00:00</span>\n      </div>\n    </div>\n  </div>\n  <div class="view-navbar-clubinfo">\n    <div class="view-navbar-clubinfo-data">\n       <div class="view-navbar-clubinfo-name">\n          <div style="float: left;">Search:</div>\n          <div class="stats-progress">\n             <div id=${Re} class="stats-fill"></div>\n          </div>\n       </div>\n       <div class="view-navbar-clubinfo-name">\n          <div style="float: left;">Statistics:</div>\n          <div class="stats-progress">\n             <div id=${ke} class="stats-fill"></div>\n          </div>     \n       </div>\n    </div>\n  </div>\n  <div class="view-navbar-currency" style="margin-left: 10px;">\n    <div class="view-navbar-currency-coins ab">Coins: <span  id=${Le}></span></div>\n    <div class="view-navbar-currency-coins ab">Profit: <span  id=${dt}></span></div>\n    <div class="view-navbar-currency-coins ab">Won: <span id=${Oe}></span></div>\n  </div>\n  <div class="view-navbar-clubinfo">\n    <div class="view-navbar-clubinfo-data">\n       <span class="view-navbar-clubinfo-name">Sold Items: <span id=${Ve}></span></span>\n       <span class="view-navbar-clubinfo-name">Unsold Items: <span id=${He}></span></span>\n    </div>\n  </div>\n  <div class="view-navbar-clubinfo" style="border: none;">\n    <div class="view-navbar-clubinfo-data">\n       <span class="view-navbar-clubinfo-name">Available Items: <span id=${je}></span></span>\n       <span class="view-navbar-clubinfo-name">Active transfers: <span id=${ze}></span></span>\n    </div>\n  </div>`,{R:ts,T:ns}=n,is=function(e){UTMarketSearchFiltersViewController.call(this)},ss=UTMarketSearchFiltersViewController.prototype.init,rs=UTMarketSearchFiltersViewController.prototype.viewDidAppear;JSUtils.inherits(is,UTMarketSearchFiltersViewController),JSUtils.inherits(UTMarketSearchFiltersViewController,UTMarketSearchFiltersViewController),is.prototype.init=function(){ss.call(this);let e=this.getView();isPhone()||(e.__root.style="width: 100%; float: left;"),v("AutoBuyerInstance",this);const t=In.call(this);let n=$(e.__root);const i=qt.bind(this),s=i("Stop",()=>ns.call(this)),r=i("Clear Log",()=>ri.call(this),"btn-other"),o=i("Start",()=>{ts.call(this),$(".ut-navigation-container-view--content").animate({scrollTop:$(".ut-navigation-container-view--content").prop("scrollHeight")},400)},"call-to-action");setInterval(()=>{isPhone()?Ht():jt()},1e3),n.addClass("auto-buyer");const a=n.find(".button-container");a.addClass("buyer-actions"),a.find(".call-to-action").remove();const l=a.find('button:contains("Reset")');l.on("click touchend",async function(){$(`#${V}`).prop("selectedIndex",0),await _n()}),l.addClass("btn-other"),a.append($(o.__root)),a.append($(s.__root)),a.append($(r.__root)),$(t.__root).find(".menu-container").addClass("settings-menu"),n.find(".search-prices").append(t.__root)},is.prototype.viewDidAppear=function(){this.getNavigationController().setNavigationVisibility(!0,!0),os.call(this,!1)},UTMarketSearchFiltersViewController.prototype.viewDidAppear=function(){os.call(this,!0)};const os=function(e){rs.call(this);let t=this.getView(),n=$(t.__root);n.find(".filter-place").length||Cn.call(this,e).then(e=>{n.find(".ut-item-search-view").first().prepend(e)})};is.prototype.getNavigationTitle=function(){return setTimeout(()=>{const e=$(".title");isPhone()&&e.addClass("buyer-header"),$(".view-navbar-currency").remove(),$(".view-navbar-clubinfo").remove(),e.append(`<span style='color:red' id="${We}"> IDLE </span> | REQUEST COUNT: <span id="${Ue}">0</span> \n  `),$(isPhone()?Zi():es()).insertAfter(e),$(".ut-navigation-container-view--content").find(`#${Lt}`).remove(),$(".ut-navigation-container-view--content").append((()=>{const e=$(`<div style=${isPhone()?"height: 90%;display: flex;flex-direction: column;padding: 7px;":"width:48%"} id=${Lt}>\n            <div class="logs-container">\n              <div data-title="Clear logs" class="button-clear">\n              </div>\n            </div>\n            <br/>\n            <div class="logWrapper">\n            <ul wrap="off"  style="height: 100%;overflow-x: auto;resize: none; width: 100%;" id=${Te} class="autoBuyerLog"></ul>\n            <br/>\n        </div>`);return e.find(".button-clear").append(qt("⎚",()=>ri()).__root),e})()),Yt(),W(w("CommonSettings")||{})}),"MagicBuyer "};const as=()=>{const e=UTGameTabBarController.prototype.initWithViewControllers;UTGameTabBarController.prototype.initWithViewControllers=function(t){const n=new UTGameFlowNavigationController;n.initWithRootController(new is),n.tabBarItem=cs("MagicBuyer"),(t=ls(t)).push(n),e.call(this,t)}},ls=e=>{if(!isPhone())return e;const t=[];return t.push(e[0]),t.push(e[2]),t.push(e[3]),t.push(e[4]),t},cs=e=>{const t=new UTTabBarItemView;return t.init(),t.setTag(8),t.setText(e),t.addClass("icon-transfer"),t},ds=()=>{const e=UTNavigationBarView.prototype.layoutSubviews;function t(){const e=new UTNavigationButtonControl;return e.init(),e.addClass("menu-btn"),e.setInteractionState(!0),e.addTarget(this,()=>{window.ReactNativeWebView.postMessage(JSON.stringify({type:"OpenDrawer"}))},EventType.TAP),e}UTNavigationBarView.prototype.layoutSubviews=function(...n){const i=e.call(this,...n);if(this.primaryButton&&this.__clubInfo){this._menuBtn&&this._menuBtn.removeFromSuperview(),this._menuBtn=t.call(this);const e=$(this.primaryButton.getRootElement()),n=$(this._menuBtn.getRootElement());$(".top-nav").remove(),e.wrap('<div class="top-nav"></div>'),n.insertBefore(e)}return i}},us=window.fetch.bind(window);window.fetch=async function(e,t={}){if(!((e,t={})=>{const n="string"==typeof e?e:e?.url||"",i=t.method||"object"==typeof e&&e?.method;return!!n&&(/discordapp/.test(n)||/exp.host/.test(n))&&("POST"===i||"DELETE"===i)})(e,t))return us(e,t);const n="string"==typeof e?e:e.url,i=t.method||"object"==typeof e&&e.method||"GET";try{const e=await fi({method:i,url:n,headers:t.headers,body:t.body,credentials:t.credentials});if(200===e.status||204===e.status)return new Response(e.body??"",{status:e.status,statusText:e.statusText,headers:e.headers});const s=new Error(`Request failed with status ${e.status}`);throw s.response=e,s}catch(e){return Promise.reject(e)}};const ps=()=>{p(),as(),isPhone()&&ds(),T()},ms=()=>"\n  ::-webkit-scrollbar {\n    -webkit-appearance: none;\n  }\n  ::-webkit-scrollbar:vertical {\n      width: 12px;\n  }\n  ::-webkit-scrollbar:horizontal {\n      height: 12px;\n  }\n  ::-webkit-scrollbar-thumb {\n      background-color: rgba(0, 0, 0, .5);\n      border-radius: 10px;\n      border: 2px solid #ffffff;\n  }\n  ::-webkit-scrollbar-track {\n      border-radius: 10px;\n      background-color: #ffffff;\n  }",fs="MAGIC_BUYER_PAGE_COMMAND_RESPONSE",gs={start:async()=>{const e=bs();return await Ki.call(e),{state:"started"}},resume:async()=>{const e=bs();return await Ki.call(e,!0),{state:"resumed"}},stop:async()=>{const e=bs();return Qi.call(e,!1),{state:"stopped"}},pause:async()=>{const e=bs();return Qi.call(e,!0),{state:"paused"}},clearLogs:async()=>(ri(),{cleared:!0}),getStatus:async()=>ys(),getLogs:async()=>{const e=document.getElementById(Te);return{html:e?e.innerHTML:""}},open:async()=>(hs(),{opened:!0}),getSettingsSummary:async()=>{const e=Array.from(Bn.entries()).map(([e,t])=>({index:e,label:t.label})),t=await Sn(),n=w("activeSettingsTab")??0,i=document.getElementById(V)||document.getElementById(`${V}transfer`);return{categories:e,activeCategoryIndex:n,filters:t,activeFilter:i?.value||"",selectedFilters:w("selectedFilters")||[]}},setActiveSettingsTab:async({index:e})=>{if("number"!=typeof e||Number.isNaN(e))throw new Error("A valid settings index is required");hs();const t=(e=>{if(!Pn||!Bn.has(e))return!1;Pn.setActiveTab(e),Fn(),v("activeSettingsTab",e);const t=Bn.get(e).selector;return $(t).css("display",""),!0})(e);if(!t)throw new Error("Settings are not available yet. Open the MagicBuyer tab in the web app first.");return{activeCategoryIndex:e}}},bs=()=>{const e=w("AutoBuyerInstance");if(!e)throw new Error("MagicBuyer view is not initialized yet. Open the Ultimate Team web app and visit the MagicBuyer tab first.");return e},hs=()=>{const e=Array.from(document.querySelectorAll(".ut-tab-bar-item")).filter(e=>"MagicBuyer"===e.textContent?.trim());if(e.length){const t=e[0];t.dispatchEvent(new MouseEvent("click",{bubbles:!0})),t.dispatchEvent(new MouseEvent("mousedown",{bubbles:!0})),t.dispatchEvent(new MouseEvent("mouseup",{bubbles:!0}))}},ys=()=>{const e=e=>document.getElementById(e)?.textContent?.trim()||"";return{statusText:e(We),requestCount:e(Ue),coins:e(Le),profit:e(dt),won:e(Oe),sold:e(Ve),unsold:e(He),available:e(je),activeTransfers:e(ze),searchProgress:vs(Re),statisticsProgress:vs(ke),countdown:e(Pt)}},vs=e=>{const t=document.getElementById(e);if(!t)return 0;const n=/([0-9.]+)%/.exec(t.style.width||"");return n?Number(n[1]):0},ws=()=>{window.addEventListener("message",e=>{if(e.source!==window||!e.data)return;const{type:t,id:n,payload:i}=e.data;"MAGIC_BUYER_PAGE_COMMAND"===t&&n&&Promise.resolve().then(()=>(async e=>{if(!e||!e.command)throw new Error("Invalid command");const t=gs[e.command];if(!t)throw new Error(`Unknown command: ${e.command}`);return await t(e.args||{})})(i)).then(e=>{window.postMessage({type:fs,id:n,success:!0,payload:e},"*")}).catch(e=>{window.postMessage({type:fs,id:n,success:!1,error:e?.message||"Unknown command error"},"*")})})},Ss=function(){let e=!1;isPhone()&&$("body").removeClass("landscape").addClass("phone"),$(".ui-orientation-warning").attr("style","display: none !important"),$(".ut-fifa-header-view").attr("style","display: none !important"),services.Localization&&$("h1.title").html()===services.Localization.localize("navbar.label.home")&&(e=!0),e?(()=>{const e=document.createElement("style");$(".ui-orientation-warning").css("display","none"),$(".ut-fifa-header-view").css("display","none"),e.innerText=`\n  .buyer-header {\n      font-size: 20px !important;\n  }\n  .with-fifa-header .ut-root-view {\n    height: 100%;\n  }\n  .buyer-settings {\n      width: 100%;\n  }\n  .buyer-settings-field {\n    margin-top: 15px;\n    margin-bottom: 15px;\n  }\n  .phone .buyer-settings-field{\n    margin-top: auto;\n    margin-bottom: auto;\n    width: 100%;\n    padding: 10px;\n  }\n  .buyer-settings-wrapper {\n    display: flex; \n    flex-wrap: wrap; \n    margin-top: 20px;\n  }\n  .buyer-settings-field .ut-toggle-cell-view{\n    justify-content: center;\n  }\n  .buyer-settings-field input:disabled {\n    background-color: #c3c6ce;\n    cursor: not-allowed;\n  }\n  .btn-test-notification\n  {\n    width: 100%;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n  }\n  input[type="number"]{\n    padding: 0 .5em;\n    border-radius: 0;\n    background-color: #262c38;\n    border: 1px solid #4ee6eb;\n    box-sizing: border-box;\n    color: #4ee6eb;\n    font-family: UltimateTeam,sans-serif;\n    font-size: 1em;\n    height: 2.8em;\n    opacity: 1;\n    width: 100%;\n  }\n  .autoBuyerLog {\n    font-size: ${isPhone()?"13px":"15px"}; \n    height: 50%;\n  }\n  .cardPalyerLi {\n    width: 100%;\n  }\n  .cardPalyer {\n    transition: 0.3s;\n    width: 80%;\n    background: #222F3E;\n    color: white;\n    margin-bottom: 1%;\n    font-size: 1rem;\n    border-radius: 30px;\n    display: flex;\n    border: solid #2E86DE;\n  }\n  .cardPalyer:hover {\n    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);\n  }\n  .container {\n    display: flex;\n    width: 100%;\n  }\n  .contentContainer {\n    padding: 4%;\n    width: 100%;\n  }\n  .typeContent {\n    width: 300px;\n    background: #2E86DE;\n    height: 100%;\n    border-radius: 30px;\n    border-radius-right: 20px;\n    border-top-right-radius: 20px;\n    border-bottom-right-radius: 20px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n  }\n  .typeContentText {\n    font-size: 7rem;\n    color: #C8D6E5;\n  }\n  .searchLog {\n    font-size: 10px; \n    height: 50%;\n  }\n  input::-webkit-outer-spin-button,\n  input::-webkit-inner-spin-button {\n    -webkit-appearance: none;\n    margin: 0;\n  }\n  input[type=number] {\n    -moz-appearance: textfield;\n  }\n  .captcha-settings-view input,\n  .notification-settings-view input {\n    text-transform: none;\n  }\n  .phone .buyer-header{\n    font-size: 1.2em !important;\n  }\n  .phone .buyer-actions .btn-standard{\n    padding: 0;\n    font-size: 1.2em;\n    text-overflow: unset;\n  }\n  .filter-header-settings {\n    width: 100%;\n    padding: 10px;\n    font-family: UltimateTeamCondensed, sans-serif;\n    font-size: 1.6em;\n    color: #e2dde2;\n    text-transform: uppercase;\n    background-color: #171826;\n  }\n  .btn-save-filter {\n    width:100%\n  }\n  .btn-delete-filter {\n    width:50%\n  }\n  .multiple-filter {\n    width: 100%  !important;\n    display: flex  !important;\n    justify-content: center;\n    align-items: center;\n  }\n  .logs-container {\n    display: flex;\n    justify-content: space-between;\n    font-size: 20px;\n    align-items: center;\n  }\n  .button-clear button {\n    color: #fff;\n    background-color: unset;\n    height: unset;\n    line-height: unset;\n  }\n  .top-nav{\n    display:flex; \n  }\n  .ut-navigation-button-control.menu-btn:before {\n    content: "≡";\n    transform: unset;\n  }\n  .menu-btn {\n    min-width: 0px;\n    margin-left: 5px;\n  }\n  .filterSync {\n    background: transparent;\n    color: #c4f750;\n    text-overflow: clip;\n  }\n  .filterSync:hover {\n    background: transparent !important;\n  }\n  .stats-progress {\n    float: right; \n    height: 10px; \n    width: 100px; \n    background: #888; \n    margin: ${isPhone()?"auto 5px":"5px 0px 5px 5px"};\n  }\n  .stats-fill {\n    background: #000; \n    height: 10px; \n    width: 0%\n  }\n  .numericInput:invalid {\n    color: red;\n    border: 1px solid;\n  }\n  .ignore-players{\n    width: 100%;\n    display: flex;\n    background: transparent;\n  }\n  .ignore-players .ut-player-search-control{\n    width: 90% !important;\n  }\n  .ignore-players filterSync{\n    flex: unset;\n  }\n  .font15 {\n    font-size: 15px;\n  }  \n  .action-icons {\n    display: unset !important;\n    width: 10%\n  }\n  .displayCenterFlx {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n  }\n  .displayNone {\n    height: 275px;\n  }\n  .displayNone .inline-list-select,\n  .displayNone .search-prices,\n  .displayNone .btn-actions,\n  .displayNone .btn-filters,\n  .displayNone .btn-report,\n  .displayNone .buyer-actions .btn-other {\n    display: none !important;\n  }\n  .mrg10 {\n    margin: 10px;\n  }\n  .ut-toggle-cell-view--label{\n    overflow: unset;\n  }\n  .download-stats {\n    line-height: 1;\n    display: flex;\n  }\n  .btn-report {\n    display: flex;\n    justify-content: center;\n  }\n  small{\n    white-space: break-spaces;\n  }  \n  .joinServer {\n    position: absolute;\n    right: 25px;\n    top: 50%;\n    color: wheat\n  }\n  .phone .joinServer{\n    display: none;\n  }\n  textarea {\n    resize: none;\n  }  \n  .logWrapper {\n    position: relative;\n    height: 100%\n  }\n  .ut-navigation-bar-view .view-navbar-currency-coins.ab:before {\n    content: unset !important;\n  }\n  .ut-navigation-bar-view .view-navbar-currency-coins.ab {\n    cursor: unset !important;\n  } \n  .auto-buyer .autoBuyMin{\n    display: none;\n  }\n  .auto-buyer .search-prices .settings-field{\n    display: none;\n  }\n  `,e.innerText+=ms(),document.head.appendChild(e)})():setTimeout(Ss,1e3)},$s=function(){let e=!1;services.Localization&&(e=!0),e?(ps(),Ss(),d&&window.addEventListener("message",e=>{const t=JSON.parse(e.data);if("dataFromExternalAB"===t.type){const{res:e,identifier:n}=t.response,i=w(n);return i&&i(e),v(n,null)}},!0),ws()):setTimeout($s,1e3)};$s()})();