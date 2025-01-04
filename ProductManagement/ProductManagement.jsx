import React, { useState } from "react";
import "./Supplier.css";
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  IconButton,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import { Edit, Delete, Inventory } from "@mui/icons-material";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stock: 0,
    reorderPoint: 0,
  });
  const [transactionData, setTransactionData] = useState({
    type: "in",
    quantity: 0,
  });
  const [notification, setNotification] = useState({ open: false, message: "", severity: "" });

  const handleOpenModal = (product = null) => {
    setCurrentProduct(product);
    if (product) {
      setFormData(product);
    } else {
      setFormData({ name: "", category: "", stock: 0, reorderPoint: 0 });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenTransactionModal = (product) => {
    setCurrentProduct(product);
    setTransactionData({ type: "in", quantity: 0 });
    setOpenTransactionModal(true);
  };

  const handleCloseTransactionModal = () => {
    setOpenTransactionModal(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = () => {
    if (currentProduct) {
      setProducts((prev) =>
        prev.map((product) => (product.name === currentProduct.name ? formData : product))
      );
      showNotification("Product updated successfully!", "success");
    } else {
      setProducts([...products, formData]);
      showNotification("Product added successfully!", "success");
    }
    handleCloseModal();
  };

  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setTransactionData({ ...transactionData, [name]: value });
  };

  const handleTransactionSubmit = () => {
    const { type, quantity } = transactionData;
    const updatedQuantity = type === "in" ? +quantity : -quantity;

    setProducts((prev) =>
      prev.map((product) =>
        product.name === currentProduct.name
          ? { ...product, stock: product.stock + updatedQuantity }
          : product
      )
    );
    showNotification("Stock updated successfully!", "success");
    handleCloseTransactionModal();
  };

  const handleDelete = (name) => {
    setProducts(products.filter((product) => product.name !== name));
    showNotification("Product deleted successfully!", "info");
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ marginBottom: 3, textAlign: "center" }}>
        Product Management
      </Typography>

      <Grid container spacing={2} justifyContent="space-between" alignItems="center">
        <Grid item>
          <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
            Add Product
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenTransactionModal(product)}
                  >
                    <Inventory />
                  </IconButton>
                  <IconButton color="warning" onClick={() => handleOpenModal(product)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(product.name)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Product Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" marginBottom={2}>
            {currentProduct ? "Edit Product" : "Add Product"}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleFormChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Stock"
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleFormChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Reorder Point"
            type="number"
            name="reorderPoint"
            value={formData.reorderPoint}
            onChange={handleFormChange}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleFormSubmit}>
            Save
          </Button>
        </Box>
      </Modal>

      {/* Stock In/Out Modal */}
      <Modal open={openTransactionModal} onClose={handleCloseTransactionModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" marginBottom={2}>
            Stock In/Out
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Transaction Type</InputLabel>
            <Select
              name="type"
              value={transactionData.type}
              onChange={handleTransactionChange}
            >
              <MenuItem value="in">Stock In</MenuItem>
              <MenuItem value="out">Stock Out</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Quantity"
            type="number"
            name="quantity"
            value={transactionData.quantity}
            onChange={handleTransactionChange}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleTransactionSubmit}>
            Update Stock
          </Button>
        </Box>
      </Modal>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={notification.severity} onClose={handleNotificationClose}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductManagement;

