// components/forms/FormField.jsx
import { AlertCircle } from "lucide-react";

export const FormField = ({
  type = "text",
  name,
  label,
  value,
  onChange,
  error,
  placeholder,
  className = "",
}) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full p-2 rounded-lg border ${
        error ? "border-red-500" : "border-gray-300"
      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
    />
    {error && (
      <p className="text-red-500 text-sm mt-1 flex items-center">
        <AlertCircle className="w-4 h-4 mr-1" />
        {error}
      </p>
    )}
  </div>
);
