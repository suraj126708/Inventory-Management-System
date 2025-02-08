import React from "react";
import { FormField } from "./FormField";
import { AlertCircle } from "lucide-react";

export const EmployeeFields = ({
  formData,
  handleChange,
  errors,
  workShifts,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="md:col-span-2">
      <select
        name="workShift"
        value={formData.workShift}
        onChange={handleChange}
        className={`w-full p-2 rounded-lg border ${
          errors.workShift ? "border-red-500" : "border-gray-300"
        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
      >
        <option value="">Select Work Shift</option>
        {workShifts.map((shift) => (
          <option key={shift} value={shift}>
            {shift}
          </option>
        ))}
      </select>
      {errors.workShift && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errors.workShift}
        </p>
      )}
    </div>
    <FormField
      type="date"
      name="joinedAt"
      placeholder="Joined Date"
      value={formData.joinedAt}
      onChange={handleChange}
      error={errors.joinedAt}
    />
  </div>
);
