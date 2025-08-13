// App.jsx
import './App.css';
import { ThemeProvider } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Theme from './Theme/Theme.js';
import Navbar from './Components/Navbar.jsx';
import AlertProvider from './Components/AlertProvider.jsx';
import AuthProvider, { AuthContext } from './Services/AuthContext.jsx';
import AuthService from './Services/AuthService.jsx';
import Login from './Auth/Login.jsx';
import CashierView from './Cashier/CashierView.jsx';
import ProductManagement from './Products/ProductManagement.jsx';
import Orders from './Orders/Orders.jsx';
import UserManagement from './User Management/UserManagement.jsx';
import Reports from './Reports/Reports.jsx';
import AdminDashboard from './Dashboard/AdminDashboard.jsx';
import ManagerDashboard from './Dashboard/ManagerDashboard.jsx';
import withAuth from './Services/WithAuth.jsx';
import { useContext } from 'react';

const ProtectedCashierView = withAuth(CashierView);
const ProtectedProductManagement = withAuth(ProductManagement);
const ProtectedOrders = withAuth(Orders);
const ProtectedUserManagement = withAuth(UserManagement);
const ProtectedReports = withAuth(Reports);
const ProtectedAdminDashboard = withAuth(AdminDashboard);
const ProtectedManagerDashboard = withAuth(ManagerDashboard);

function AppContent() {
  const { isAuthenticated } = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // Function to redirect based on user role
  const getHomePage = () => {
    switch (role) {
      case 'Admin':
        return <Navigate to="/admin/dashboard" />;
      case 'Manager':
        return <Navigate to="/manager/dashboard" />;
      case 'Cashier':
        return <Navigate to="/cashier" />;
    }
  };

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={getHomePage()} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedAdminDashboard />} />
        <Route path="/user-management" element={<ProtectedUserManagement />} />
        
        {/* Manager Routes */}
        <Route path="/manager/dashboard" element={<ProtectedManagerDashboard />} />
        
        {/* Common Routes */}
        <Route path="/cashier" element={<ProtectedCashierView />} />
        <Route path="/products" element={<ProtectedProductManagement />} />
        <Route path="/orders" element={<ProtectedOrders />} />
        <Route path="/reports" element={<ProtectedReports />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={Theme}>
        <AlertProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </AlertProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
