export function renderAbout() {
  const app = document.querySelector("#app");
  app.innerHTML = `
    <h1>About</h1>
    <p>Acerca de esta SPA.</p>
    <p><a href="/">Volver al Home</a></p>
  `;
}