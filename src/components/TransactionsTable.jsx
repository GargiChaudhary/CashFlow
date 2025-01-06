import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import AddTransactionModal from "./AddTransactionModal";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { addTransaction, fetchTransactions } from "../firebase/transactionServices";

const TransactionsTable = ({ customerId }) => {
  

  return (
    <>
      
      
    </>
  );
};

export default TransactionsTable;