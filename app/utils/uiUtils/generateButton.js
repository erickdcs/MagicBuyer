let eventMappers = new Set();

export const generateButton = (
  id,
  label,
  callback,
  additionalClasses = "",
  options = {}
) => {
  if (!eventMappers.has(id)) {
    initializeListensers(id, callback);
    eventMappers.add(id);
  }

  if (typeof additionalClasses === "object" && additionalClasses !== null) {
    options = additionalClasses;
    additionalClasses = "";
  }

  if (typeof options === "string") {
    options = { title: options };
  } else if (typeof options !== "object" || options === null || Array.isArray(options)) {
    options = {};
  }

  const {
    leadingIcon = null,
    trailingIcon = null,
    density = "",
    title = "",
  } = options;

  const densityClass = density ? `btn-standard--${density}` : "";
  const classList = ["btn-standard", densityClass, additionalClasses]
    .filter(Boolean)
    .join(" ");

  const content = [];
  if (leadingIcon) {
    content.push(
      `<span class="btn-standard__icon btn-standard__icon--leading" aria-hidden="true">${leadingIcon}</span>`
    );
  }
  content.push(`<span class="btn-standard__label">${label}</span>`);
  if (trailingIcon) {
    content.push(
      `<span class="btn-standard__icon btn-standard__icon--trailing" aria-hidden="true">${trailingIcon}</span>`
    );
  }

  const titleAttribute = title ? ` title="${title}"` : "";

  return `<button type="button" class="${classList}" id="${id}"${titleAttribute}>${content.join("")}</button>`;
};

const initializeListensers = (id, callback) => {
  $(document).on(
    {
      mouseenter: function () {
        $(this).addClass("is-hover");
      },
      mouseleave: function () {
        $(this).removeClass("is-hover is-active");
      },
      mousedown: function () {
        $(this).addClass("is-active");
      },
      mouseup: function () {
        $(this).removeClass("is-active");
      },
      focusin: function () {
        $(this).addClass("is-focus");
      },
      focusout: function () {
        $(this).removeClass("is-focus");
      },
      click: function () {
        callback();
      },
      keydown: function (evt) {
        if (evt.key === " " || evt.key === "Enter") {
          evt.preventDefault();
          callback();
        }
      },
      touchstart: function () {
        $(this).addClass("is-hover is-active");
      },
      touchend: function () {
        $(this).removeClass("is-active");
        callback();
      },
      touchcancel: function () {
        $(this).removeClass("is-hover is-active");
      },
    },
    `#${id}`
  );
};
