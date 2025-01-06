import { doc, collection, addDoc, updateDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const addDailyTransaction = async (dtData) => {
  try {
    const transactionsRef = collection(db, "dt");

    const newTransaction = {
      operation: dtData.operation || "unknown",
      status: dtData.status || "successful",
      amount: dtData.amount || 0,
      name: dtData.name || "",
      remarks: dtData.remarks || "",
      dateTime: new Date().toISOString(),
    };

    const transactionRef = await addDoc(transactionsRef, newTransaction);
    console.log("Daily Transaction added with ID:", transactionRef.id);

    return transactionRef.id;
  } catch (error) {
    console.error("Error adding daily transaction:", error);
    throw error;
  }
};

export const fetchDt = async () => {
  try {
    const dtRef = collection(db, "dt");
    const querySnapshot = await getDocs(dtRef);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  } catch (error) {
    console.error("Error fetching daily transactions:", error);
  }
};

export const deleteDt = async (dtId) => {
  try {
    const dtRef = doc(db, "dt", dtId);
    await deleteDoc(dtRef);
    console.log("Daily Transaction deleted successfully!");
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

export const updateDt = async (dtId, updatedData) => {
  try {
    const dtRef = doc(db,"dt", dtId);
    await updateDoc(dtRef, updatedData);
    console.log("Daily Transaction updated successfully!");
  } catch (error) {
    console.error("Error updating daily transaction:", error);
    throw error;
  }
};

