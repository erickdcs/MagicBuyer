const globalScope = typeof window !== "undefined" ? window : globalThis;

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

if (!globalScope.$) {
  globalScope.$ = $;
}

if (!globalScope.jQuery) {
  globalScope.jQuery = $;
}

export default $;
