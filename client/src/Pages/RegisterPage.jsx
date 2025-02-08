// pages/RegisterPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { AlertCircle, Store, UserCircle, ShoppingBag } from "lucide-react";
import { RoleSelector } from "../components/forms/RoleSelector";
import { FormField } from "../components/forms/FormField";
import { AdminFields } from "../components/forms/AdminFields";
import { EmployeeFields } from "../components/forms/EmployeeFields";
import RegisterSuccess from "../components/RegisterSuccess";
import { handleError } from "../utils";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
    phoneNumber: "",
    shopName: "",
    shopType: "",
    shopAddress: "",
    city: "",
    state: "",
    pincode: "",
    shopPhoto: null,
    workShift: "",
    joinedAt: "",
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const roles = [
    { id: "admin", label: "Shop Owner", icon: Store },
    { id: "employee", label: "Employee", icon: UserCircle },
    { id: "customer", label: "Customer", icon: ShoppingBag },
  ];

  const shopTypes = ["Grocery", "Clothing", "Electronics", "Other"];
  const workShifts = ["Morning", "Afternoon", "Night"];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    if (name === "fullName" && !value.trim()) error = "Full name is required";
    if (name === "email") {
      if (!value.trim()) {
        error = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = "Invalid email format";
      }
    }
    if (name === "password") {
      if (!value) {
        error = "Password is required";
      } else if (value.length < 6) {
        error = "Password must be at least 6 characters";
      }
    }
    if (name === "confirmPassword" && value !== formData.password) {
      error = "Passwords do not match";
    }
    if (name === "phoneNumber" && !value.trim()) {
      error = "Phone number is required";
    }
    if (formData.role === "admin") {
      if (name === "shopName" && !value.trim()) error = "Shop name is required";
      if (name === "shopType" && !value.trim()) error = "Shop type is required";
      if (name === "shopAddress" && !value.trim())
        error = "Shop address is required";
      if (name === "city" && !value.trim()) error = "City is required";
      if (name === "state" && !value.trim()) error = "State is required";
      if (name === "pincode" && !value.trim()) error = "Pincode is required";
      if (name === "shopPhoto" && !value) error = "Shop photo is required";
    }
    if (formData.role === "employee") {
      if (name === "workShift" && !value.trim())
        error = "Work shift is required";
      if (name === "joinedAt" && !value.trim())
        error = "Joined date is required";
    }
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    if (formData.role === "admin") {
      if (!formData.shopName.trim())
        newErrors.shopName = "Shop name is required";
      if (!formData.shopType.trim())
        newErrors.shopType = "Shop type is required";
      if (!formData.shopAddress.trim())
        newErrors.shopAddress = "Shop address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.state.trim()) newErrors.state = "State is required";
      if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
      if (!formData.shopPhoto) newErrors.shopPhoto = "Shop photo is required";
    }
    if (formData.role === "employee") {
      if (!formData.workShift.trim())
        newErrors.workShift = "Work shift is required";
      if (!formData.joinedAt.trim())
        newErrors.joinedAt = "Joined date is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      try {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
          formDataToSend.append(key, formData[key]);
        });

        console.log("Form data to send:", formDataToSend);

        const response = await axios.post(
          "http://localhost:8000/api/auth/register",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Form submitted:", response.data);
        setShowSuccess(true);
      } catch (error) {
        handleError("Error submitting form:", error);
      }
    } else {
      handleError(newErrors);
      console.log("Form has errors:", newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            encType="multipart/form-data"
          >
            <RoleSelector
              selectedRole={formData.role}
              onRoleChange={(role) =>
                handleChange({ target: { name: "role", value: role } })
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                className="md:col-span-2"
              />

              <FormField
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                className="md:col-span-2"
              />

              <FormField
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />

              <FormField
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />

              <FormField
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={errors.phoneNumber}
                className="md:col-span-2"
              />
            </div>

            {formData.role === "admin" && (
              <AdminFields
                formData={formData}
                handleChange={handleChange}
                errors={errors}
                shopTypes={shopTypes}
              />
            )}

            {formData.role === "employee" && (
              <EmployeeFields
                formData={formData}
                handleChange={handleChange}
                errors={errors}
                workShifts={workShifts}
              />
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-2">
            Already have an Acount?{" "}
            <a href="/login" className="text-blue-900 underline">
              Login
            </a>
          </p>
        </CardContent>
      </Card>
      {showSuccess && (
        <RegisterSuccess
          role={formData.role}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
};

export default RegisterPage;
