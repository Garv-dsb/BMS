import { Navigate, Outlet } from "react-router-dom";

const LibrarianUnauthorized = () => {
  const data = localStorage.getItem("UserData");
  const userData = data ? JSON.parse(data) : null;

  if (userData.role === "user") {
    return <Outlet />;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default LibrarianUnauthorized;
