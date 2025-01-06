import React, { useState } from "react";
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

const AddDtModal = ({ open, handleClose, handleSubmit }) => {
  const [formData, setFormData] = useState({
    operation: "credit",
    status: "successful",
    amount: "",
    name: "",
    remarks: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = () => {
    handleSubmit(formData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Transaction</DialogTitle>
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
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            fullWidth
          />

          {/* Name */}
          <TextField
            label="Transaction Name"
            name="name"
            multiline
            rows={3}
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />

          {/* Remarks */}
          <TextField
            label="Remarks"
            name="remarks"
            multiline
            rows={3}
            value={formData.remarks}
            onChange={handleChange}
            fullWidth
          />

        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="grey" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleFormSubmit} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDtModal;