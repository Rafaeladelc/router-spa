import { renderHome } from "./views/home.js";
import { renderChat } from "./views/chat.js";
import { renderAbout } from "./views/about.js";
import { renderNotFound } from "./views/notFound.js";

// Tabla de rutas: pathname -> función que dibuja esa vista
const routes = {
  "/": renderHome,
  "/chat": renderChat,
  "/about": renderAbout,
};

// router(): lee la URL actual y dibuja la vista que corresponde
export function router() {
  const path = window.location.pathname;
  const render = routes[path] || renderNotFound;
  render();
}

// navigateTo(): navegación programática (cambia la URL y dibuja la vista)
export function navigateTo(path) {
  history.pushState(null, "", path);
  router(); // pushState NO dispara popstate: hay que llamar al router a mano
}