import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const storedToken: string | null = token;

  if (!storedToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
