import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

export const firebaseConfig = {
  projectId: "studio-8882072521-b2179",
  appId: "1:88106110634:web:c8a26d3b9cd9df5fb34ad3",
  apiKey: "AIzaSyBeARrskwe_ZrxH1EoRBx_OZdRh7j0VnqI",
  authDomain: "studio-8882072521-b2179.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "88106110634"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
