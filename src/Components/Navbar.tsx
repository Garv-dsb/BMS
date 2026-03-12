import { useQuery } from "@tanstack/react-query";
import { Menu, Moon, Sun } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;
  const { theme, toggleTheme } = useTheme();

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

  // Navigate to Back
  const navigateBack = () => {
    navigate(-1);
  };

  // SHow the Current TIme and wish the user based on the time of the day
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  // Function to check the time and display the time
  const wishUser = () => {
    const now = new Date();
    const hours = now.getHours();
    if (hours < 12) {
      return "Good Morning 🌞";
    }
    if (hours < 18) {
      return "Good Afternoon 🌤️";
    }
    return "Good Evening 🌙";
  };

  return (
    <header className="flex items-center justify-between px-6 py-[9px] bg-white dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-white/10 sticky top-0 z-30 transition-colors duration-200">
      <div className="flex gap-4 items-center">
        {/* Sidebar Toggle Button */}
        <button
          className="text-gray-600 dark:text-gray-300 hover:text-[#8c52ef] lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu size={22} />
        </button>

        {/* Back Button */}
        {currentPath !== "/" && (
          <button
            className="`flex items-center gap-2 bg-[#8c52ef]/30 transition-all duration-200 text-white px-6 py-[2px] rounded-md shadow-md hover:shadow-[#9c52ef]/20 w-[100%] hover:cursor-pointer"
            onClick={navigateBack}
          >
            Back
          </button>
        )}
      </div>

      {/* Page Title & Theme Toggle */}
      <div className="flex items-center gap-4">
        <h1 className="text-[12px] md:text-[20px] lg:text-[18.5px] font-semibold text-gray-900 dark:text-white tracking-wide">
          {wishUser()} {user?.name} , {getCurrentTime()}
        </h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
