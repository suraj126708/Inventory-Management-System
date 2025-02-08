import React, { useState, useEffect } from "react";
import { Plus, Camera, Pencil, Trash2, X } from "lucide-react";
import { handleError } from "../utils";
import ProductList from "../components/ProductList";

const AddingProducts = () => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const initialFormState = {
    name: "",
    quantity: "",
    totalPrice: "",
    sellingPrice: "",
    company: "",
    expiryDate: "",
    image: null,
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch("http://localhost:8000/api/products", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const generateProductId = () => {
    return `PRD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const currentDate = new Date();
    const expiryDate = new Date(formData.expiryDate);

    if (expiryDate <= currentDate) {
      setErrorMessage("Expiry date must be greater than the current date.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("product_id", generateProductId());
    formDataToSend.append("name", formData.name);
    formDataToSend.append("quantity", formData.quantity);
    formDataToSend.append("totalPrice", formData.totalPrice);
    formDataToSend.append("sellingPrice", formData.sellingPrice);
    formDataToSend.append("company", formData.company);
    formDataToSend.append("expiryDate", formData.expiryDate);
    if (formData.image) {
      formDataToSend.append("productImg", formData.image);
    }

    const requestOptions = {
      method: isEditing ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formDataToSend,
    };

    const url = isEditing
      ? `http://localhost:8000/api/products/${editingId}`
      : "http://localhost:8000/api/products/";

    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (isEditing) {
          setProducts(
            products.map((product) =>
              product.product_id === editingId
                ? { ...formData, product_id: editingId }
                : product
            )
          );
        } else {
          setProducts([data, ...products]);
        }
        resetForm();
      })
      .catch((error) => {
        console.error("Error submitting product:", error);
        handleError("Failed to submit product. Please try again.");
      });
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      quantity: product.quantity,
      totalPrice: product.totalPrice,
      sellingPrice: product.sellingPrice,
      company: product.company,
      expiryDate: product.expiryDate,
      image: null,
    });
    setEditingId(product.product_id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch(`http://localhost:8000/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then(() => {
          setProducts(
            products.filter((product) => product.product_id !== productId)
          );
        })
        .catch((error) => console.error("Error deleting product:", error));
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setShowForm(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const fetchBills = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/bills/get-bills",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      console.log("Fetched Bills:", data);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Shop Header */}
      <div className="text-center mb-8 bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {localStorage.getItem("shopname")}
        </h1>
        <p className="text-gray-600 mt-2">
          The Shop by {localStorage.getItem("name")}
        </p>
      </div>

      {/* Add/Edit Product Button */}
      <div className="mb-6">
        <button
          onClick={() => {
            if (!showForm) {
              setShowForm(true);
            } else {
              resetForm();
            }
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          {showForm ? (
            <>
              <X size={20} />
              Cancel
            </>
          ) : (
            <>
              <Plus size={20} />
              Add New Product
            </>
          )}
        </button>
      </div>

      {/* Add/Edit Product Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h2>
          {errorMessage && (
            <div className="mb-4 text-red-600">{errorMessage}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form fields remain the same */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Price ($)
                </label>
                <input
                  type="number"
                  name="totalPrice"
                  value={formData.totalPrice}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price per Item ($)
                </label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                <div
                  className="flex items-center gap-4 p-4 border-2 border-dashed rounded-lg bg-gray-50"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <input
                    type="file"
                    accept="image/*"
                    name="productImg"
                    onChange={handleImageChange}
                    className="hidden"
                    id="product-image"
                  />
                  <label
                    htmlFor="product-image"
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <Camera className="text-gray-400" size={32} />
                    <span className="text-sm text-gray-500">
                      Drag & drop or click to upload
                    </span>
                  </label>
                  {formData.image && (
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Product"
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {isEditing ? "Update Product" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <ProductList
        products={products}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        formatDate={formatDate}
      />
    </div>
  );
};

export default AddingProducts;
