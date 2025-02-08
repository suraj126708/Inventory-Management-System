import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorised = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        403 - Unauthorized Access
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        You do not have permission to view this page.
      </p>
      <button
        className="px-4 py-2 bg-blue-600 text-white text-lg font-semibold rounded-md shadow-md hover:bg-blue-700 transition"
        onClick={handleGoBack}
      >
        Go to Home
      </button>
    </div>
  );
};

export default Unauthorised;
