import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";

import "./index.css";
import App from "./App";


// ==================== JWT TOKEN SETUP ====================

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// ==================== REACT APP ====================

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => console.log("Remember Me service worker registered"))
      .catch((error) =>
        console.error("Service worker registration failed:", error)
      );
  });
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);