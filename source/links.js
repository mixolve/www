(() => {
  const currentScript = document.currentScript;
  const linksPath = currentScript
    ? new URL("../resources/links.txt", currentScript.src).href
    : "./resources/links.txt";

  const parseLinks = (text) => {
    return text.split(/\r?\n/).reduce((links, line) => {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith("#")) {
        return links;
      }

      const separatorIndex = trimmedLine.indexOf("=");

      if (separatorIndex === -1) {
        return links;
      }

      const key = trimmedLine.slice(0, separatorIndex).trim();
      const url = trimmedLine.slice(separatorIndex + 1).trim();

      if (key && url) {
        links[key] = url;
      }

      return links;
    }, {});
  };

  const applyLinks = (links) => {
    document.querySelectorAll("[data-link-key]").forEach((link) => {
      const url = links[link.dataset.linkKey];

      if (url) {
        link.href = url;
        link.removeAttribute("aria-disabled");
        return;
      }

      link.removeAttribute("href");
      link.setAttribute("aria-disabled", "true");
    });
  };

  const bindPressFeedback = () => {
    document.querySelectorAll(".link-button").forEach((link) => {
      const startPress = () => {
        link.classList.add("is-pressing");
      };

      const endPress = () => {
        window.setTimeout(() => {
          link.classList.remove("is-pressing");
          link.blur();
        }, 120);
      };

      link.addEventListener("pointerdown", startPress, { passive: true });
      link.addEventListener("pointerup", endPress, { passive: true });
      link.addEventListener("pointercancel", endPress, { passive: true });
      link.addEventListener("pointerleave", endPress, { passive: true });
      link.addEventListener("touchstart", startPress, { passive: true });
      link.addEventListener("touchend", endPress, { passive: true });
      link.addEventListener("touchcancel", endPress, { passive: true });
      link.addEventListener("click", endPress);
    });
  };

  bindPressFeedback();

  fetch(linksPath, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Could not load ${linksPath}`);
      }

      return response.text();
    })
    .then((text) => applyLinks(parseLinks(text)))
    .catch((error) => {
      console.error(error);
    });
})();
