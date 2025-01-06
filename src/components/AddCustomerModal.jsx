import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

const AddCustomerModal = ({ open, handleClose, handleSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = () => {
    handleSubmit(formData);
    setFormData({ name: "", phone: "" }); 
    handleClose(); 
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="add-customer-modal">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Add New Customer
        </Typography>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" color="grey" onClick={handleClose}>
            Close
          </Button>
          <Button variant="contained" color="primary" onClick={onSubmit}>
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddCustomerModal;
