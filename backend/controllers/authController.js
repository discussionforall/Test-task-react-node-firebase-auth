const { auth } = require('../config/firebaseConfig');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Firebase does not offer a direct password comparison, so handle authentication via frontend.
        // Here you could mock admin login by checking email/password manually (not recommended for production).
        if (email === 'admin@example.com' && password === '12345') {
            const token = await auth.createCustomToken('adminUid'); // Mock admin UID
            res.json({ token });
        } else {
            res.status(400).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

module.exports = { login };
