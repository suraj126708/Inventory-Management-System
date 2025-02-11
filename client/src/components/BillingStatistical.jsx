const { useState, useEffect } = require("react");

function BillGeneration({ isFormSubmitted }) {
  const [sales, setSales] = useState({
    cash: 0,
    online: 0,
    udari: 0,
    Total: 0,
  });

  const fetchSales = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/sales/get-sales");
      const data = await response.json();
      console.log(data);
      setSales({
        cash: data[0].cash,
        online: data[0].online,
        udari: data[0].pendingPayment,
        Total: data[0].total,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [isFormSubmitted]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Cash Sales</h3>
          <p className="text-2xl font-bold text-blue-600">${sales.cash}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Online Sales</h3>
          <p className="text-2xl font-bold text-blue-600">${sales.online}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Udari Sales</h3>
          <p className="text-2xl font-bold text-blue-600">${sales.udari}</p>
        </div>
        <div className="p-6 bg-gradient-to-r white to bg-yellow-100 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Total Sales</h3>
          <p className="text-2xl font-bold text-blue-600">${sales.Total}</p>
        </div>
      </div>
    </div>
  );
}

export default BillGeneration;
