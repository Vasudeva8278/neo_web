import React, { useContext } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import PasswordEmailResetSuccess from "./components/Auth/PasswordResetEmailSucces";
import VerifyEmail from "./components/Auth/VerifyEmail";
import NotAuthorized from "./components/NotAuthorized";
import Organizations from "./components/Organizations";
import Home from "./components/Home";
import PrivateRoute from "./components/PrivateRoute";
import GoogleAuthCallback from './components/Auth/GoogleAuthCallback';
import LandingPage from "./pages/LandingPage";
import Layout from "./components/Layout/Layout";

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route
            path="/dashboard"
            element={
              <PublicRoute>
                <Layout>
                  <LandingPage />
                </Layout>
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/verifyEmail"
            element={
              <PublicRoute>
                <VerifyEmail />
              </PublicRoute>
            }
          />
          <Route
            path="/resetPassword"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/forgotPassword"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/resetEmailSuccess"
            element={
              <PublicRoute>
                <PasswordEmailResetSuccess />
              </PublicRoute>
            }
          />
          <Route
            path="/organizations"
            element={
              <PrivateRoute allowedRoles={["SuperAdmin"]}>
                <Layout>
                  <Organizations />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route path="/not-authorized" element={<NotAuthorized />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout>
                  <Home />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? <Navigate to="/projects" /> : children;
};

export default App;
