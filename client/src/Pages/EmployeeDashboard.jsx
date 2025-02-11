import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Clock,
  ShoppingCart,
  Package,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Search,
  Filter,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const EmployeeDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Sample data - replace with actual data from your backend
  const todaysSales = [
    { hour: "9AM", sales: 1200 },
    { hour: "10AM", sales: 1800 },
    { hour: "11AM", sales: 2400 },
    { hour: "12PM", sales: 3000 },
    { hour: "1PM", sales: 2800 },
    { hour: "2PM", sales: 2200 },
  ];

  const TaskCard = ({ title, count, icon: Icon, color }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{count}</h3>
          </div>
          <div className={`p-4 bg-opacity-20 rounded-full ${color}`}>
            <Icon size={24} className={color} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const OrdersList = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Orders</CardTitle>
        <div className="flex space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Search size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Filter size={20} />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            {
              id: "#1234",
              customer: "John Doe",
              total: "$120",
              status: "Processing",
            },
            {
              id: "#1235",
              customer: "Jane Smith",
              total: "$85",
              status: "Completed",
            },
            {
              id: "#1236",
              customer: "Mike Johnson",
              total: "$200",
              status: "Processing",
            },
          ].map((order, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-bold">{order.total}</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    order.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const InventoryAlerts = () => (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { product: "Product A", status: "Low Stock", count: 5 },
            { product: "Product B", status: "Out of Stock", count: 0 },
            { product: "Product C", status: "Expiring Soon", count: 10 },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <AlertTriangle
                  className={
                    item.status === "Out of Stock"
                      ? "text-red-500"
                      : item.status === "Low Stock"
                      ? "text-yellow-500"
                      : "text-orange-500"
                  }
                />
                <div>
                  <p className="font-medium">{item.product}</p>
                  <p className="text-sm text-gray-600">{item.status}</p>
                </div>
              </div>
              <div>
                <span className="font-bold">{item.count} units</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const TasksList = () => (
    <Card>
      <CardHeader>
        <CardTitle>Today's Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { task: "Restock shelves", status: "completed", time: "9:00 AM" },
            {
              task: "Update inventory count",
              status: "pending",
              time: "11:00 AM",
            },
            { task: "Process returns", status: "pending", time: "2:00 PM" },
          ].map((task, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {task.status === "completed" ? (
                  <CheckCircle className="text-green-500" />
                ) : (
                  <Clock className="text-yellow-500" />
                )}
                <div>
                  <p className="font-medium">{task.task}</p>
                  <p className="text-sm text-gray-600">{task.time}</p>
                </div>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded-lg px-4 py-2"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <TaskCard
          title="Today's Sales"
          count="$3,426"
          icon={DollarSign}
          color="text-green-500 bg-green-100"
        />
        <TaskCard
          title="Orders Processed"
          count="28"
          icon={ShoppingCart}
          color="text-blue-500 bg-blue-100"
        />
        <TaskCard
          title="Items Restocked"
          count="124"
          icon={Package}
          color="text-purple-500 bg-purple-100"
        />
        <TaskCard
          title="Tasks Completed"
          count="8/12"
          icon={CheckCircle}
          color="text-yellow-500 bg-yellow-100"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={todaysSales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <TasksList />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersList />
        <InventoryAlerts />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
