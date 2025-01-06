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
import { MenuOpen, Home, Payment } from "@mui/icons-material";
import AddDtModal from "../components/AddDtModal";
import { fetchDt } from "../firebase/dailyTransactionsServices";

const DailyTransactions = () => {
  const [loading, setLoading] = useState(true);
  const [dt, setDt] = useState([]);
  const [filteredDt, setFilteredDt] = useState([]);

  const [filters, setFilters] = useState({
    date: "",
    transactionName: "",
    status: "",
    operation: "",
  });

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

  return (
    <>
      <AppBar position="relative">
        <Toolbar>
          <IconButton color="inherit" edge="start" sx={{ marginRight: 2 }}>
            <MenuOpen />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Daily Transactions
          </Typography>
        </Toolbar>
      </AppBar>

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
            label="Transaction Name"
            name="transactionName"
            value={filters.transactionName}
            onChange={handleFilterChange}
          />
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
            <MenuItem value="credit">Credit</MenuItem>
            <MenuItem value="debit">Debit</MenuItem>
          </Select>
          <Button variant="contained" color="primary" onClick={applyFilters}>
            Apply
          </Button>
          <Button variant="outlined" color="secondary" onClick={clearFilters}>
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
                      {transaction.operation === "credit" ? "Credit" : "Debit"}
                    </TableCell>
                    <TableCell align="center">
                      {transaction.status === "successful" ? "Successful" : "Failure"}
                    </TableCell>
                    <TableCell align="center">{transaction.name}</TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: transaction.operation === "credit" ? "green" : "red",
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
