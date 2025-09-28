const collectionMarker = Symbol("domLiteCollection");

const isHtmlString = (value) =>
  typeof value === "string" && /<([a-z][^\0>\x20\t\r\n\f]*)/i.test(value);

const isCollection = (value) => Boolean(value && value[collectionMarker]);

const createElementsFromHtml = (html) => {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return Array.from(template.content.childNodes).filter(
    (node) => node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE
  );
};

const toArray = (value) => {
  if (!value) {
    return [];
  }

  if (isCollection(value)) {
    return [...value.elements];
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (value instanceof NodeList || value instanceof HTMLCollection) {
    return Array.from(value);
  }

  if (value instanceof Node || value === window || value === document) {
    return [value];
  }

  return [];
};

const parseSelector = (selector, context) => {
  if (typeof selector === "string") {
    if (isHtmlString(selector)) {
      return createElementsFromHtml(selector);
    }

    const ctx = context
      ? isCollection(context)
        ? context.elements[0]
        : context
      : document;

    if (!ctx) {
      return [];
    }

    if (ctx instanceof Element || ctx instanceof Document || ctx instanceof DocumentFragment) {
      return Array.from(ctx.querySelectorAll(selector));
    }

    return [];
  }

  if (typeof selector === "function") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", selector);
    } else {
      selector();
    }
    return [document];
  }

  return toArray(selector);
};

const listenerRegistry = new WeakMap();

const addListener = (element, type, selector, handler) => {
  const listeners = listenerRegistry.get(element) || [];

  const wrappedListener = (event) => {
    if (selector) {
      let target = event.target;
      while (target && target !== element) {
        if (target.matches && target.matches(selector)) {
          handler.call(target, event);
          break;
        }
        target = target.parentElement;
      }
    } else {
      handler.call(element, event);
    }
  };

  element.addEventListener(type, wrappedListener, false);
  listeners.push({ type, selector, handler, wrappedListener });
  listenerRegistry.set(element, listeners);
};

const removeListeners = (element, types, selector) => {
  const listeners = listenerRegistry.get(element);
  if (!listeners || !listeners.length) {
    return;
  }

  const typeSet = new Set(types);
  const updated = [];

  listeners.forEach((entry) => {
    const matchesType = !typeSet.size || typeSet.has(entry.type);
    const matchesSelector =
      selector === undefined || selector === null || selector === entry.selector;

    if (matchesType && matchesSelector) {
      element.removeEventListener(entry.type, entry.wrappedListener, false);
    } else {
      updated.push(entry);
    }
  });

  if (updated.length) {
    listenerRegistry.set(element, updated);
  } else {
    listenerRegistry.delete(element);
  }
};

const normalizeClassNames = (classNames) =>
  classNames
    .split(/\s+/)
    .map((name) => name.trim())
    .filter(Boolean);

const toNodes = (content) => {
  if (typeof content === "string") {
    if (isHtmlString(content)) {
      return createElementsFromHtml(content);
    }
    return [document.createTextNode(content)];
  }

  return toArray(content);
};

class DollarCollection {
  constructor(elements) {
    this.elements = elements || [];
    this.length = this.elements.length;
    this[collectionMarker] = true;
    this.elements.forEach((element, index) => {
      this[index] = element;
    });
  }

  [Symbol.iterator]() {
    return this.elements[Symbol.iterator]();
  }

  each(callback) {
    this.elements.forEach((element, index) => {
      callback.call(element, index, element);
    });
    return this;
  }

  addClass(classNames) {
    if (!classNames) {
      return this;
    }
    const classes = normalizeClassNames(classNames);
    return this.each((_, element) => {
      if (!element.classList) {
        return;
      }
      classes.forEach((cls) => element.classList.add(cls));
    });
  }

  removeClass(classNames) {
    if (!classNames) {
      return this;
    }
    const classes = normalizeClassNames(classNames);
    return this.each((_, element) => {
      if (!element.classList) {
        return;
      }
      classes.forEach((cls) => element.classList.remove(cls));
    });
  }

  toggleClass(classNames) {
    if (!classNames) {
      return this;
    }
    const classes = normalizeClassNames(classNames);
    return this.each((_, element) => {
      if (!element.classList) {
        return;
      }
      classes.forEach((cls) => element.classList.toggle(cls));
    });
  }

  attr(name, value) {
    if (value === undefined) {
      const element = this.elements[0];
      return element ? element.getAttribute(name) : undefined;
    }
    return this.each((_, element) => {
      if (element.setAttribute) {
        element.setAttribute(name, value);
      }
    });
  }

  removeAttr(name) {
    return this.each((_, element) => {
      if (element.removeAttribute) {
        element.removeAttribute(name);
      }
    });
  }

  html(value) {
    if (value === undefined) {
      const element = this.elements[0];
      return element ? element.innerHTML : undefined;
    }
    return this.each((_, element) => {
      if ("innerHTML" in element) {
        element.innerHTML = value;
      }
    });
  }

  text(value) {
    if (value === undefined) {
      const element = this.elements[0];
      return element ? element.textContent : undefined;
    }
    return this.each((_, element) => {
      if ("textContent" in element) {
        element.textContent = value;
      }
    });
  }

  val(value) {
    if (value === undefined) {
      const element = this.elements[0];
      if (!element) {
        return undefined;
      }
      if (element instanceof HTMLSelectElement && element.multiple) {
        return Array.from(element.selectedOptions).map((option) => option.value);
      }
      return element.value;
    }

    return this.each((_, element) => {
      if ("value" in element) {
        element.value = value;
      }
    });
  }

  prop(name, value) {
    if (value === undefined) {
      const element = this.elements[0];
      return element ? element[name] : undefined;
    }

    return this.each((_, element) => {
      element[name] = value;
    });
  }

  css(property, value) {
    if (typeof property === "string" && value === undefined) {
      const element = this.elements[0];
      if (!element || !element.style) {
        return undefined;
      }
      return element.style[property];
    }

    const styles =
      typeof property === "object" ? property : { [property]: value };

    return this.each((_, element) => {
      if (!element || !element.style) {
        return;
      }
      Object.entries(styles).forEach(([key, val]) => {
        element.style[key] = val;
      });
    });
  }

  append(content) {
    const nodes = toNodes(content);
    if (!nodes.length) {
      return this;
    }

    this.elements.forEach((element, elementIndex) => {
      nodes.forEach((node) => {
        const nodeToInsert =
          elementIndex === 0 ? node : node.cloneNode(true);
        element.appendChild(nodeToInsert);
      });
    });
    return this;
  }

  wrap(wrapper) {
    if (!wrapper) {
      return this;
    }

    return this.each((index, element) => {
      const wrapperContent =
        typeof wrapper === "function" ? wrapper.call(element, index) : wrapper;
      const nodes = toNodes(wrapperContent);

      if (!nodes.length) {
        return;
      }

      const nodesForWrap = nodes.map((node) => {
        if (index === 0) {
          return node;
        }
        return node && node.cloneNode ? node.cloneNode(true) : node;
      });

      const wrapperNode = nodesForWrap[0];

      if (!(wrapperNode instanceof Element)) {
        return;
      }

      const parent = element.parentNode;
      if (parent) {
        parent.insertBefore(wrapperNode, element);
      }

      wrapperNode.appendChild(element);

      for (let i = 1; i < nodesForWrap.length; i++) {
        const childNode = nodesForWrap[i];
        if (childNode instanceof Node) {
          wrapperNode.appendChild(childNode);
        }
      }
    });
  }


  prepend(content) {
    const nodes = toNodes(content);
    if (!nodes.length) {
      return this;
    }

    this.elements.forEach((element, elementIndex) => {
      nodes
        .slice()
        .reverse()
        .forEach((node) => {
          const nodeToInsert =
            elementIndex === 0 ? node : node.cloneNode(true);
          element.insertBefore(nodeToInsert, element.firstChild);
        });
    });
    return this;
  }

  appendTo(target) {
    $(target).append(this);
    return this;
  }

  find(selector) {
    const found = [];
    this.elements.forEach((element) => {
      if (element.querySelectorAll) {
        found.push(...element.querySelectorAll(selector));
      }
    });
    return new DollarCollection(found);
  }

  first() {
    return new DollarCollection(this.elements.length ? [this.elements[0]] : []);
  }

  filter(selector) {
    if (typeof selector === "function") {
      return new DollarCollection(
        this.elements.filter((element, index) => selector.call(element, index, element))
      );
    }

    return new DollarCollection(
      this.elements.filter((element) =>
        element.matches ? element.matches(selector) : false
      )
    );
  }

  remove() {
    return this.each((_, element) => {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
  }

  insertBefore(target) {
    const targetCollection = $(target);
    targetCollection.each((_, targetElement) => {
      this.elements.forEach((element, index) => {
        if (!targetElement.parentNode) {
          return;
        }
        const nodeToInsert =
          index === 0 ? element : element.cloneNode(true);
        targetElement.parentNode.insertBefore(nodeToInsert, targetElement);
      });
    });
    return this;
  }

  on(events, selector, handler) {
    if (typeof events === "object" && !Array.isArray(events)) {
      Object.entries(events).forEach(([eventName, eventHandler]) => {
        this.on(eventName, selector, eventHandler);
      });
      return this;
    }

    if (typeof selector === "function" || selector === false) {
      handler = selector;
      selector = undefined;
    }

    if (typeof handler !== "function" || !events) {
      return this;
    }

    const eventNames = events.split(/\s+/).filter(Boolean);

    return this.each((_, element) => {
      eventNames.forEach((eventName) => {
        addListener(element, eventName, selector, handler);
      });
    });
  }

  off(events, selector) {
    const eventNames = events ? events.split(/\s+/).filter(Boolean) : [];
    return this.each((_, element) => {
      removeListeners(element, eventNames, selector);
    });
  }

  trigger(eventType) {
    if (!eventType) {
      return this;
    }
    const eventNames = eventType.split(/\s+/).filter(Boolean);
    return this.each((_, element) => {
      eventNames.forEach((type) => {
        const event = new Event(type, { bubbles: true, cancelable: true });
        element.dispatchEvent(event);
      });
    });
  }

  click(handler) {
    if (typeof handler === "function") {
      return this.on("click", handler);
    }
    return this.trigger("click");
  }

  animate(properties) {
    if (!properties) {
      return this;
    }
    return this.each((_, element) => {
      Object.entries(properties).forEach(([key, value]) => {
        if (key === "scrollLeft") {
          element.scrollLeft = value;
        } else if (element.style) {
          element.style[key] = value;
        }
      });
    });
  }
}

const $ = (selector, context) => new DollarCollection(parseSelector(selector, context));

$.each = (collection, callback) => {
  if (!collection || typeof callback !== "function") {
    return collection;
  }

  if (isCollection(collection)) {
    collection.elements.forEach((item, index) => {
      callback.call(item, index, item);
    });
    return collection;
  }

  if (Array.isArray(collection)) {
    collection.forEach((item, index) => {
      callback.call(item, index, item);
    });
    return collection;
  }

  if (typeof collection === "object") {
    Object.keys(collection).forEach((key) => {
      callback.call(collection[key], key, collection[key]);
    });
  }

  return collection;
};

$.isEmptyObject = (obj) => {
  if (!obj) {
    return true;
  }
  return Object.keys(obj).length === 0;
};

$.fn = DollarCollection.prototype;

export default $;
