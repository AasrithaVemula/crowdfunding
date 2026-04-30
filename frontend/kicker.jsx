import React from "react";
import { createRoot } from "react-dom/client";
import Root from "./components/root";
import configureStore from "./store/store";
import "./styles/index.css";
import "./styles/legacy.css";
import "./styles/admin.css";

document.addEventListener("DOMContentLoaded", () => {
  let store;
  if (window.currentUser) {
    const preloadedState = {
      session: { id: window.currentUser.id },
      entities: {
        users: { [window.currentUser.id]: window.currentUser }
      }
    };
    store = configureStore(preloadedState);
    delete window.currentUser;
  } else {
    store = configureStore();
  }

  const root = document.getElementById("root");
  createRoot(root).render(<Root store={store} />);
});
