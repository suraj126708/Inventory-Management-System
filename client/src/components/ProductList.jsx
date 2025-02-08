import React, { useRef } from "react";
import { Pencil, Trash2, Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

function ProductList({ products, formatDate, handleEdit, handleDelete }) {
  const qrRefs = useRef({});

  const generateQRCodeImage = (product_id) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const size = 500;

    canvas.width = size + 40;
    canvas.height = size + 40;

    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const qrCanvas = qrRefs.current[product_id]?.querySelector("canvas");
    if (qrCanvas) {
      const img = new Image();
      img.src = qrCanvas.toDataURL();
      img.onload = () => {
        context.drawImage(img, 20, 20, size, size);
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `QR-${product_id}.png`;
        link.click();
      };
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Inventory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Image
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Quantity
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stock
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Price
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Selling Price
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Company
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                  QR Code
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Expiry Date
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-4 text-center text-gray-500">
                    No Products Added yet
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.product_id}>
                    <td className="p-3">
                      <img
                        src={
                          typeof product.image === "string"
                            ? `http://localhost:8000/ProductImages/${product.image
                                .split("\\")
                                .pop()}`
                            : null
                        }
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </td>
                    <td className="p-3 font-medium">{product.name}</td>
                    <td className="p-3">{product.quantity}</td>
                    <td className="p-3">{product.availableStock}</td>
                    <td className="p-3">${product.totalPrice}</td>
                    <td className="p-3">${product.sellingPrice}</td>
                    <td className="p-3">{product.company}</td>
                    <td className="p-3">
                      <div
                        className=""
                        ref={(el) => (qrRefs.current[product.product_id] = el)}
                      >
                        <QRCodeCanvas value={product.product_id} size={50} />
                      </div>
                    </td>
                    <td className="p-3">{formatDate(product.expiryDate)}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.product_id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            generateQRCodeImage(product.product_id)
                          }
                          className="p-1 text-green-600 hover:text-green-800"
                          title="Download QR"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
