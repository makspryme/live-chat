import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App/App";
import { BrowserRouter as Router } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  GoogleAuthProvider,
  connectAuthEmulator,
  getAuth,
} from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

const root = ReactDOM.createRoot(document.getElementById("root"));

const firebaseConfig = {
  apiKey: "AIzaSyBc7x37bofPQQncuLb_fzvymiYh7wYICzg",
  authDomain: "live-chat-208eb.firebaseapp.com",
  projectId: "live-chat-208eb",
  storageBucket: "live-chat-208eb.appspot.com",
  messagingSenderId: "981328564783",
  appId: "1:981328564783:web:16fccd915d1f6fe0626cda",
  measurementId: "G-0EY9RJNQZH",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

if (window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://localhost:9099");
}
// const analytics = getAnalytics(app);

export const AuthContext = createContext();
const isLogged = false;

root.render(
  <React.StrictMode>
    <AuthContext.Provider value={{ auth, provider }}>
      <Router>
        <App />
      </Router>
    </AuthContext.Provider>
  </React.StrictMode>
);
