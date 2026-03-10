import { Route, Routes } from "react-router-dom";
import Layout from "./Layout/Layout";
import Login from "./pages/Login";
import Users from "./pages/users/Users";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./routesWrapper/protectedRoute";
import PublicRoute from "./routesWrapper/publicRoute";
import Dashboard from "./pages/Dashboard";
import MyBooks from "./pages/books/MyBooks";
import UserUnauthorizedRoute from "./routesWrapper/userUnauthorized";
import LibrarianUnauthorized from "./routesWrapper/librarianUnauthorized";
import NotFound from "./pages/NotFound";
import ChangePassword from "./pages/users/ChangePassword";
import Books from "./pages/books/Books";
import View from "./pages/users/View";
import Profile from "./pages/users/Profile";
import Add from "./pages/users/Add";
import EditProfile from "./pages/users/EditProfile";
import Edit from "./pages/users/Edit";
import AssignBook from "./pages/books/AssignBook";

const App = () => {
  return (
    <div className="h-screen w-screen bg-black text-white overflow-x-hidden">
      <Routes>
        {/* if authenticated user tries to access login or register page, redirect to dashboard  else allow access to login and register page */}

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* only authenticated users can access the below routes  */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />

            {/* Only admin can access these routes  */}
            <Route element={<UserUnauthorizedRoute />}>
              <Route path="books" element={<Books />} />
              <Route path="assignbook" element={<AssignBook />} />
              <Route path="users" element={<Users />} />
              <Route path="user/:id" element={<View />} />
              <Route path="user/add" element={<Add />} />
              <Route path="user/edit/:id" element={<Edit />} />
            </Route>

            {/* Only user can access these routes   */}
            <Route element={<LibrarianUnauthorized />}>
              <Route path="my-books" element={<MyBooks />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profile/edit" element={<EditProfile />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
