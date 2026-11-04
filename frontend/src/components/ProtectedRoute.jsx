
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Wait until authentication is verified
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  // Redirect unauthenticated users
  if (!user) {
    // return <Navigate to="/login" replace />;
    return <Navigate to="/" replace />;
  }

  // Render protected child routes
  return <Outlet />;
};

export default ProtectedRoute;
