import React, { useState, useEffect } from "react";
import { Plus, ChevronLeft, ChevronRight, QrCode, X } from "lucide-react";
import BillingStatistical from "../components/BillingStatistical";
import { handleError, handleSuccess } from "../utils";
import { Html5QrcodeScanner } from "html5-qrcode";

const POSSystem = () => {
  const [sales, setSales] = useState({
    cash: 0,
    online: 0,
    udari: 0,
  });

  const [products, setProducts] = useState([]);
  const [currentBill, setCurrentBill] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paymentMode, setPaymentMode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentBillPage, setCurrentBillPage] = useState(1);
  const [fetchedBills, setFetchedBills] = useState([]);
  const [billPage, setBillPage] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const productsPerPage = 6;
  const billItemsPerPage = 5;
  const billsPerPage = 7;

  const onScanSuccess = async (decodedText) => {
    if (!quantity || !paymentMode) {
      handleError("Please enter quantity and payment mode before scanning.");
      setIsScanning(false);
      return;
    }

    const ScannedBill = {
      quantity: parseInt(quantity),
      time: new Date().toLocaleTimeString(),
      paymentMode: paymentMode || "cash",
    };

    try {
      const response = await fetch(
        `http://localhost:8000/api/products/${decodedText}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Product not found");
      } else {
        setSelectedProduct("");
        setQuantity(1);
        setPaymentMode("");
        setIsScanning(false);

        setInterval(() => {
          setIsFormSubmitted(true);
        }, 1000);
      }

      const product = await response.json();
      const newBillItem = {
        productName: product.name,
        quantity: parseInt(quantity),
        price: product.sellingPrice,
        total: product.sellingPrice * quantity,
        time: new Date().toLocaleTimeString(),
        paymentMode: paymentMode || "cash",
      };

      const billResponse = await fetch(
        "http://localhost:8000/api/bills/save-bill",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newBillItem),
        }
      );

      if (!billResponse.ok) {
        const errorData = await billResponse.json();
        handleError(errorData.message);
        throw new Error(errorData.message);
      } else {
        setInterval(() => {
          setIsFormSubmitted(true);
        }, 1000);
      }

      setCurrentBill([newBillItem, ...currentBill]);
      setSales((prev) => ({
        ...prev,
        [paymentMode || "cash"]:
          prev[paymentMode || "cash"] + newBillItem.total,
      }));

      setSelectedProduct("");
      setQuantity(1);
      setPaymentMode("");
      setIsScanning(false);
      handleSuccess("Product added successfully");

      // Refresh bills list and statistical data
      fetchBills();
      setIsFormSubmitted(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      handleError("Failed to find product with scanned QR code");
    }
  };

  const onScanError = (error) => {
    console.warn(error);
  };

  useEffect(() => {
    let scanner;
    if (isScanning) {
      scanner = new Html5QrcodeScanner("qr-reader", {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      });

      scanner.render(onScanSuccess, onScanError);
    }
    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [isScanning]);

  const toggleScanner = () => {
    if (!quantity || !paymentMode) {
      handleError("Please enter quantity and payment mode before scanning.");
      return;
    }
    setIsScanning(!isScanning);
  };

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

  const addToBill = async () => {
    const product = products.find((p) => p.name === selectedProduct);
    if (product) {
      const newBillItem = {
        productName: product.name,
        quantity: parseInt(quantity),
        price: product.sellingPrice,
        total: product.sellingPrice * quantity,
        time: new Date().toLocaleTimeString(),
        paymentMode: paymentMode || "cash",
      };

      try {
        const response = await fetch(
          "http://localhost:8000/api/bills/save-bill",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(newBillItem),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          handleError(errorData.message);
          throw new Error(errorData.message);
        }
        setCurrentBill([newBillItem, ...currentBill]);
        setSales((prev) => ({
          ...prev,
          [paymentMode || "cash"]:
            prev[paymentMode || "cash"] + newBillItem.total,
        }));

        if (response.ok) {
          handleSuccess("Product added successfully");
        }

        setSelectedProduct("");
        setQuantity(1);
        setPaymentMode("");
        fetchBills();
        setIsFormSubmitted(true);
      } catch (error) {
        console.log(error);
        console.error("Error saving bill:", error);
      }
    }
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

      if (!response.ok) {
        const errorData = await response.json();
        handleError(errorData.message);
        throw new Error(errorData.message);
      }

      const data = await response.json();
      setFetchedBills(data);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  useEffect(
    () => {
      fetchProducts();
      fetchBills();
    },
    isFormSubmitted,
    []
  );

  // Calculate pagination for products
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Calculate pagination for fetched bills
  const totalFetchedBillPages = Math.ceil(fetchedBills.length / billsPerPage);
  const indexOfLastFetchedBill = billPage * billsPerPage;
  const indexOfFirstFetchedBill = indexOfLastFetchedBill - billsPerPage;
  const currentFetchedBills = fetchedBills.slice(
    indexOfFirstFetchedBill,
    indexOfLastFetchedBill
  );

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-7xl mx-auto mt-20 p-4 bg-gray-100">
      <BillingStatistical isFormSubmitted={isFormSubmitted} />

      {/* Quick Bill Generation */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Bill Generation</h2>

        {isScanning ? (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Scan QR Code</h3>
              <button
                onClick={toggleScanner}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div id="qr-reader" className="w-full max-w-md mx-auto"></div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="flex-2 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product.id} value={product.name}>
                  {product.name} - ${product.sellingPrice}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="flex-1 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="flex-1 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="">Payment Mode</option>
              <option value="cash">Cash</option>
              <option value="online">Online</option>
              <option value="udari">Udari</option>
            </select>
            <button
              onClick={addToBill}
              className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Add
            </button>
            <button
              onClick={toggleScanner}
              className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 flex items-center gap-2"
            >
              <QrCode size={16} />
              Scan QR
            </button>
          </div>
        )}

        {/* Current Bill */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Quantity
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Time
                </th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentFetchedBills.map((item, index) => (
                <tr key={index}>
                  <td className="p-3">{item.productName}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">${item.price}</td>
                  <td className="p-3">${item.total.toFixed(2)}</td>
                  <td className="p-3">{item.time}</td>
                  <td className="p-3 capitalize">{item.paymentMode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fetched Bills Pagination */}
        {fetchedBills.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {billPage} of {totalFetchedBillPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setBillPage((prev) => Math.max(prev - 1, 1))}
                disabled={billPage === 1}
                className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() =>
                  setBillPage((prev) =>
                    Math.min(prev + 1, totalFetchedBillPages)
                  )
                }
                disabled={billPage === totalFetchedBillPages}
                className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {currentBill.length > 0 && (
          <div className="mt-4 flex justify-end">
            <div className="text-xl font-bold">
              Total: $
              {currentBill
                .reduce((sum, item) => sum + item.total, 0)
                .toFixed(2)}
            </div>
          </div>
        )}
      </div>

      {/* Products List */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Products List</h2>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                Company
              </th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                Price
              </th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                Quantity
              </th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                Expiry Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentProducts.map((product) => (
              <tr key={product.id}>
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.company}</td>
                <td className="p-3">${product.sellingPrice}</td>
                <td className="p-3">{product.availableStock}</td>
                <td className="p-3">{formatDate(product.expiryDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Products Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSSystem;
