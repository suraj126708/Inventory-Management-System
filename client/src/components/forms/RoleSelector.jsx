// components/forms/RoleSelector.jsx
import { Store, UserCircle, ShoppingBag } from "lucide-react";

export const RoleSelector = ({ selectedRole, onRoleChange }) => {
  const roles = [
    { id: "admin", label: "Shop Owner", icon: Store },
    { id: "employee", label: "Employee", icon: UserCircle },
    { id: "customer", label: "Customer", icon: ShoppingBag },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      {roles.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onRoleChange(id)}
          className={`p-4 rounded-lg border-2 transition-all flex sm:flex-col items-center justify-center gap-2 ${
            selectedRole === id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <Icon className="w-6 h-6" />
          <p className="text-sm">{label}</p>
        </button>
      ))}
    </div>
  );
};
