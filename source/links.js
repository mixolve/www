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
