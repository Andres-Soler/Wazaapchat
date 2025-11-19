import { navigate } from "../main.js";
import { saveSnap } from "../data/storage.js";
import { navbar, activateNavbarEvents } from "./navbar.js";

export function showHome() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="camera-screen">

      <div class="top-bar">
        <span>👤</span>
        <span>⚙️</span>
      </div>

      <video id="camera" autoplay playsinline></video>

      <button id="btnCapture" class="capture-btn"></button>

      <canvas id="snapshot" style="display:none;"></canvas>
    </div>

    ${navbar()}
  `;

  activateNavbarEvents();

  const video = document.getElementById("camera");
  const canvas = document.getElementById("snapshot");
  const btnCapture = document.getElementById("btnCapture");

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream)
    .catch(err => alert("No pudimos acceder a la cámara 😭"));

  btnCapture.addEventListener("click", () => {
    
    if (!video.videoWidth) {
      alert("⏳ Cargando cámara...");
      return;
    }

    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const foto = canvas.toDataURL("image/png");

    saveSnap(foto);

    // flash efecto
    document.body.style.background = "white";
    setTimeout(() => document.body.style.background = "#FFFC00", 120);

    // cambiar luego a snaps
    setTimeout(() => navigate("snaps"), 300);
  });
}
