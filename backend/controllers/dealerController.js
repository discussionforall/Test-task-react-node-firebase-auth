const { db } = require('../config/firebaseConfig');

// Get all dealers
const getDealers = async (req, res) => {
    try {
        const dealersSnapshot = await db.collection('dealers').get();
        const dealers = dealersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(dealers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dealers' });
    }
};

// Add a new dealer
const addDealer = async (req, res) => {
    const { email, name } = req.body;

    try {
        const dealerRef = await db.collection('dealers').add({ email, name, password: '12345' });
        res.json({ id: dealerRef.id, message: 'Dealer added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add dealer' });
    }
};

// Update dealer
const updateDealer = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        await db.collection('dealers').doc(id).update({ name });
        res.json({ message: 'Dealer updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update dealer' });
    }
};

// Delete dealer
const deleteDealer = async (req, res) => {
    const { id } = req.params;

    try {
        await db.collection('dealers').doc(id).delete();
        res.json({ message: 'Dealer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete dealer' });
    }
};

module.exports = { getDealers, addDealer, updateDealer, deleteDealer };
