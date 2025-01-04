import React, { useState } from 'react';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({ name: '', contactInfo: '', orderHistory: [], currentOrderStatus: '' });
  const [editIndex, setEditIndex] = useState(null);

  const handleAddSupplier = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      // Update existing supplier
      const updatedSuppliers = suppliers.map((supplier, index) =>
        index === editIndex ? newSupplier : supplier
      );
      setSuppliers(updatedSuppliers);
      setEditIndex(null);
    } else {
      // Add new supplier
      setSuppliers([...suppliers, newSupplier]);
    }
    setNewSupplier({ name: '', contactInfo: '', orderHistory: [], currentOrderStatus: '' });
  };

  const handleEditSupplier = (index) => {
    setEditIndex(index);
    setNewSupplier(suppliers[index]);
  };

  const handleDeleteSupplier = (index) => {
    const updatedSuppliers = suppliers.filter((_, i) => i !== index);
    setSuppliers(updatedSuppliers);
  };

  const handleAddOrder = (index) => {
    const order = prompt("Enter order details:");
    if (order) {
      const updatedSuppliers = suppliers.map((supplier, i) => {
        if (i === index) {
          return {
            ...supplier,
            orderHistory: [...supplier.orderHistory, order],
          };
        }
        return supplier;
      });
      setSuppliers(updatedSuppliers);
    }
  };

  return (
    <div className="supplier-list-container">
      <h2>Supplier Management</h2>
      <form onSubmit={handleAddSupplier}>
        <input
          type="text"
          placeholder="Supplier Name"
          value={newSupplier.name}
          onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Contact Information"
          value={newSupplier.contactInfo}
          onChange={(e) => setNewSupplier({ ...newSupplier, contactInfo: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Current Order Status"
          value={newSupplier.currentOrderStatus}
          onChange={(e) => setNewSupplier({ ...newSupplier, currentOrderStatus: e.target.value })}
          required
        />
        <button type="submit">{editIndex !== null ? 'Update Supplier' : 'Add Supplier'}</button>
      </form>
      <ul>
        {suppliers.map((supplier, index) => (
          <li key={index}>
            <strong>{supplier.name}</strong> - {supplier.contactInfo} - Current Status: {supplier.currentOrderStatus}
            <button onClick={() => handleEditSupplier(index)}>Edit</button>
            <button onClick={() => handleDeleteSupplier(index)}>Delete</button>
            <button onClick={() => handleAddOrder(index)}>Add Order</button>
            <ul>
              {supplier.orderHistory.length > 0 ? (
                supplier.orderHistory.map((order, i) => <li key={i}>{order}</li>)
              ) : (
                <li>No orders recorded.</li>
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupplierList;