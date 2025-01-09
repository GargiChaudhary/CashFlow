import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CustomerDetailsAppBar from "../components/CustomerDetailsAppbar";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import AddTransactionModal from "../components/AddTransactionModal";
import { addTransaction, deleteTransaction, fetchTransactions, updateTransaction } from "../firebase/transactionServices";

import { Menu, MenuItem, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditTransactionModal from "../components/EditTransactionModal";
import { updateOutstanding } from "../firebase/customerServices";

const CustomerDetails = () => {
  const location = useLocation();
  const customer = location.state?.customer;
  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // Anchor for action menu
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [outstanding, setOutstanding] = useState(customer?.outstanding || 0);

  const calculateOutstanding = async (transactionsList) => {
    const totalRemaining = transactionsList.reduce(
      (sum, transaction) => sum + (transaction.remainingAmount || 0),
      0
    );
    setOutstanding(totalRemaining);
    await updateOutstanding(customer.id, totalRemaining);
  };

  useEffect(() => {
    async function fetchData() {
      const response = await fetchTransactions(customer.id);
      setTransactions(response);
      calculateOutstanding(response);
    }
    fetchData();
  }, [customer.id]);

  const handleAddTransaction = async (transactionData) => {
    await addTransaction(customer.id, transactionData);
    const response = await fetchTransactions(customer.id);
    setTransactions(response);
    calculateOutstanding(response);
  };

  const handleEditTransaction = async (updatedTransaction) => {
    await updateTransaction(customer.id, transactionToEdit.id, updatedTransaction);
    const response = await fetchTransactions(customer.id);
    setTransactions(response);
    calculateOutstanding(response);
    setEditModalOpen(false);
  };

  const handleDeleteTransaction = async (transactionId) => {
    await deleteTransaction(customer.id, transactionId);
    const response = await fetchTransactions(customer.id);
    setTransactions(response);
    calculateOutstanding(response);
    setAnchorEl(null); 
  };

  const handleActionClick = (event, transaction) => {
    setAnchorEl(event.currentTarget);
    setTransactionToEdit(transaction);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <CustomerDetailsAppBar />
      <Box sx={{ margin: "30px 80px" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px" }}>
          <Typography
            sx={{
              fontSize: "18px",
              color: outstanding > 0 ? 'green' : outstanding < 0 ? 'red' : 'black',
              fontWeight: "bold",
            }}
          >
            Outstanding: {outstanding}
          </Typography>

          <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
            Add Transaction
          </Button>
          <AddTransactionModal
            open={openModal}
            handleClose={() => setOpenModal(false)}
            handleSubmit={handleAddTransaction}
          />
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Operation</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Amount Received</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Amount Given</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Remarks</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Remaining Amount</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.operation == 'cashin' ? 'Cash In' : 'Cash Out'}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.operation === "cashout" ? "-" : transaction.amountReceived}</TableCell>
                  <TableCell>{transaction.operation === "cashin" ? "-" : transaction.amountGiven}</TableCell>
                  <TableCell>{transaction.remarks}</TableCell>
                  <TableCell sx={{
                    color: transaction.remainingAmount > 0 ? 'green' : transaction.remainingAmount < 0 ? 'red' : 'black',
                    fontWeight: 'bold'
                  }}>{transaction.remainingAmount}</TableCell>
                  <TableCell>{new Date(transaction.dateTime).toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(event) => handleActionClick(event, transaction)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem
            onClick={() => {
              setEditModalOpen(true);
              handleCloseMenu();
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => handleDeleteTransaction(transactionToEdit.id)}
          >
            Delete
          </MenuItem>
        </Menu>
        <EditTransactionModal
          open={editModalOpen}
          transaction={transactionToEdit}
          handleClose={() => setEditModalOpen(false)}
          handleSubmit={handleEditTransaction}
        />
      </Box>
    </>
  );
};

export default CustomerDetails;
