const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const dealerRoutes = require('./routes/dealerRoutes');
const customerRoutes = require('./routes/customerRoutes');

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON

// Routes
app.use('/auth', authRoutes);
app.use('/dealers', dealerRoutes);
app.use('/customers', customerRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
