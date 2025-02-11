import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  ArrowDown,
  ArrowUp,
  Users,
  DollarSign,
  Package,
  ShoppingCart,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AdminDashboard = () => {
  const [sales, setSales] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    averageOrdersPerDay: 0,
    monthlySales: [],
    topSellingProducts: [],
    minAvailableStocks: [],
  });

  const fetchSales = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/sales/get-sales");
      const data = await response.json();
      console.log(data[0].monthlySales);
      setSales({
        totalSales: data[0].total,
        totalOrders: data[0].totalOrders,
        totalProducts: data[0].totalProducts,
        pendingPayment: data[0].pendingPayment,
        monthlySales: data[0].monthlySales,
        topSellingProducts: data[0].topSellingProducts,
        minAvailableStocks: data[0].minAvailableStocks,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const salesData = [
    { month: "Jan", sales: 4000, profit: 2400, orders: 240 },
    { month: "Feb", sales: 3000, profit: 1398, orders: 200 },
    { month: "Mar", sales: 2000, profit: 9800, orders: 180 },
    { month: "Apr", sales: 2780, profit: 3908, orders: 190 },
    { month: "May", sales: 1890, profit: 4800, orders: 170 },
    { month: "Jun", sales: 2390, profit: 3800, orders: 220 },
  ];

  const data01 = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];
  const data02 = [
    { name: "A1", value: 100 },
    { name: "A2", value: 300 },
    { name: "B1", value: 100 },
    { name: "B2", value: 80 },
    { name: "B3", value: 40 },
    { name: "B4", value: 30 },
    { name: "B5", value: 50 },
    { name: "C1", value: 100 },
    { name: "C2", value: 200 },
    { name: "D1", value: 150 },
    { name: "D2", value: 50 },
  ];

  const inventoryData = [
    { name: "In Stock", value: 400 },
    { name: "Low Stock", value: 80 },
    { name: "Out of Stock", value: 20 },
  ];

  const COLORS = ["#0088FE", "#FFBB28", "#FF8042"];

  const StatCard = ({ title, value, trend, trendValue, icon: Icon }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
            <div
              className={`flex items-center mt-2 ${
                trend === "up" ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend === "up" ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
              <span className="ml-1 text-sm">{trendValue}%</span>
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-full">
            <Icon size={24} className="text-blue-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const TopProducts = () => (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sales.topSellingProducts.map((product, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-600">
                  {product.totalSales} sales
                </p>
              </div>
              <p className="font-bold text-blue-600">{product.soldQuantity}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const LowStockAlert = () => (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="mr-2 text-yellow-500" />
          Low Stock Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sales.minAvailableStocks.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Current stock: {item.availableStock}
                </p>
              </div>
              <p className="text-sm text-yellow-600">
                Threshold: {item.quantity}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white p-6 mt-20">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Sales"
          value={sales.totalSales}
          trend="up"
          trendValue="12"
          icon={DollarSign}
        />
        <StatCard
          title="Total Orders"
          value={sales.totalOrders}
          trend="up"
          trendValue="8"
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Products"
          value={sales.totalProducts}
          trend="up"
          trendValue="5"
          icon={Package}
        />
        <StatCard
          title="Pending Payments"
          value={sales.pendingPayment}
          trend="down"
          trendValue="3"
          icon={Users}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                  <Line type="monotone" dataKey="profit" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart width={400} height={400}>
                  <Pie
                    data={data01}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                  />
                  <Pie
                    data={data02}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    fill="#82ca9d"
                    label
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {inventoryData.map((item, index) => (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={400} height={400}>
                      <Pie
                        data={data01}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                      />
                      <Pie
                        data={data02}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        fill="#82ca9d"
                        label
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        <TopProducts />
        <LowStockAlert />
      </div>
    </div>
  );
};

export default AdminDashboard;
