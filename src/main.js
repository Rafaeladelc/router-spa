import { router } from "./router.js";
import { setupLinkInterception } from "./navigation.js";

console.log("main.js cargado");

document.querySelector("#cargada").textContent =
  "Página cargada a las " + new Date().toLocaleTimeString();

// Back/Forward: el navegador cambia la URL y avisa con popstate
window.addEventListener("popstate", () => {
  router();
});

// Clicks en links internos: navegar sin recargar
setupLinkInterception();

// Render inicial: dibuja la vista según la URL con la que se abrió la app
router();