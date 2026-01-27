import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import UnBoardingLayout from "./layouts/UnboardingLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashBoardLayout";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<UnBoardingLayout />}>
            <Route index element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>
          <Route element={<DashboardLayout />}>
            <Route
              path="/dashboard"
              element={
                // <ProtectedRoute>
                <Dashboard />
                // </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
