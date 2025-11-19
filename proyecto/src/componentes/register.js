import { navigate } from "../main.js";

export function showRegister() {
    document.getElementById("app").innerHTML = `
        <h2>Create account</h2>
        <input placeholder="Username" id="regUser">
        <input placeholder="Password" id="regPass" type="password">
        <button id="registerBtn">Sign up</button>
        <p>Already have an account? <span id="goLogin" style="cursor:pointer;">Login</span></p>
    `;

    document.getElementById("goLogin").addEventListener("click", () => navigate("login"));
    document.getElementById("registerBtn").addEventListener("click", () => {
        const user = document.getElementById("regUser").value;
        localStorage.setItem("user", user);
        navigate("home");
    });
}
