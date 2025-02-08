import React from "react";
import { FormField } from "./FormField";
import { AlertCircle } from "lucide-react";

export const AdminFields = ({ formData, handleChange, errors, shopTypes }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField
      name="shopName"
      placeholder="Shop Name"
      value={formData.shopName}
      onChange={handleChange}
      error={errors.shopName}
    />
    <div className="md:col-span-2">
      <select
        name="shopType"
        value={formData.shopType}
        onChange={handleChange}
        className={`w-full p-2 rounded-lg border ${
          errors.shopType ? "border-red-500" : "border-gray-300"
        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
      >
        <option value="">Select Shop Type</option>
        {shopTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      {errors.shopType && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errors.shopType}
        </p>
      )}
    </div>
    <FormField
      name="shopAddress"
      placeholder="Shop Address"
      value={formData.shopAddress}
      onChange={handleChange}
      error={errors.shopAddress}
      className="md:col-span-2"
    />
    <FormField
      name="city"
      placeholder="City"
      value={formData.city}
      onChange={handleChange}
      error={errors.city}
    />
    <FormField
      name="state"
      placeholder="State"
      value={formData.state}
      onChange={handleChange}
      error={errors.state}
    />
    <FormField
      name="pincode"
      placeholder="Pincode"
      value={formData.pincode}
      onChange={handleChange}
      error={errors.pincode}
    />
    <div className="md:col-span-2">
      <label className="block font-semibold text-gray-600">Shop Photo</label>
      <input
        type="file"
        name="shopPhoto"
        onChange={handleChange}
        className={`w-full p-2 rounded-lg border ${
          errors.shopPhoto ? "border-red-500" : "border-gray-300"
        }`}
      />
      {errors.shopPhoto && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errors.shopPhoto}
        </p>
      )}
    </div>
  </div>
);
