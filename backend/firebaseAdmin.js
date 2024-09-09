// firebaseAdmin.js
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(require('./firebaseAdminSDK.json')),
    databaseURL: "https://video-surveillance-dashboard.firebaseio.com"
});

// Export the initialized admin instance
module.exports = admin;
