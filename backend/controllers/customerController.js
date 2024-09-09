const { db } = require('../config/firebaseConfig');

// Get customers by dealerId
const getCustomers = async (req, res) => {
    const { dealerId } = req.user; // Assume dealerId is part of user's decoded token

    try {
        const customerSnapshot = await db.collection('customers').where('dealerId', '==', dealerId).get();
        const customers = customerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
};

// Add a new customer
const addCustomer = async (req, res) => {
    const { email, name } = req.body;
    const { dealerId } = req.user;

    try {
        const customerRef = await db.collection('customers').add({
            email,
            name,
            password: '12345',
            dealerId,
        });
        res.json({ id: customerRef.id, message: 'Customer added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add customer' });
    }
};

// Update customer
const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        await db.collection('customers').doc(id).update({ name });
        res.json({ message: 'Customer updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update customer' });
    }
};

// Delete customer
const deleteCustomer = async (req, res) => {
    const { id } = req.params;

    try {
        await db.collection('customers').doc(id).delete();
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete customer' });
    }
};

module.exports = { getCustomers, addCustomer, updateCustomer, deleteCustomer };
