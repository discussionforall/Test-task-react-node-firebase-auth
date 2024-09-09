import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import AdminDashboard from './components/Admin/AdminDashboard';
import DealerDashboard from './components/Dealer/DealerDashboard';
import CustomerDashboard from './components/Customer/CustomerDashboard';
import PrivateRoute from './components/Auth/PrivateRoutes';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
        <Route path="/dealer" element={<PrivateRoute role="dealer"><DealerDashboard /></PrivateRoute>} />
        <Route path="/customer" element={<PrivateRoute role="customer"><CustomerDashboard /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
