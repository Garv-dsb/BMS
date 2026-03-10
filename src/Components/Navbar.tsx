import { useQuery } from "@tanstack/react-query";
import { Menu } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;

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
    <header className="flex items-center justify-between  px-6 py-3 bg-[#0f0f0f] border-b border-white/10 sticky top-0 z-30">
      <div className="flex gap-4 items-center">
        {/* Sidebar Toggle Button */}
        <button
          className="text-gray-300 hover:text-[#8c52ef] lg:hidden"
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

      {/* Page Title */}
      <h1 className=" text-[9px] md:text-[20px] lg:text-[18.5px] font-semibold text-white tracking-wide">
        <p>
          {wishUser()} {user?.name} , {getCurrentTime()}
        </p>
      </h1>
    </header>
  );
}
