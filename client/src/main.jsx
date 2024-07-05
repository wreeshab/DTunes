import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./context/AuthContext.jsx";
import PlayerContextProvider from "./context/PlayerContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthContextProvider>
      <PlayerContextProvider>
        <App />
      </PlayerContextProvider>
    </AuthContextProvider>
    {/* <AuthProvider Children={<App />} / > */}
  </BrowserRouter>
);
