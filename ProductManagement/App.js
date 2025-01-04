// App.js
import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Product 1",
      description: "A great product",
      image: "https://via.placeholder.com/50",
      category: "Electronics",
      price: "$10",
    },
    {
      id: 2,
      name: "Product 2",
      description: "Another great product",
      image: "https://via.placeholder.com/50",
      category: "Clothing",
      price: "$15",
    },
  ]);
  const [search, setSearch] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    image: "",
    category: "",
    price: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);

  // Handle search
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new product
  const addProduct = () => {
    setProducts((prev) => [
      ...prev,
      { ...newProduct, id: Date.now() },
    ]);
    setNewProduct({
      name: "",
      description: "",
      image: "",
      category: "",
      price: "",
    });
  };

  // Edit an existing product
  const editProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      image: product.image,
      category: product.category,
      price: product.price,
    });
  };

  // Update the product in the list
  const updateProduct = () => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === editingProduct.id
          ? { ...product, ...newProduct }
          : product
      )
    );
    setEditingProduct(null);
    setNewProduct({
      name: "",
      description: "",
      image: "",
      category: "",
      price: "",
    });
  };

  // Delete a product
  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <h1>Admin Controls</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="product-form">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="image"
          placeholder="Product Image URL"
          value={newProduct.image}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Product Category Name"
          value={newProduct.category}
          onChange={handleChange}
        />
        <input
          type="text"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleChange}
        />
        {editingProduct ? (
          <button onClick={updateProduct}>Update Product</button>
        ) : (
          <button onClick={addProduct}>Add Product</button>
        )}
      </div>

      <div className="product-list">
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Description</th>
              <th>Product Image</th>
              <th>Product Category Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                      style={{ width: "50px", height: "50px" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{product.category}</td>
                <td>{product.price}</td>
                <td>
                  <button className="edit" onClick={() => editProduct(product)}>
                    Edit
                  </button>
                  <button
                    className="delete"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
