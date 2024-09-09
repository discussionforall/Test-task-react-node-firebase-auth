import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from './firebaseConfig'; // Firestore instance

// Function to login users
export const login = async (email, password) => {
    try {
        // Check if the login is for an admin
        if (email === process.env.REACT_APP_ADMIN_EMAIL && password === process.env.REACT_APP_ADMIN_PASSWORD) {
            return {
                email,
                role: 'admin'
            };
        }

        // Check if the user is a dealer
        let userData = await checkUserInCollection('dealers', email, password);
        if (userData) {
            return userData;
        }

        // Check if the user is a customer
        userData = await checkUserInCollection('customers', email, password);
        if (userData) {
            return userData;
        }

        // If no user was found, throw an error
        throw new Error("Invalid credentials");
    } catch (error) {
        throw new Error(error.message);
    }
};

// Helper function to check user credentials in a specified collection
const checkUserInCollection = async (collectionName, email, password) => {
    try {
        const usersRef = collection(db, collectionName);
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();

            // Check if the password matches
            if (userData.password === password) {
                return {
                    email: userData.email,
                    role: collectionName // Returns 'dealers' or 'customers'
                };
            }
        }

        return null;
    } catch (error) {
        throw new Error("Error checking user in collection: " + error.message);
    }
};
