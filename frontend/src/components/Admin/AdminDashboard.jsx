// AdminDashboard.js
import React, { useState, useEffect, useCallback } from "react";
import { db } from "../../services/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { TextField, List, ListItem, Typography, Box } from "@mui/material";
import Sidebar from "../Sidebar/Sidebar";
import CustomButton from "../Buttons/CustomButton";
import DeleteButton from "../Buttons/DeleteButton";

const AdminDashboard = () => {
  const [dealers, setDealers] = useState([]);
  const [newDealer, setNewDealer] = useState({ name: "", email: "" });
  const [editDealer, setEditDealer] = useState({
    id: null,
    name: "",
    email: "",
  });
  const [showAddDealerForm, setShowAddDealerForm] = useState(false);

  const [errors, setErrors] = useState({ name: false, email: false });

  // Fetch dealers from Firestore
  const fetchDealers = useCallback(async () => {
    try {
      const dealersCollection = collection(db, "dealers");
      const dealerSnapshot = await getDocs(dealersCollection);
      const dealerList = dealerSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDealers(dealerList);
    } catch (error) {
      console.error("Error fetching dealers: ", error);
    }
  }, []);

  useEffect(() => {
    fetchDealers();
  }, [fetchDealers]);

  const validateFields = () => {
    const newErrors = {
      email: !newDealer.email,
      name: !newDealer.name,
    };
    setErrors(newErrors);
    return !newErrors.email && !newErrors.name;
  };

  const addDealer = async () => {
    if (validateFields()) {
      try {
        await addDoc(collection(db, "dealers"), {
          email: newDealer.email,
          name: newDealer.name,
          password: "12345", // Default password
        });
        setNewDealer({ email: "", name: "" });
        setShowAddDealerForm(false);
        fetchDealers();
        alert("Dealer added successfully!");
      } catch (error) {
        console.error("Error adding dealer: ", error);
      }
    }
  };

  const updateDealer = async (id) => {
    if (editDealer.name && editDealer.email) {
      try {
        await updateDoc(doc(db, "dealers", id), {
          name: editDealer.name,
          email: editDealer.email,
        });
        setEditDealer({ id: null, name: "", email: "" });
        fetchDealers();
        alert("Dealer updated successfully!");
      } catch (error) {
        console.error("Error updating dealer: ", error);
      }
    }
  };

  const deleteDealer = async (id) => {
    try {
      await deleteDoc(doc(db, "dealers", id));
      fetchDealers();
      alert("Dealer deleted successfully!");
    } catch (error) {
      console.error("Error deleting dealer: ", error);
    }
  };

  const cancelEdit = () => {
    setEditDealer({ id: null, name: "", email: "" });
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Use Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        <Box sx={{ marginBottom: 3 }}>
          <CustomButton
            variant="contained"
            color="primary"
            onClick={() => {
              setShowAddDealerForm(!showAddDealerForm);
              setEditDealer({ id: null, name: "", email: "" });
            }}
          >
            {showAddDealerForm ? "Close Form" : "Add Dealer"}
          </CustomButton>
        </Box>

        {showAddDealerForm && !editDealer.id && (
          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="h6">Add Dealer</Typography>
            <TextField
              label="Dealer Name"
              variant="outlined"
              value={newDealer.name}
              onChange={(e) =>
                setNewDealer((prev) => ({ ...prev, name: e.target.value }))
              }
              sx={{ marginRight: 2 }}
              error={errors.name}
              helperText={errors.name ? "Dealer Name is required" : ""}
            />
            <TextField
              label="Dealer Email"
              variant="outlined"
              value={newDealer.email}
              onChange={(e) =>
                setNewDealer((prev) => ({ ...prev, email: e.target.value }))
              }
              sx={{ marginRight: 2 }}
              error={errors.email}
              helperText={errors.email ? "Dealer Email is required" : ""}
            />
            <CustomButton
              variant="contained"
              color="primary"
              onClick={addDealer}
            >
              Add Dealer
            </CustomButton>
          </Box>
        )}

        {editDealer.id && (
          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="h6">Edit Dealer</Typography>
            <TextField
              label="Dealer Name"
              variant="outlined"
              value={editDealer.name}
              onChange={(e) =>
                setEditDealer((prev) => ({ ...prev, name: e.target.value }))
              }
              sx={{ marginRight: 2 }}
            />
            <TextField
              label="Dealer Email"
              variant="outlined"
              value={editDealer.email}
              onChange={(e) =>
                setEditDealer((prev) => ({ ...prev, email: e.target.value }))
              }
              sx={{ marginRight: 2 }}
            />
            <CustomButton
              variant="contained"
              color="primary"
              onClick={() => updateDealer(editDealer.id)}
              sx={{ marginRight: 2 }}
            >
              Save
            </CustomButton>
            <CustomButton
              variant="contained"
              color="secondary"
              onClick={cancelEdit}
            >
              Cancel
            </CustomButton>
          </Box>
        )}

        {!showAddDealerForm && !editDealer.id && (
          <>
            {dealers.length === 0 ? (
              <Typography variant="body1">No dealers found.</Typography>
            ) : (
              <Typography variant="h6">Dealer List</Typography>
            )}
            <List>
              {dealers.map((dealer) => (
                <ListItem
                  key={dealer.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: "#f5f5f5",
                    marginBottom: 1,
                    padding: 2,
                  }}
                >
                  <>
                    <span>
                      {dealer.name} - {dealer.email}
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
                        variant="contained"
                        onClick={() =>
                          setEditDealer({
                            id: dealer.id,
                            name: dealer.name,
                            email: dealer.email,
                          })
                        }
                        sx={{ marginRight: 2 }}
                      >
                        Edit
                      </CustomButton>
                      <DeleteButton
                        variant="contained"
                        color="error"
                        onClick={() => deleteDealer(dealer.id)}
                      >
                        Delete
                      </DeleteButton>
                    </Box>
                  </>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
