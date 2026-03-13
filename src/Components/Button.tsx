// Button Props
interface ButtonProps {
  text: string;
  loading?: boolean;
  onClick?: () => void;
}

const Button = ({ text, loading, onClick }: ButtonProps) => {
  return (
    <button
      className={`flex items-center gap-2 bg-[#8c52ef]/60 dark:bg-[#8c52ef]/30 transition-all duration-200 text-white px-4 py-2 rounded-md shadow-md hover:shadow-[#9c52ef]/40 dark:hover:shadow-[#9c52ef]/20 w-[100%] hover:cursor-pointer  ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={loading}
      onClick={onClick}
    >
      <span className="text-sm font-medium text-center mx-auto">
        {loading ? "Please wait.." : text}{" "}
      </span>
    </button>
  );
};

export default Button;
