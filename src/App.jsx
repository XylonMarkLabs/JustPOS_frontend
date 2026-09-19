import './App.css';
import { ThemeProvider, CircularProgress, Box } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Theme from './Theme/Theme.js';
import Navbar from './Components/Navbar.jsx';
import AlertProvider from './Components/AlertProvider.jsx';
import AuthProvider, { AuthContext } from './Services/AuthContext.jsx';
import Login from './Auth/Login.jsx';
import BusinessLogin from './Auth/BusinessLogin.jsx';
import BusinessRegister from './Auth/BusinessRegister.jsx';
import CashierView from './Cashier/CashierView.jsx';
import ProductManagement from './Products/ProductManagement.jsx';
import CategoryManagement from './Categories/CategoryManagement.jsx';
import Orders from './Orders/Orders.jsx';
import UserManagement from './User Management/UserManagement.jsx';
import Reports from './Reports/Reports.jsx';
import AdminDashboard from './Dashboard/AdminDashboard.jsx';
import ManagerDashboard from './Dashboard/ManagerDashboard.jsx';
import withAuth from './Services/WithAuth.jsx';
import { useContext } from 'react';
import StockManagement from './Stock Management/StockManagement.jsx';
import SupplierManagement from './Supplier Manament/SupplierManagement.jsx';
import DiscountManagement from './Discount/DiscountManagement.jsx';

const ProtectedCashierView = withAuth(CashierView);
const ProtectedProductManagement = withAuth(ProductManagement, ['Admin', 'Manager']);
const ProtectedCategoryManagement = withAuth(CategoryManagement, ['Admin', 'Manager']);
const ProtectedOrders = withAuth(Orders, ['Admin', 'Manager']);
const ProtectedUserManagement = withAuth(UserManagement, ['Admin']);
const ProtectedReports = withAuth(Reports, ['Admin', 'Manager']);
const ProtectedAdminDashboard = withAuth(AdminDashboard, ['Admin']);
const ProtectedManagerDashboard = withAuth(ManagerDashboard, ['Manager']);
const ProtectedStockManagement = withAuth(StockManagement, ['Admin', 'Manager']);
const ProtectedSupplierManagement = withAuth(SupplierManagement, ['Admin', 'Manager']);
const ProtectedDiscountManagement = withAuth(DiscountManagement, ['Admin', 'Manager']);

function AppContent() {
  const { isAuthenticated, authLoading, user } = useContext(AuthContext);
  const location = useLocation();
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
      default:
        return <Navigate to="/" />;
    }
  };

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#b0a892' }} />
      </Box>
    );
  }

  return (
    <>
      {isAuthenticated && location.pathname.startsWith('/cashier') && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={getHomePage()} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedAdminDashboard />} />
        <Route path="/user-management" element={<ProtectedUserManagement />} />
        
        {/* Manager Routes */}
        <Route path="/manager/dashboard" element={<ProtectedManagerDashboard />} />
        
        {/* Common Routes */}
        <Route path="/cashier" element={<ProtectedCashierView />} />
        <Route path="/products" element={<ProtectedProductManagement />} />
        <Route path="/categories" element={<ProtectedCategoryManagement />} />
        <Route path="/orders" element={<ProtectedOrders />} />
        <Route path="/stock" element={<ProtectedStockManagement />} />
        <Route path="/suppliers" element={<ProtectedSupplierManagement />} />
        <Route path="/discounts" element={<ProtectedDiscountManagement />} />
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