import React from "react";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img
        src="https://img.freepik.com/free-vector/error-404-concept-illustration_114360-1811.jpg?uid=R119380689&ga=GA1.1.940851799.1723744626&semt=ais_hybrid"
        alt="404"
        className="w-96"
      />
      <p className="text-lg mb-4 mt-8">Page Not Found</p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Go to Home
      </Link>
    </div>
  );
}

export default PageNotFound;
