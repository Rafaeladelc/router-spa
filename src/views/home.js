export function renderHome() {
  const app = document.querySelector("#app");
  app.innerHTML = `
    <h1>Home</h1>
    <p>Bienvenida a la aplicación de chat.</p>
    <p><a href="/chat">Ir al Chat</a></p>
  `;
}