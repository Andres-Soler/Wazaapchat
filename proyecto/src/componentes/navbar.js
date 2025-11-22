import { navigate } from "../main.js";

export function navbar() {
  return `
    <div class="navbar">
      <button id="btnCamera" class="nav-btn camera-btn">📷</button>
      <button id="btnHome" class="nav-btn home-btn">👻</button>
      <button id="btnChat" class="nav-btn chat-btn">💬</button>
    </div>
  `;
}

export function activateNavbarEvents() {
  const buttons = {
    btnCamera: "home",
    btnHome: "snaps",
    btnChat: "messages",
  };

  Object.entries(buttons).forEach(([id, screen]) => {
    document.getElementById(id).addEventListener("click", () => {
      navigate(screen);

      // Quitar highlight del botón anterior
      document.querySelectorAll(".navbar button").forEach(btn => btn.classList.remove("active"));
      
      // Activar botón presionado
      document.getElementById(id).classList.add("active");
    });
  });
}
