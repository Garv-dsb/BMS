import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = localStorage.getItem("token");
  const data: string | null = token;

  if (data) {
    // Redirect to login if not authenticated
    return <Navigate to="/" replace />;
  } else {
    return <Outlet />;
  }
};

export default PublicRoute;
