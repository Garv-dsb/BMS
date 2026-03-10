import { Menu } from "lucide-react";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  // get the Stored userData
  const storedData = localStorage.getItem("UserData");
  const userData = JSON.parse(storedData || "null");

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
    <header className="flex items-center justify-between px-6 py-3 bg-[#0f0f0f] border-b border-white/10 sticky top-0 z-30">
      {/* Sidebar Toggle Button */}
      <button
        className="text-gray-300 hover:text-[#8c52ef] lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu size={22} />
      </button>

      {/* Page Title */}
      <h1 className="text-[10px] md:text-[20px] lg:text-[18.5px] font-semibold text-white tracking-wide">
        {getCurrentTime()} - {wishUser()}, {userData?.name}
      </h1>
    </header>
  );
}
