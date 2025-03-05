import React from "react";
import { AuthProvider } from "./utils/context/AuthContext";
import { RouteProvider } from "./utils/context/RouteContext";
import { ToastProvider } from "./utils/context/ToastContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AppLayout from './pages/Dashboard';
import NewCategoryForm from "./components/NewCategoryForm";
import NewProductForm from "./components/NewProductForm";
import ProductTable from "./components/ProductsTable";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <ToastProvider>
      <RouteProvider>
        <Router>
          <AuthProvider>
          <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="all-products" element={<ProductTable />} />
                <Route path="new-category" element={<NewCategoryForm />} />
                <Route path="new-product" element={<NewProductForm />} />
              </Route>
            </Routes>
          </AuthProvider>
        </Router>
      </RouteProvider>

    </ToastProvider>

  );
};

export default App;
