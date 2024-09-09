// Firebase configuration
const admin = require('firebase-admin');
const serviceAccount = require('../firebaseAdminSDK.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://video-surveillance-dashboard.firebaseio.com"
});
const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };
