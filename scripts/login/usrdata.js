import { firebaseConfig } from "../../api.js";

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const usrName = document.getElementById("usrName");
const usrEmail = document.getElementById("usrEmail");
const usrId = document.getElementById("usrId");

auth.onAuthStateChanged(async (user) => {
  if (!user) return;

  const email = user.email;
  const uid = user.uid;

  usrName.textContent = email.split("@")[0];
  usrEmail.textContent = email;

  try {
    const snapshot = await db
      .collection("users")
      .where("uid", "==", uid)
      .limit(1)
      .get();

    if (snapshot.empty) {
      usrId.textContent = "ID no encontrado";
      return;
    }

    const data = snapshot.docs[0].data();
    usrId.textContent = `ID: ${data.id}`;
  } catch (err) {
    console.error(err);
    usrId.textContent = "Error cargando ID";
  }
});
