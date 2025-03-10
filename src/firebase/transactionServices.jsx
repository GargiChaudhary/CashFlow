import { doc, collection, addDoc, getDoc, updateDoc, getDocs, deleteDoc } from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

// export const addTransaction = async (customerId, transactionData) => {
//   try {
//     const transactionsRef = collection(db, `customers/${customerId}/transactions`);

//     const newTransaction = {
//       operation: transactionData.operation || "unknown",
//       amount: transactionData.amount || 0,
//       amountReceived: transactionData.amountReceived ?? 0,
//       amountGiven: transactionData.amountGiven ?? 0,
//       remarks: transactionData.remarks || "",
//       dateTime: new Date().toISOString(),
//       remainingAmount: transactionData.remainingAmount ?? 0,
//     };

//     const transactionRef = await addDoc(transactionsRef, newTransaction);
//     console.log("Transaction added with ID:", transactionRef.id);

//     // Update the customer's number_of_transactions and outstanding
//     const customerRef = doc(db, "customers", customerId);

//     // Fetch all transactions for the customer to calculate the outstanding
//     const allTransactions = await getDocs(transactionsRef);
//     console.log("All transactions: ", allTransactions);
//     let totalOutstanding = 0;

//     allTransactions.forEach((doc) => {
//       const data = doc.data();
//       totalOutstanding += data.remainingAmount || 0;
//     });

//     // Update customer document
//     await updateDoc(customerRef, {
//       number_of_transactions: allTransactions.size, // Use the count of all transactions
//       outstanding: totalOutstanding,
//     });

//     return transactionRef.id;
//   } catch (error) {
//     console.error("Error adding transaction:", error);
//     throw error;
//   }
// };

export const addTransaction = async (customerId, transactionData) => {
  try {
    const transactionsRef = collection(db, `customers/${customerId}/transactions`);
    const customerRef = doc(db, "customers", customerId);

    // Fetch the current customer document to get previous outstanding
    const customerSnap = await getDoc(customerRef);
    let previousOutstanding = 0;

    if (customerSnap.exists()) {
      previousOutstanding = customerSnap.data().outstanding || 0;
    }

    // Calculate new outstanding after this transaction
    const newOutstanding = previousOutstanding + (transactionData.remainingAmount ?? 0);

    // Create new transaction entry with "outstanding till yet"
    const newTransaction = {
      operation: transactionData.operation || "unknown",
      amount: transactionData.amount || 0,
      amountReceived: transactionData.amountReceived ?? 0,
      amountGiven: transactionData.amountGiven ?? 0,
      remarks: transactionData.remarks || "",
      dateTime: new Date().toISOString(),
      remainingAmount: transactionData.remainingAmount ?? 0,
      outstandingTillYet: previousOutstanding, // Store outstanding at the time of transaction
    };

    const transactionRef = await addDoc(transactionsRef, newTransaction);
    console.log("Transaction added with ID:", transactionRef.id);

    // Fetch all transactions for the customer to update transaction count
    const allTransactions = await getDocs(transactionsRef);

    // Update customer document with new outstanding (but not outstanding till yet)
    await updateDoc(customerRef, {
      number_of_transactions: allTransactions.size, // Update transaction count
      outstanding: newOutstanding, // Update outstanding amount
    });

    return transactionRef.id;
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
};

export const fetchTransactions = async (customerId) => {
  try {
    const transactionsRef = collection(db, `customers/${customerId}/transactions`);
    const querySnapshot = await getDocs(transactionsRef);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
};

export const deleteTransaction = async (customerId, transactionId) => {
  try {
    const transactionRef = doc(db, `customers/${customerId}/transactions`, transactionId);
    await deleteDoc(transactionRef);
    console.log("Transaction deleted successfully!");
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

export const updateTransaction = async (customerId, transactionId, updatedData) => {
  try {
    const transactionRef = doc(db, `customers/${customerId}/transactions`, transactionId);
    await updateDoc(transactionRef, updatedData);
    console.log("Transaction updated successfully!");
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};