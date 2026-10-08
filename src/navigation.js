import { navigateTo } from "./router.js";

export function setupLinkInterception() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href) return;

    // Ctrl / Cmd / Shift / Alt + click: el usuario quiere otra pestaña o ventana
    const isModified =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

    // Links que ya piden abrirse en una pestaña nueva
    const isNewTab = link.target === "_blank";

    // Links a otro dominio
    const isExternal = link.origin !== window.location.origin;

    if (isModified || isNewTab || isExternal) return;

    // Solo rutas internas absolutas (empiezan con /)
    if (!href.startsWith("/")) return;

    event.preventDefault();
    navigateTo(href);
  });
}