import React, { useState } from "react";
import "./Supplier.css";

const suppliersData = {
  1: {
    name: "Supplier A",
    currentOrderStatus: "Processing",
    orderHistory: [
      {
        orderId: "001",
        orderDate: "2024-01-01",
        status: "Delivered",
        productName: "Product A",
        description: "High quality product",
        productImage: "https://via.placeholder.com/50",
        productCategory: "Category 1",
        modelNumber: "A123",
        serialNumber: "SN123",
        stockLevel: 100,
        reorderPoint: 20,
        supplierName: "Supplier A",
        supplierMail: "supplierA@mail.com",
        supplierContact: "123-456-7890",
        quantity: 5,
      },
      {
        orderId: "002",
        orderDate: "2024-01-05",
        status: "Shipped",
        productName: "Product B",
        description: "Affordable product",
        productImage: "https://via.placeholder.com/50",
        productCategory: "Category 2",
        modelNumber: "B234",
        serialNumber: "SN234",
        stockLevel: 150,
        reorderPoint: 30,
        supplierName: "Supplier A",
        supplierMail: "supplierA@mail.com",
        supplierContact: "123-456-7890",
        quantity: 10,
      },
    ],
  },
};

const SupplierOrderStatus = () => {
  const [selectedSupplierId, setSelectedSupplierId] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStockLevel, setFilterStockLevel] = useState("");

  const handleSupplierChange = (e) => {
    setSelectedSupplierId(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const supplier = suppliersData[selectedSupplierId];

  // Filtered order history
  const filteredOrders = supplier.orderHistory.filter((order) => {
    const matchesSearch =
      order.productName.toLowerCase().includes(searchQuery) ||
      order.productCategory.toLowerCase().includes(searchQuery);

    const matchesCategory = filterCategory
      ? order.productCategory.toLowerCase() === filterCategory.toLowerCase()
      : true;

    const matchesStockLevel = filterStockLevel
      ? order.stockLevel.toString() === filterStockLevel
      : true;

    return matchesSearch && matchesCategory && matchesStockLevel;
  });

  return (
    <div className="order-status-container">
      <h1>Supplier Order History and Current Order Status</h1>

      {/* Supplier Selection */}
      <div className="select-supplier">
        <label htmlFor="supplierSelect">Select Supplier: </label>
        <select
          id="supplierSelect"
          value={selectedSupplierId}
          onChange={handleSupplierChange}
        >
          <option value="1">Supplier A</option>
          {/* Add more options for other suppliers */}
        </select>
      </div>

      {/* Search and Filtering */}
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search by name or category"
          value={searchQuery}
          onChange={handleSearch}
        />
        <select
          onChange={(e) => setFilterCategory(e.target.value)}
          value={filterCategory}
        >
          <option value="">Filter by Category</option>
          <option value="Category 1">Category 1</option>
          <option value="Category 2">Category 2</option>
          {/* Add more categories as needed */}
        </select>
        <input
          type="number"
          placeholder="Filter by Stock Level"
          value={filterStockLevel}
          onChange={(e) => setFilterStockLevel(e.target.value)}
        />
      </div>

      {/* Current Order Status */}
      <div className="current-order-status">
        <h2>Current Order Status</h2>
        <p>{supplier.currentOrderStatus}</p>
      </div>

      {/* Order History Table */}
      <div className="order-history">
        <h2>Order History</h2>
        <table className="order-history-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Stock Level</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.orderDate}</td>
                <td>{order.status}</td>
                <td>{order.productName}</td>
                <td>{order.productCategory}</td>
                <td>{order.stockLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierOrderStatus;

