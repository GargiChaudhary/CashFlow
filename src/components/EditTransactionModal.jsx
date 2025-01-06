import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";

const EditTransactionModal = ({ open, handleClose, handleSubmit, transaction }) => {
  const [formData, setFormData] = useState({
    operation: "credit",
    status: "successful",
    amount: "",
    amountReceived: "",
    amountGiven: "",
    remarks: "",
  });

  // Initialize form data when transaction changes
  useEffect(() => {
    if (transaction) {
      setFormData({
        operation: transaction.operation || "credit",
        status: transaction.status || "successful",
        amount: transaction.amount || "",
        amountReceived: transaction.amountReceived || "",
        amountGiven: transaction.amountGiven || "",
        remarks: transaction.remarks || "",
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name == "operation"){
      if(value == "credit") {
        setFormData({...formData, ["amountGiven"]: "0"});
      } else {
        setFormData({...formData, ["amountReceived"]: "0"});
      }
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const calculateRemainingAmount = () => {
    const { operation, amount, amountReceived, amountGiven } = formData;
    const totalAmount = parseFloat(amount) || 0;
    const received = parseFloat(amountReceived) || 0;
    const given = parseFloat(amountGiven) || 0;

    if (operation === "credit") {
      return totalAmount - received;
    } else if (operation === "debit") {
      return given - totalAmount;
    }
    return 0;
  };

  const handleFormSubmit = () => {
    const remainingAmount = calculateRemainingAmount();
    const updatedTransaction = {
      ...formData,
      remainingAmount,
    };

    handleSubmit(updatedTransaction);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Transaction</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          {/* Operation Type */}
          <TextField
            select
            label="Operation"
            name="operation"
            value={formData.operation}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="credit">Credit</MenuItem>
            <MenuItem value="debit">Debit</MenuItem>
          </TextField>

          {/* Status */}
          <TextField
            select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="successful">Successful</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
          </TextField>

          {/* Total Amount */}
          <TextField
            label="Total Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            fullWidth
          />

          {/* Amount Received */}
          <TextField
            label="Amount Received"
            name="amountReceived"
            type="number"
            value={formData.operation === "credit" ? formData.amountReceived : "0"}
            onChange={handleChange}
            fullWidth
            disabled={formData.operation === "debit"}
          />

          {/* Amount Given */}
          <TextField
            label="Amount Given"
            name="amountGiven"
            type="number"
            value={formData.operation === "debit" ? formData.amountGiven : "0"}
            onChange={handleChange}
            fullWidth
            disabled={formData.operation === "credit"}
          />

          {/* Remarks */}
          <TextField
            label="Remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            fullWidth
          />

          {/* Remaining Amount Display */}
          <Typography variant="body2" color="textSecondary">
            Remaining Amount: {calculateRemainingAmount()}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" color="grey">
          Cancel
        </Button>
        <Button onClick={handleFormSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTransactionModal;