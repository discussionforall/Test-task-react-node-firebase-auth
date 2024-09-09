import React, { useState, useEffect } from "react";
import { db } from "../../services/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { Typography, TextField, List, ListItem, Box } from "@mui/material";
import Sidebar from "../Sidebar/Sidebar";
import CustomButton from "../Buttons/CustomButton";
import DeleteButton from "../Buttons/DeleteButton";

const DealerDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [editCustomerId, setEditCustomerId] = useState(null);
  const [editCustomerName, setEditCustomerName] = useState("");
  const [editCustomerEmail, setEditCustomerEmail] = useState("");
  const [dealerId, setDealerId] = useState(null);
  const [activeSection, setActiveSection] = useState("customers");
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);

  // Get dealer's ID based on the stored email
  useEffect(() => {
    const fetchDealerId = async () => {
      const storedEmail = localStorage.getItem("dealerEmail");
      if (storedEmail) {
        const q = query(
          collection(db, "dealers"),
          where("email", "==", storedEmail)
        );
        const dealerSnapshot = await getDocs(q);
        if (!dealerSnapshot.empty) {
          const dealerData = dealerSnapshot.docs[0];
          setDealerId(dealerData.id);
          localStorage.setItem("dealerId", dealerData.id);
        }
      }
    };
    fetchDealerId();
  }, []);

  // Fetch customers for the logged-in dealer
  useEffect(() => {
    const fetchCustomers = async () => {
      if (dealerId) {
        const q = query(
          collection(db, "customers"),
          where("dealerId", "==", dealerId)
        );
        const customerSnapshot = await getDocs(q);
        const customerList = customerSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCustomers(customerList);
      }
    };
    fetchCustomers();
  }, [dealerId]);

  // Add a new customer with validation and update state
  const addCustomer = async () => {
    if (newCustomerEmail.trim() === "" || newCustomerName.trim() === "") {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const newCustomerRef = await addDoc(collection(db, "customers"), {
        email: newCustomerEmail,
        name: newCustomerName,
        password: "12345", // Default password
        dealerId: dealerId, // Use logged-in dealer's ID
      });

      // Update the local state without refreshing
      setCustomers((prevCustomers) => [
        ...prevCustomers,
        {
          id: newCustomerRef.id,
          email: newCustomerEmail,
          name: newCustomerName,
          dealerId: dealerId,
        },
      ]);

      setNewCustomerEmail("");
      setNewCustomerName("");
      alert("Customer added successfully!");
      setShowAddCustomerForm(false); // Close form after adding customer
    } catch (error) {
      console.error("Error adding customer: ", error);
    }
  };

  // Edit a customer (name and email) and update state
  const updateCustomer = async (id) => {
    if (editCustomerName.trim() === "" || editCustomerEmail.trim() === "") {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const customerDoc = doc(db, "customers", id);
      await updateDoc(customerDoc, {
        name: editCustomerName,
        email: editCustomerEmail,
      });

      // Update the local state without refreshing
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === id
            ? { ...customer, name: editCustomerName, email: editCustomerEmail }
            : customer
        )
      );

      setEditCustomerId(null);
      setEditCustomerName("");
      setEditCustomerEmail("");
      alert("Customer updated successfully!");
    } catch (error) {
      console.error("Error updating customer: ", error);
    }
  };

  // Delete a customer and update state
  const deleteCustomer = async (id) => {
    try {
      await deleteDoc(doc(db, "customers", id));

      // Update the local state without refreshing
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer.id !== id)
      );

      alert("Customer deleted successfully!");
    } catch (error) {
      console.error("Error deleting customer: ", error);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Use Sidebar Component */}
      <Sidebar setActiveSection={setActiveSection} />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dealer Dashboard
        </Typography>

        {/* Conditional rendering based on the active section */}
        {activeSection === "customers" && (
          <>
            {/* Add Customer or Edit Customer form */}
            {showAddCustomerForm || editCustomerId ? (
              <Box sx={{ marginBottom: 3 }}>
                {editCustomerId ? (
                  <>
                    <Typography variant="h6">Edit Customer</Typography>
                    <TextField
                      label="Customer Name"
                      variant="outlined"
                      value={editCustomerName}
                      onChange={(e) => setEditCustomerName(e.target.value)}
                      sx={{ marginRight: 2 }}
                    />
                    <TextField
                      label="Customer Email"
                      variant="outlined"
                      value={editCustomerEmail}
                      onChange={(e) => setEditCustomerEmail(e.target.value)}
                      sx={{ marginRight: 2 }}
                    />
                    <CustomButton
                      variant="contained"
                      color="primary"
                      onClick={() => updateCustomer(editCustomerId)}
                      sx={{ marginRight: 2 }}
                    >
                      Save
                    </CustomButton>
                    <CustomButton
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        setEditCustomerId(null);
                        setEditCustomerName("");
                        setEditCustomerEmail("");
                      }}
                    >
                      Cancel
                    </CustomButton>
                  </>
                ) : (
                  <>
                    <Typography variant="h6">Add Customer</Typography>
                    <TextField
                      label="Customer Name"
                      variant="outlined"
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                      sx={{ marginRight: 2 }}
                    />
                    <TextField
                      label="Customer Email"
                      variant="outlined"
                      value={newCustomerEmail}
                      onChange={(e) => setNewCustomerEmail(e.target.value)}
                      sx={{ marginRight: 2 }}
                    />
                    <CustomButton
                      variant="contained"
                      color="primary"
                      onClick={addCustomer}
                      sx={{ marginRight: 2 }}
                    >
                      Add Customer
                    </CustomButton>
                    <CustomButton
                      variant="contained"
                      color="secondary"
                      onClick={() => setShowAddCustomerForm(false)}
                    >
                      Cancel
                    </CustomButton>
                  </>
                )}
              </Box>
            ) : (
              <>
                {/* Show Add Customer Button */}
                <Box sx={{ marginBottom: 3 }}>
                  <CustomButton
                    variant="contained"
                    color="primary"
                    onClick={() => setShowAddCustomerForm(true)}
                  >
                    Add Customer
                  </CustomButton>
                </Box>

                {/* Customer List */}
                <Typography variant="h6">Customer List</Typography>
                <List>
                  {customers.map((customer) => (
                    <ListItem
                      key={customer.id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        backgroundColor: "#f5f5f5",
                        marginBottom: 1,
                        padding: 2,
                      }}
                    >
                      <span>
                        {customer.name} - {customer.email}
                      </span>
                      <Box>
                        <CustomButton
                          variant="contained"
                          color="secondary"
                          sx={{ marginRight: 2 }}
                        >
                          Subscription
                        </CustomButton>
                        <CustomButton
                          variant="outlined"
                          onClick={() => {
                            setEditCustomerId(customer.id);
                            setEditCustomerName(customer.name);
                            setEditCustomerEmail(customer.email);
                          }}
                          sx={{ marginRight: 2 }}
                        >
                          Edit
                        </CustomButton>
                        <DeleteButton
                          variant="contained"
                          color="error"
                          onClick={() => deleteCustomer(customer.id)}
                        >
                          Delete
                        </DeleteButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default DealerDashboard;
