import { firebaseConfig } from "../../api.js";

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMsg = document.getElementById("errorMsg");

// LOGIN
loginBtn.addEventListener("click", () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      errorMsg.textContent = "";
      window.location.href = "../../panel.html";
    })
    .catch((error) => {
      errorMsg.textContent = error.message;
    });
});

// REGISTRO
registerBtn.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(
      email,
      password,
    );

    const uid = userCredential.user.uid;

    // Transacción para ID incremental
    await db.runTransaction(async (transaction) => {
      const counterRef = db.collection("counters").doc("users");
      const counterDoc = await transaction.get(counterRef);

      let newId = 1;

      if (counterDoc.exists) {
        newId = counterDoc.data().count + 1;
      }

      // Actualiza contador
      transaction.set(counterRef, { count: newId });

      // Crea usuario con ID incremental
      transaction.set(db.collection("users").doc(String(newId)), {
        id: newId,
        uid: uid,
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    });

    errorMsg.textContent =
      "Usuario registrado con éxito. Ahora puedes iniciar sesión.";
  } catch (error) {
    errorMsg.textContent = error.message;
  }
});
