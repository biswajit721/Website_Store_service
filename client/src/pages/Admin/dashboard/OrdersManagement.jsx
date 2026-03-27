import { useState } from "react";

export default function OrdersManagement() {
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      service: "Logo Design",
      buyer: "John Doe",
      seller: "Alex Design",
      amount: "$150",
      status: "In Progress",
    },
    {
      id: "ORD-002",
      service: "Website Development",
      buyer: "Sarah Wilson",
      seller: "WebPro Studio",
      amount: "$599",
      status: "Completed",
    },
    {
      id: "ORD-003",
      service: "Mobile App",
      buyer: "Mike Brown",
      seller: "AppMasters",
      amount: "$1299",
      status: "Pending",
    },
  ]);

  const handleStatusChange = (index, newStatus) => {
    const updated = [...orders];
    updated[index].status = newStatus;
    setOrders(updated);
  };

  const badgeStyles = {
    "In Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Orders Management
      </h1>

      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-7 px-6 py-4 bg-gray-50 text-sm font-medium text-gray-600 border-b">
          <div>Order ID</div>
          <div>Service</div>
          <div>Buyer</div>
          <div>Seller</div>
          <div>Amount</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {/* Rows */}
        {orders.map((order, index) => (
          <div
            key={order.id}
            className={`grid grid-cols-7 px-6 py-5 items-center text-sm ${
              index !== orders.length - 1
                ? "border-b border-gray-100"
                : ""
            }`}
          >
            <div className="font-medium text-gray-800">
              {order.id}
            </div>

            <div className="text-gray-600">
              {order.service}
            </div>

            <div className="text-gray-600">
              {order.buyer}
            </div>

            <div className="text-gray-600">
              {order.seller}
            </div>

            <div className="font-medium text-gray-800">
              {order.amount}
            </div>

            {/* Status Badge */}
            <div>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  badgeStyles[order.status]
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Dropdown */}
            <div>
              <select
                value={order.status}
                onChange={(e) =>
                  handleStatusChange(index, e.target.value)
                }
                className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <option>In Progress</option>
                <option>Completed</option>
                <option>Pending</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
