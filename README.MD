Router SPA con 3 vistas

SPA hecha con JavaScript puro y la History API (pushState + popstate). Tiene 3 vistas (Home, Chat, About), una vista 404 y navegación sin recargar la página.

Autora: Rafaela Lectura 2 – Módulo 3 (Frontend Moderno y SPAs) – SoyHenry

1. Estructura del proyecto
router-spa/
├── index.html        # Una sola página: nav + <main id="app">
├── styles.css
├── vercel.json       # history fallback para publicar en Vercel
├── README.md
└── src/
    ├── main.js       # Punto de entrada: popstate + interceptor + render inicial
    ├── router.js     # Tabla de rutas, router() y navigateTo()
    ├── navigation.js # Intercepta clicks en links internos
    └── views/
        ├── home.js
        ├── chat.js
        ├── about.js
        └── notFound.js
2. Cómo ejecutarlo
Abrir la terminal en la carpeta router-spa.
Ejecutar: npx.cmd vite (en PowerShell de Windows) o npx vite en otros sistemas.
Abrir http://localhost:5173.

Importante: usar Vite y no Live Server. Live Server no tiene history fallback y muestra Cannot GET /chat al recargar una ruta interna.

3. Cómo funciona
router(): lee window.location.pathname, busca esa ruta en la tabla routes y ejecuta la función que dibuja la vista. Si la ruta no existe, dibuja renderNotFound.
navigateTo(path): llama a history.pushState para cambiar la URL sin recargar y luego llama a router() a mano, porque pushState no dibuja nada por sí solo.
Evento popstate: se dispara cuando el usuario usa Atrás o Adelante del navegador. No se dispara con pushState ni con replaceState.
Interceptor de links: un solo listener de click en document (delegación de eventos) detecta clicks en cualquier <a>, incluso en los que se crean después con innerHTML, y decide si el router debe manejarlos.
Vista 404: aparece cuando la ruta no está en la tabla routes. Es el 404 de la aplicación, distinto del 404 del servidor.
4. Pruebas realizadas
Prueba 1 – Navegación interna sin recarga

Pasos

Abrir http://localhost:5173/.
Anotar la hora que aparece en "Página cargada a las…".
Hacer click en Chat y luego en About.
Comparar la hora.

Qué esperaba: la vista cambia, la URL cambia y la hora no cambia (no hubo recarga).

Mi resultado: Se cumplió. La vista y la URL cambiaron y la hora de "Página cargada a las…" se mantuvo igual, por lo tanto no hubo recarga completa.

Prueba 2 – Botones Atrás y Adelante

Pasos

Desde Home, hacer click en Chat y luego en About.
Pulsar Atrás del navegador dos veces.
Pulsar Adelante una vez.

Qué esperaba: las vistas y la URL cambian de forma coherente: About → Chat → Home → Chat.

Mi resultado: Se cumplió. Las vistas y la URL cambian de forma coherente con Atrás y Adelante gracias al evento popstate.

Prueba 3 – Deep link (abrir directo una ruta interna)

Pasos

Abrir una pestaña nueva y escribir http://localhost:5173/about.
Estando en /chat, pulsar F5.

Qué esperaba: se muestra la vista correcta (About en el primer caso, Chat en el segundo). La URL es la fuente de verdad.

Mi resultado: Se cumplió. Abrir /about directamente muestra About y F5 en /chat sigue mostrando Chat, porque el render inicial lee la URL.

Prueba 4 – Ruta inexistente (404)

Pasos

Escribir en el navegador http://localhost:5173/xyz.
Hacer click en el link Volver al inicio.

Qué esperaba: aparece "404 - Página no encontrada" con la ruta /xyz, y el link devuelve al Home sin recargar.

Mi resultado: Se cumplió. Apareció "404 - Página no encontrada" con la ruta /xyz y el link "Volver al inicio" me llevó al Home sin recargar.

Prueba 5 – Ctrl+click (o Cmd+click en Mac) en un link interno

Pasos

Estando en Home, hacer Ctrl+click en About.
Mirar la pestaña original y la nueva.

Qué esperaba: About se abre en una pestaña nueva y la pestaña original queda igual (el interceptor deja pasar el click).

Mi resultado: Se cumplió. About se abrió en una pestaña nueva y la pestaña original no cambió, porque el interceptor deja pasar los clicks con tecla modificadora.

Prueba 6 – Link externo

Pasos

Hacer click en Google (https://google.com).
Volver a la app y hacer click en Ejemplo (target="_blank").
Revisar la consola (F12) en localhost:5173.

Qué esperaba: Google abre normalmente saliendo de la app. Ejemplo abre en pestaña nueva. No hay SecurityError en la consola.

Mi resultado: Se cumplió. Google abrió saliendo de la app, Ejemplo abrió en pestaña nueva y no apareció SecurityError en la consola de localhost:5173.

5. Resumen de resultados
#	Prueba	¿Pasó? (Sí / No)
1	Navegación interna sin recarga	Sí
2	Atrás / Adelante	Sí
3	Deep link y F5	Sí
4	Ruta inexistente (404)	Sí
5	Ctrl+click	Sí
6	Link externo	Sí
6. Errores que encontré y cómo los resolví
Error o síntoma	Causa	Solución
Cannot GET /chat con Live Server	Live Server es un servidor estático sin history fallback: busca un archivo /chat que no existe	Usar Vite (npx.cmd vite), que devuelve index.html para rutas desconocidas
SecurityError de pushState al hacer click en Google	El interceptor capturaba todos los links, y pushState solo acepta URLs del mismo origen	Filtrar en navigation.js: dejar pasar links externos, con target="_blank" o con Ctrl/Cmd/Shift/Alt
"Atrás no hace nada" (la URL cambia pero la vista no)	popstate cambia la URL pero no dibuja la vista; faltaba el listener	Agregar window.addEventListener("popstate", router) en main.js
npx bloqueado en PowerShell	La política de ejecución de scripts de Windows bloquea npx.ps1	Usar npx.cmd vite
7. Despliegue (history fallback)

Para publicar la SPA, el servidor debe devolver index.html para cualquier ruta. En Vercel se logra con vercel.json:

json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}

Sin esta regla, recargar /chat en producción daría 404 del servidor.

8. Extensiones opcionales (pendientes)
 A. Marcar el link activo en el menú
 B. Evitar entradas duplicadas en el historial al hacer click en la ruta actual
 C. Volver al inicio de la página (window.scrollTo(0, 0)) al cambiar de vista