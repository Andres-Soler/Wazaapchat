import { showLogin } from "./componentes/login.js";
import { showRegister } from "./componentes/register.js";
import { showHome } from "./componentes/home.js";
import { showMessages } from "./componentes/messages.js";
import { getSnaps, deleteSnap } from "./data/storage.js";

let startX = 0;
let currentView = "login";
let previousView = null;
const views = ["home", "snaps", "messages"];

export function navigate(page) {
    const app = document.getElementById("app");

    // guardar la vista actual como previa
    if (currentView && currentView !== page) {
        previousView = currentView;
    }

    // limpiar contenido
    app.innerHTML = "";

    // estilo fullscreen solo para home
    if (page === "home") {
        app.classList.add("fullscreen");
        app.style.height = "";
    } else {
        app.classList.remove("fullscreen");
        app.style.height = "100vh";
    }

    switch (page) {
        case "login":
            showLogin();
            break;
        case "register":
            showRegister();
            break;
        case "home":
            showHome();
            break;
        case "snaps":
            // botón de volver
            addBackButton(app);

            // contenedor de snaps
            const snapContainer = document.createElement("div");
            snapContainer.className = "snap-list";
            snapContainer.style.maxHeight = "calc(100vh - 120px)";
            snapContainer.style.overflowY = "auto";
            app.appendChild(snapContainer);

            // función para renderizar snaps
            function renderAllSnaps() {
                const snaps = getSnaps();
                snapContainer.innerHTML = ""; // limpiar antes de render

                if (snaps.length === 0) {
                    snapContainer.innerHTML = "<p>No hay fotos aún.</p>";
                    return;
                }

                snaps.forEach(snap => {
                    const div = document.createElement("div");
                    div.className = "snap-item";
                    div.dataset.id = snap.id;
                    div.innerHTML = `
                        <img src="${snap.img}" />
                        <p>${snap.seen ? "👁️ Visto" : "✨ Nuevo"}</p>
                        <button class="delete-snap">🗑️ Borrar</button>
                    `;
                    snapContainer.appendChild(div);

                    // listener para borrar snap
                    const btn = div.querySelector(".delete-snap");
                    btn.addEventListener("click", () => {
                        deleteSnap(snap.id);
                        renderAllSnaps(); // recargar snaps
                    });
                });
            }

            renderAllSnaps();
            break;

        case "messages":
            showMessages();
            addBackButton(app);
            break;

        default:
            showHome();
    }

    // animación fade
    app.classList.remove("fade");
    void app.offsetWidth;
    app.classList.add("fade");

    currentView = page;

    if (views.includes(page)) enableSwipe();
}

// botón de volver
function addBackButton(container) {
    const btn = document.createElement("button");
    btn.textContent = "← Volver";
    btn.style.marginBottom = "15px";
    btn.onclick = () => {
        if (previousView) navigate(previousView);
    };
    container.prepend(btn);
}

// swipe tipo Snapchat
export function enableSwipe() {
    const app = document.getElementById("app");

    app.ontouchstart = null;
    app.ontouchend = null;

    app.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    app.addEventListener("touchend", (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX;

        if (Math.abs(diff) < 50) return;

        let index = views.indexOf(currentView);

        if (diff < -50 && index < views.length - 1) navigate(views[index + 1]);
        if (diff > 50 && index > 0) navigate(views[index - 1]);
    });
}

// iniciar app
navigate("login");
