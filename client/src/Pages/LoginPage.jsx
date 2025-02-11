/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { handleSuccess, handleError } from "../utils";
import { Navigate, useNavigate } from "react-router-dom";
import AuthContext from "../Authorisation/AuthProvider";
import axiosInstance from "../Authorisation/axiosConfig";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setErrors] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [role, setRole] = useState("customer"); // Default role

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    try {
      const url = "https://inventory-management-system-d859.onrender.com/api/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.message || "Login failed";
        setErrors(errorMessage);
        console.log(errorMessage);
        return;
      }

      const { token, user } = result;

      if (user) {
        const { name, role, shopDetails } = user;
        console.log(name, role, shopDetails);
        const { shopPhoto, shopName } = shopDetails;
        handleSuccess("Login successful!");

        login(token, name, role, shopPhoto, shopName);
        navigate("/");

        setLoginSuccess(true);
      } else {
        throw new Error("User data not found in response.");
      }
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred.";
      setErrors(errorMessage);
      handleError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-gray-100 p-16 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 p-2 border bg-transparent font-semibold border-black rounded-lg focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent w-full p-2 mt-2 border font-semibold border-black rounded-lg focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Select Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-transparent w-full p-2 mt-2 border font-semibold border-black rounded-lg focus:outline-none focus:border-indigo-500"
              >
                <option value="customer">Customer</option>
                <option value="trainer">Trainer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className={`w-full py-2 bg-green-500 rounded-lg hover:bg-green-700 transition duration-300 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-2">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-900 underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
