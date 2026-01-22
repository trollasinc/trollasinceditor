import { firebaseConfig } from "../../api.js";

// Inicializar Firebase (seguro)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

const createWebBtn = document.getElementById("createWebBtn");
const websContainer = document.getElementById("websContainer");

// HTML base de una web nueva
const EMPTY_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Nueva web</title>
</head>
<body>
  <h1>Hola mundo</h1>
  <p>Edita tu web</p>
</body>
</html>`;

// Esperar sesión
auth.onAuthStateChanged((user) => {
  if (user) loadUserWebs(user.uid);
});

// Crear nueva web (con nombre)
createWebBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const name = prompt("Nombre de la web:");
  if (!name) return;

  try {
    await db.collection("webs").add({
      ownerUid: user.uid,
      name: name,
      html: EMPTY_HTML,
      status: "draft",
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    loadUserWebs(user.uid);
  } catch (err) {
    console.error("Error creando web:", err);
  }
});

// Cargar webs del usuario
async function loadUserWebs(uid) {
  websContainer.innerHTML = "<p>Cargando webs...</p>";

  try {
    const snapshot = await db
      .collection("webs")
      .where("ownerUid", "==", uid)
      .get();

    if (snapshot.empty) {
      websContainer.innerHTML = "<p>No has creado ninguna web aún.</p>";
      return;
    }

    websContainer.innerHTML = "";

    snapshot.forEach((doc) => {
      const web = doc.data();

      const card = document.createElement("div");
      card.className = "web-card";

      card.innerHTML = `
        <h3 class="web-title">${web.name}</h3>
        <p class="web-status">Estado: ${web.status}</p>
        <iframe
          class="web-preview"
          sandbox
          srcdoc="${web.html.replace(/"/g, "&quot;")}"
        ></iframe>
      `;

      websContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Error cargando webs:", err);
    websContainer.innerHTML = "<p>Error cargando webs.</p>";
  }
}
