import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Authorisation/ProtectedRoute";
import LoginPage from "./Pages/LoginPage";
import AdminDashboard from "./Pages/AdminDashboard";
import EmployeeDashboard from "./Pages/EmployeeDashboard";
import Unauthorised from "./components/Unauthorised";
import Home from "./Pages/Home";
import RegisterPage from "./Pages/RegisterPage";
import POSSystem from "./Pages/POSsystem";
import AddingProducts from "./Pages/AddProductsTOShop";
import QRCodeGenerator from "./components/QrCodeGenerator";
import PageNotFound from "./components/PageNotFound";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute allowedRoles={["admin", "employee"]}>
              <POSSystem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AddProduct"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddingProducts />
            </ProtectedRoute>
          }
        />

        <Route path="/qr" element={<QRCodeGenerator productId={1212354} />} />

        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<Unauthorised />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/test" element={<QRCodeGenerator />} />

        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["admin", "employee", "customer"]}>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
