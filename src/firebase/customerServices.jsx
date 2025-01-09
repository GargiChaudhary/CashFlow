import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const addCustomer = async (customerData) => {
  try {
    const newCustomer = {
      name: customerData.name,
      phone: customerData.phone,
      number_of_transactions: 0,
      outstanding: 0,
    };

    const customerRef = await addDoc(collection(db, "customers"), newCustomer);
    console.log("Customer added with ID:", customerRef.id);

    return customerRef.id;
  } catch (error) {
    console.error("Error adding customer:", error);
    throw error;
  }
};

export const fetchCustomers = async () => {
  try {
    const customersCollection = collection(db, "customers");
    const snapshot = await getDocs(customersCollection);
    const customersData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return customersData;
  } catch (error) {
    console.error("Error fetching customers:", error);
    setLoading(false);
  }
};

export const deleteCustomer = async (customerId) => {
  try {
    const customerDoc = doc(db, "customers", customerId);
    await deleteDoc(customerDoc);
    console.log(`Customer with ID ${customerId} has been deleted.`);
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};

export const updateCustomer = async (customerId, updatedData) => {
  try {
    const customerRef = doc(db, "customers", customerId);
    await updateDoc(customerRef, updatedData);
    console.log("Customer updated with ID:", customerId);
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

export async function updateOutstanding(customerId, outstandingValue) {
  try {
    const customerRef = doc(db, `customers/${customerId}`);

    await updateDoc(customerRef, {
      outstanding: outstandingValue,
    });

    console.log("Outstanding field updated successfully!");
  } catch (error) {
    console.error("Error updating the outstanding field: ", error);
  }
}