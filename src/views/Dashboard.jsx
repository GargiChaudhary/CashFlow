import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  AppBar,
  Toolbar,
  Modal,
  Menu,
  MenuItem,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import AddCustomerModal from "../components/AddCustomerModal";
import { db } from "../firebase/firebaseConfig"; 
import { collection, getDocs } from "firebase/firestore";
import { addCustomer, deleteCustomer, fetchCustomers, updateCustomer } from "../firebase/customerServices";
import AddTransactionModal from "../components/AddTransactionModal";
import { addTransaction } from "../firebase/transactionServices";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { AccountCircle, Close, Home, MenuOpen, Payment,} from "@mui/icons-material";

const Dashboard = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setfilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [addCustModalOpen, setaddCustModalOpen] = useState(false);
  const handleOpenAddCustModal = () => setaddCustModalOpen(true);
  const handleCloseAddCustModal = () => setaddCustModalOpen(false);

  const handleAddCustomer = async (formData) => {
    console.log("Customer Added:", formData);
    try {
      const customerId = await addCustomer(formData);
      console.log("Customer added successfully with Firestore ID:", customerId);
      refreshData();
    } catch (error) {
      console.error("Failed to add customer:", error);
    }
  };

  const [addTransactionModalOpen, setaddTransactionModalOpen] = useState(false);
  const handleOpenAddTransactionModal = () => setaddTransactionModalOpen(true);
  const handleCloseAddTransactionModal = () => setaddTransactionModalOpen(false);

  const handleAddTransaction = async (formData) => {
    console.log("Transaction Added:", formData);
    try {
      const customerId = selectedCustomer.id; 
      console.log("Customer: ", selectedCustomer);
      console.log("Customer id is: ", customerId);
      const transactionId = await addTransaction(customerId, formData);
      console.log("Customer added successfully with Firestore ID:", transactionId);
      refreshData();
    } catch (error) {
      console.error("Failed to add Transaction:", error);
    }
  };

  useEffect(() => {
    const fetchcustomers = async () => {
      const response = await fetchCustomers();
      setCustomers(response);
      setfilteredCustomers(response);
      setLoading(false);
    }
    fetchcustomers();
  }, []);

  const refreshData = async () => {
    const response = await fetchCustomers();
    setCustomers(response);
    setfilteredCustomers(response);
  }

  const handleDeleteCustomer = async () => {
    if (selectedCustomer) {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete ${selectedCustomer.name}?`
      );
      if (confirmDelete) {
        try {
          await deleteCustomer(selectedCustomer.id);
          console.log("Customer deleted successfully.");
          refreshData();
          handleMenuClose();
        } catch (error) {
          console.error("Failed to delete customer:", error);
        }
      }
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    if (value) {
      const filtered = customers.filter((customer) =>
        customer.name.toLowerCase().includes(value) ||
        customer.phone.toLowerCase().includes(value)
      );
      setfilteredCustomers(filtered);
    } else {
      setfilteredCustomers(customers);
    }
  };

  const handleMenuOpen = (event, customer) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(customer); 
    console.log("Heyyyyy ", customer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close the menu
    setSelectedCustomer(null);
  };

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: "", phone: "" });


  // Open Edit Modal
  const handleOpenEditModal = () => {
    setEditFormData({
      name: selectedCustomer.name,
      phone: selectedCustomer.phone,
    });
    setEditModalOpen(true);
  };

  // Close Edit Modal
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  // Submit Edit
  const handleEditSubmit = async () => {
    try {
      await updateCustomer(selectedCustomer.id, editFormData);
      console.log("Customer updated successfully.");
      refreshData();
      handleCloseEditModal();
    } catch (error) {
      console.error("Failed to update customer:", error);
    }
  };

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const drawerContent = (
    <Box
      sx={{
        width: 250,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <Box>
        {/* Close Button */}
        <Box sx={{
          display: 'flex',
          padding: '20px 15px',
          justifyContent: 'space-between',
          alignContent: 'center',
          alignItems: 'center',
        }}>
          <AccountCircle sx={{fontSize: '35px'}}/>
          <Typography sx={{color: '#2C3E50'}}>Harendra Kumar</Typography>
          <IconButton onClick={toggleDrawer(false)}>
            <Close />
          </IconButton>
        </Box>

        {/* Drawer List */}
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/')}>
              <ListItemIcon>
                <Home sx={{color: '#2C3E50'}}/>
              </ListItemIcon>
              <ListItemText sx={{color: '#2C3E50'}} primary="Home" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/daily-transactions')}>
              <ListItemIcon>
                <Payment sx={{
                    color: '#2C3E50',
                }}/>
              </ListItemIcon>
              <ListItemText sx={{color: '#2C3E50'}} primary="Daily Transactions" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Footer (Optional) */}
      <Box p={2} textAlign="center" borderTop="1px solid #ddd">
        <Typography variant="body2" color="textSecondary">
          My Cash Flow © 2024
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Navbar */}
      <AppBar position="relative">
        <Toolbar>
          {/* Hamburger Menu Icon */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer(true)}
            sx={{ marginRight: 2 }}
          >
            <MenuOpen />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Cash Flow
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>

      <Box sx={{ margin: "20px 150px" }}>
        {/* Search Bar and Add customer Button */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          sx={{ marginTop: "20px" }}
        >
          <TextField
            variant="outlined"
            placeholder="Search customers"
            value={searchTerm}
            sx={{ marginRight: "30px", width: "800px" }}
            onChange={handleSearch}
            InputProps={{
              endAdornment: <SearchIcon />,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAddCustModal}
          >
            Add customer
          </Button>
          <AddCustomerModal
            open={addCustModalOpen}
            handleClose={handleCloseAddCustModal}
            handleSubmit={handleAddCustomer}
          />
        </Box>

        {/* customer Table */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="300px">
            <CircularProgress />
          </Box>
        ) : filteredCustomers.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Name
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Phone
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Transactions
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Outstanding
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} align="center">
                    <TableCell align="center">{customer.name}</TableCell>
                    <TableCell align="center">{customer.phone}</TableCell>
                    <TableCell align="center">{customer.number_of_transactions}</TableCell>
                    <TableCell align="center" sx={{
                      color: customer.outstanding > 0 ? 'green' : customer.outstanding < 0 ? 'red' : 'black',
                      fontWeight: 'bold'
                    }}
                    >{customer.outstanding}</TableCell>
                    <TableCell align="center">
                      <Typography
                        sx={{
                          bgcolor: "#2C3E50",
                          marginLeft: "2px",
                          marginRight: "2px",
                          padding: "4px 4px",
                          borderRadius: "5px",
                          color: "#fff",
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                        onClick={(event) => handleMenuOpen(event, customer)}
                      >
                        Action
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" color="textSecondary" align="center">
            No customers found.
          </Typography>
        )}
      </Box>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleOpenAddTransactionModal}>
          Add Transaction
        </MenuItem>
        <AddTransactionModal
            open={addTransactionModalOpen}
            handleClose={handleCloseAddTransactionModal}
            handleSubmit={handleAddTransaction}
          />
        <MenuItem
          onClick={() => {
            navigate("/customer-details", { state: { customer: selectedCustomer } });
            handleMenuClose();
          }}
        >
          View
        </MenuItem>
        <MenuItem onClick={handleOpenEditModal}>Edit</MenuItem>
        <Modal open={editModalOpen} onClose={handleCloseEditModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: "8px",
              width: "400px",
            }}
          >
            <Typography variant="h6" mb={2}>
              Edit Customer
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Phone"
              value={editFormData.phone}
              onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
            />
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button onClick={handleCloseEditModal} sx={{ marginRight: "10px" }}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleEditSubmit}>
                Save
              </Button>
            </Box>
          </Box>
        </Modal>

        <MenuItem onClick={handleDeleteCustomer}>Delete</MenuItem>
      </Menu>
    </>
  );
};

export default Dashboard;