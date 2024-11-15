import React, { useContext } from "react";
import Auth from "./pages/Auth";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";
import PlayerContextProvider from "./context/PlayerContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <div className="h-screen w-screen ">
      <ToastContainer />
      <Routes>
        <Route
          path="/auth"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Auth />}
        />

        <Route
          path="/dashboard/*"
          element={<ProtectedRoute children={<Dashboard />} />}
        />
        <Route
          path="/playlist"
          element={<ProtectedRoute children={<p> hello </p>} />}
        ></Route>
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </div>
  );
};

export default App;
