import React from "react";

export const Table = ({ children, className = "", ...props }) => {
  return (
    <table
      className={`min-w-full divide-y divide-gray-200 ${className}`}
      {...props}
    >
      {children}
    </table>
  );
};

export const TableBody = ({ children, className = "", ...props }) => {
  return (
    <tbody
      className={`bg-white divide-y divide-gray-200 ${className}`}
      {...props}
    >
      {children}
    </tbody>
  );
};

export const TableCell = ({ children, className = "", ...props }) => {
  return (
    <td className={`px-6 py-4 whitespace-nowrap ${className}`} {...props}>
      {children}
    </td>
  );
};

export const TableHead = ({ children, className = "", ...props }) => {
  return (
    <thead className={`bg-gray-50 ${className}`} {...props}>
      {children}
    </thead>
  );
};

export const TableHeader = ({ children, className = "", ...props }) => {
  return (
    <th
      scope="col"
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
      {...props}
    >
      {children}
    </th>
  );
};

export const TableRow = ({ children, className = "", ...props }) => {
  return (
    <tr className={`hover:bg-gray-100 ${className}`} {...props}>
      {children}
    </tr>
  );
};
