import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
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
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { MenuOpen, Home, Payment, AccountCircle, Close } from "@mui/icons-material";
import AddDtModal from "../components/AddDtModal";
import { addDailyTransaction, fetchDt } from "../firebase/dailyTransactionsServices";
import { useNavigate } from "react-router-dom";

const DailyTransactions = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dt, setDt] = useState([]);
  const [filteredDt, setFilteredDt] = useState([]);

  const [filters, setFilters] = useState({
    date: "",
    transactionName: "",
    status: "",
    operation: "",
  });

  const handleSubmit = async (formData) => {
      console.log("DT Added:", formData);
      try {
        const dtId = await addDailyTransaction(formData);
        console.log("DT added successfully with Firestore ID:", dtId);
        // refreshData();
      } catch (error) {
        console.error("Failed to add DT:", error);
      }
    };

  const [addDtModalOpen, setAddDtModalOpen] = useState(false);
  const handleOpenAddDtModal = () => setAddDtModalOpen(true);
  const handleCloseAddDtModal = () => setAddDtModalOpen(false);

  useEffect(() => {
    const fetchDtList = async () => {
      const response = await fetchDt();
      setDt(response);
      setFilteredDt(response);
      setLoading(false);
    };
    fetchDtList();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const resetFilters = () => {
    setFilters({
      date: "",
      transactionName: "",
      status: "",
      operation: "",
    });
    setFilteredDt(dt);
  }

  const applyFilters = () => {
    let filtered = dt;

    if (filters.date) {
      filtered = filtered.filter((transaction) =>
        new Date(transaction.dateTime).toISOString().slice(0, 10) === filters.date
      );
    }

    if (filters.transactionName) {
      filtered = filtered.filter((transaction) =>
        transaction.name.toLowerCase().includes(filters.transactionName.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter((transaction) => transaction.status === filters.status);
    }

    if (filters.operation) {
      filtered = filtered.filter((transaction) => transaction.operation === filters.operation);
    }

    setFilteredDt(filtered);
  };

  const clearFilters = () => {
    setFilters({ date: "", transactionName: "", status: "", operation: "" });
    setFilteredDt(dt);
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
      <AppBar position="relative">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer(true)}
            sx={{ marginRight: 2 }}
          >
            <MenuOpen />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Daily Transactions
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>

      <Box sx={{ margin: "20px 150px" }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddDtModal}
          >
            Add Transaction
          </Button>
          <AddDtModal
            open={addDtModalOpen}
            handleClose={handleCloseAddDtModal}
            handleSubmit={handleSubmit}
          />
        </Box>

        <Box display="flex" gap={2} mb={4}>
          <TextField
            label="Date"
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            fullWidth
            label="Transaction Name"
            name="transactionName"
            value={filters.transactionName}
            onChange={handleFilterChange}
          >
            <MenuItem value="Electricity Bill">Electricity Bill</MenuItem>
            <MenuItem value="Mobile Recharge">Mobile Recharge</MenuItem>
            <MenuItem value="Loan">Loan</MenuItem>
            <MenuItem value="Spice ATM">Spice ATM</MenuItem>
            <MenuItem value="DMT">DMT</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </TextField>
          <Select
            label="Status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            displayEmpty
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="successful">Successful</MenuItem>
            <MenuItem value="failure">Failure</MenuItem>
          </Select>
          <Select
            label="Operation"
            name="operation"
            value={filters.operation}
            onChange={handleFilterChange}
            displayEmpty
          >
            <MenuItem value="">All Operations</MenuItem>
            <MenuItem value="cashin">Cash in</MenuItem>
            <MenuItem value="cashout">Cash out</MenuItem>
          </Select>
          <Button variant="contained" color="primary" onClick={applyFilters}>
            Apply
          </Button>
          <Button variant="outlined" color="grey" onClick={clearFilters}>
            Clear
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="300px">
            <CircularProgress />
          </Box>
        ) : filteredDt.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Operation</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Transaction Name</TableCell>
                  <TableCell align="center">Amount</TableCell>
                  <TableCell align="center">Remarks</TableCell>
                  <TableCell align="center">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDt.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell align="center">
                      {transaction.operation === "cashin" ? "Cash in" : "Cash out"}
                    </TableCell>
                    <TableCell align="center">
                      {transaction.status === "successful" ? "Successful" : "Failure"}
                    </TableCell>
                    <TableCell align="center">{transaction.name}</TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: transaction.operation === "cashin" ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {transaction.amount}
                    </TableCell>
                    <TableCell align="center">{transaction.remarks}</TableCell>
                    <TableCell align="center">
                      {new Date(transaction.dateTime).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography align="center" color="textSecondary">
            No transactions found.
          </Typography>
        )}
      </Box>
    </>
  );
};

export default DailyTransactions;
