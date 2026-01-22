import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { firebaseConfig } from "../../api.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("Sesión cerrada");
      window.location.href = "/login.html";
    })
    .catch((error) => {
      console.error("Error al cerrar sesión:", error);
    });
});
