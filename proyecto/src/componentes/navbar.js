import { navigate } from "../main.js";

export function navbar() {
  return `
    <div class="navbar">
      <button id="btnSnaps">📷 Snaps</button>
      <button id="btnCamera">🎥 Cámara</button>
      <button id="btnChat">💬 Chat</button>
    </div>
  `;
}

export function activateNavbarEvents() {
  document.getElementById("btnSnaps").addEventListener("click", () => navigate("snaps"));
  document.getElementById("btnCamera").addEventListener("click", () => navigate("home"));
  document.getElementById("btnChat").addEventListener("click", () => navigate("messages"));
}
