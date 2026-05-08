import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin     from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import ChitPlanDetail from "./components/ChitPlanDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import UserSignup     from "./components/UserSignup";
import UserLogin      from "./components/UserLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<Navigate to="/login" />} />
        <Route path="/login"         element={<AdminLogin />} />
        <Route path="/user-login"    element={<UserLogin />} />
        <Route path="/user-signup"   element={<UserSignup />} />
        <Route path="/dashboard"     element={
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/chit-plan/:id" element={
          <ProtectedRoute><ChitPlanDetail /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;