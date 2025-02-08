import React from "react";
import { Link } from "react-router-dom";

const RegisterSuccess = ({ role, onClose }) => {
  const getMessage = () => {
    switch (role) {
      case "customer":
        return "Your account has been created successfully. You can now login.";
      case "employee":
        return "Your profile has been generated. Once the owner of the store permits you, you will receive your login and password.";
      case "admin":
        return "Your profile will be observed and you will receive an email with your ID and password.";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Registration Successful</h2>
        <p className="text-gray-700 mb-6">{getMessage()}</p>
        <Link to="/login">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RegisterSuccess;
