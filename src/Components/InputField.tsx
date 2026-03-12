import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { FieldValues, UseFormRegister, Path } from "react-hook-form";

// Props For the Input field component
interface InputProps<T extends FieldValues> {
  type?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  register?: UseFormRegister<T>;
  errors?: any;
  defaultValue?: string;
  isDisabled?: boolean;
}

// Component with passign props
const InputField = <T extends FieldValues>({
  type,
  register,
  placeholder = "",
  label = "",
  name = "",
  required = false,
  className = "",
  errors,
  value = "",
  defaultValue = "",
  isDisabled,
  ...props
}: InputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password set the state
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="w-full flex flex-col gap-[6px]">
      {/* Label for the Input Field  */}
      {label && (
        <label htmlFor={name} className="text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors">
          {label}
        </label>
      )}

      {/* Main input Field   */}
      <div className="relative">
        <input
          id={name}
          type={inputType}
          {...(register ? register(name as Path<T>) : {})}
          required={required}
          placeholder={placeholder}
          defaultValue={value || defaultValue}
          disabled={isDisabled}
          className={`
            w-full
            bg-white dark:bg-[#111] 
            text-gray-900 dark:text-gray-200
            border
            border-gray-300 dark:border-gray-600
            rounded-2xl
            px-5
            py-3
            outline-none
            transition-all
            duration-300
            placeholder-gray-400 dark:placeholder-gray-500
            focus:border-[#8c52ef]/80
            focus:ring-4
            focus:ring-[#8c52ef]/20
            ${isDisabled ? "cursor-not-allowed opacity-50" : "hover:border-[#8c52ef]/80"}
            ${className}
          `}
          {...props}
        />

        {/* Password Toggle Icon */}
        {type === "password" && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute inset-y-0 right-4 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition hover:cursor-pointer"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {/* Error Message  */}
      <p
        className={`text-red-500 font-medium text-sm mt-1 ${errors ? "visible" : "opacity-0"}`}
      >
        {errors?.message || "no error"}
      </p>
    </div>
  );
};

export default InputField;
