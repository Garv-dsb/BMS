import { Navigate, Outlet } from "react-router-dom";

const UserUnauthorizedRoute = () => {
  const data = localStorage.getItem("UserData");
  const userData = data ? JSON.parse(data) : null;

  if (userData.role === "admin") {
    return <Outlet />;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default UserUnauthorizedRoute;
