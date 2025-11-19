import { navigate } from "../main.js";

export function showLogin() {
    document.getElementById("app").innerHTML = `
        <h2>Login</h2>
        <input placeholder="Username" id="loginUser">
        <button id="loginBtn">Enter</button>
        <p>No account? <span id="goRegister" style="cursor:pointer;">Register</span></p>
    `;

    document.getElementById("goRegister").addEventListener("click", () => navigate("register"));
    document.getElementById("loginBtn").addEventListener("click", () => {
        navigate("home");  // <--- ESTA LÍNEA ES LA QUE TE LLEVA A LA CÁMARA
    });
}
