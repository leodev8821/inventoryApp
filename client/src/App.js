import React from "react";
import { AuthProvider } from "./utils/context/AuthContext";
import { RouteProvider } from "./utils/context/RouteContext";
import { ToastProvider } from "./utils/context/ToastContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayoutBasic from "./pages/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <ToastProvider>
      <RouteProvider>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<DashboardLayoutBasic />} />
              {/* 
            <Route path="/lopd" element={<Lopd />} />
            <Route path="/recuperar-contrasena" element={<PassRecoveryForm />} />
                <Route path="/confirma-contrasena/:token" element={<PassConfirmation />} />
                <Route path="/informaciones" element={<SideMenu />} />
                <Route path="/denegado" element={<Denied />} />
                <Route path="/error" element={<ErrorPage />} />
                <Route path="error/:errorCode" element={<ErrorPage />} />
                <Route path='/contacto' element={<Contact />} />
                <Route path="/matricula" element={<UserProfile />} />
                <Route path="/mostrar-documentos" element={<ShowDocs />} />
                <Route path="/info-alumno" element={<StudentsInfo />} />
                <Route path="/nomina" element={<NomineTable />} />
                <Route path="/documento" element={<DocumentTable />} /> */}
            </Routes>
          </AuthProvider>
        </Router>
      </RouteProvider>

    </ToastProvider>

  );
};

export default App;