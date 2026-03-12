import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  LogOut,
  MoreHorizontal,
  X,
  LibraryBig,
  SquareLibrary,
  Settings2,
  User,
  BookPlus,
} from "lucide-react";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";

// Sidebar Props
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Get the user
  const { data: user = [] } = useQuery({
    queryKey: ["user", "get-session"],
    queryFn: async () => {
      return await fetch("/api/auth/get-session", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          return data.user;
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          return []; // if there is an error , return the nothing to avoid breaking the UI
        });
    },
  });


  // navigater
  const navigate = useNavigate();

  // get the userData
  const storedData = localStorage.getItem("UserData");
  const userData = JSON.parse(storedData || "null");

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Section Data - if Adnim then show admin nav else show user nav
  const adminNavSection = [
    {
      title: "Home",
      links: [
        { to: "/", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
      ],
    },
    {
      title: "Books",
      links: [
        {
          to: "books",
          label: "Books",
          icon: <LibraryBig size={16} />,
        },
        {
          to: "assignbook",
          label: "Assign Books",
          icon: <BookPlus size={16} />,
        },
      ],
    },
    {
      title: "Users",
      links: [
        {
          to: "users",
          label: "Users",
          icon: <Users size={16} />,
        },
      ],
    },
  ];

  // user nav section
  const userNavSections = [
    {
      title: "Home",
      links: [
        { to: "/", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
      ],
    },
    {
      title: "MY Books",
      links: [
        {
          to: "my-books",
          label: "MyBooks",
          icon: <SquareLibrary size={16} />,
        },
      ],
    },
  ];

  //Handle mutuation for logout
  const logOutMutation = useMutation({
    mutationFn: async () => {
      const url = "/api/auth/sign-out";
      const token = localStorage.getItem("token");

      // make the API call to delete the user
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({}), // No body needed for logout, but you can send an empty object
      });

      return response.json();
    },

    onSuccess: (data) => {
      console.log(data);
      localStorage.removeItem("token");
      localStorage.removeItem("UserData");
      toast.success("Logged out successfully!", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      navigate("/login");
    },
  });

  // Logout function
  const handleLogOut = () => {
    logOutMutation.mutate();
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 w-60 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <aside className="w-full h-screen bg-[#0f0f0f] text-white flex flex-col justify-between border-r border-white/10 relative">
        {/* Logo */}
        <div>
          <div className="p-3 text-lg font-semibold flex items-center justify-between border-b border-white/10">
            <span className="flex items-center gap-1.5">Book Management</span>
            <button
              className="lg:hidden text-gray-400 hover:text-white transition-colors p-1"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation  depend on the role for the security */}
          <nav className="mt-3 px-2 space-y-5">
            {userData.role === "admin"
              ? adminNavSection.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-[11px] uppercase text-gray-400 font-semibold mb-1.5 px-2 tracking-wider">
                      {section.title}
                    </h3>
                    <div className="flex flex-col gap-0.5">
                      {section.links.map((link) => (
                        <NavLink
                          key={link.to}
                          to={link.to}
                          onClick={() => setIsOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] transition-all duration-200 ${
                              isActive
                                ? "bg-[#8c52ef]/20 text-[#8c52ef]-400"
                                : "text-gray-300 hover:bg-[#8c52ef]-500/10 hover:text-[#8c52ef]-400"
                            }`
                          }
                        >
                          {link.icon}
                          <span className="font-medium">{link.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ))
              : userNavSections.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-[11px] uppercase text-gray-400 font-semibold mb-1.5 px-2 tracking-wider">
                      {section.title}
                    </h3>
                    <div className="flex flex-col gap-0.5">
                      {section.links.map((link) => (
                        <NavLink
                          key={link.to}
                          to={link.to}
                          onClick={() => setIsOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] transition-all duration-200 ${
                              isActive
                                ? "bg-[#8c52ef]/20 text-[#8c52ef]-400"
                                : "text-gray-300 hover:bg-[#8c52ef]-500/10 hover:text-[#8c52ef]-400"
                            }`
                          }
                        >
                          {link.icon}
                          <span className="font-medium">{link.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 p-2.5 space-y-1.5 relative">
          {/* Profile Section with Dropdown */}
          <div
            className="flex items-center justify-between mt-3 bg-white/5 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/10 transition"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <div className="flex items-center gap-2">
              <img
                src={
                  user?.image ||
                  "https://cdn-icons-png.flaticon.com/512/219/219970.png"
                }
                alt="avatar"
                className="w-7 h-7 rounded-full border border-[#8c52ef]/40 object-cover"
              />
              <div>
                <p className="text-[13px] font-semibold">{user?.name}</p>
                <p className="text-[11px] text-gray-400">{user?.email}</p>
              </div>
            </div>
            <MoreHorizontal size={18} />
          </div>

          {/* Dropdown Menu */}
          {openMenu && (
            <div
              ref={menuRef}
              className="absolute left-2 bottom-16 w-56 bg-[#181818] text-gray-200 rounded-xl shadow-lg border border-white/10 p-3 space-y-3 animate-fadeIn mb-2"
            >
              {/* Menu Links */}
              {userData.role === "user" ? (
                <div>
                  <NavLink
                    to="/profile"
                    onClick={() => {
                      setOpenMenu(false);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-2 text-gray-300 hover:bg-gray-700/10 rounded-md hover:text-gray-200 transition-colors"
                  >
                    <User size={16} /> Profile
                  </NavLink>
                  <NavLink
                    to="/change-password"
                    onClick={() => {
                      setOpenMenu(false);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-2 text-gray-300 hover:bg-gray-700/10 rounded-md hover:text-gray-200 transition-colors"
                  >
                    <Settings2 size={16} /> Change Password
                  </NavLink>
                  <div className="space-y-1 text-[13px]" onClick={handleLogOut}>
                    <button className="w-full flex items-center gap-2 px-2 py-2 text-red-400 hover:bg-red-500/10 rounded-md hover:cursor-pointer transition-colors">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 text-[13px]" onClick={handleLogOut}>
                  <button className="w-full flex items-center gap-2 px-2 py-2 text-red-400 hover:bg-red-500/10 rounded-md hover:cursor-pointer transition-colors">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
