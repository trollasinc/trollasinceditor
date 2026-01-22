import { firebaseConfig } from "../../api.js";
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});
