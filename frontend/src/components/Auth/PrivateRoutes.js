import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ role, children }) => {
    const userRole = localStorage.getItem('userRole'); // You can store this after successful login
    return userRole === role ? children : <Navigate to="/" />;
};

export default PrivateRoute;
