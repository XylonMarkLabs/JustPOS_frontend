// App.jsx
import './App.css';
import { ThemeProvider } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import withAuth from './Services/WithAuth.jsx';
import { useContext } from 'react';

const ProtectedCashierView = withAuth(CashierView);
const ProtectedProductManagement = withAuth(ProductManagement);
const ProtectedOrders = withAuth(Orders);
const ProtectedUserManagement = withAuth(UserManagement);
const ProtectedReports = withAuth(Reports);

function AppContent() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedCashierView />} />
        <Route path="/products" element={<ProtectedProductManagement />} />
        <Route path="/orders" element={<ProtectedOrders />} />
        <Route path="/reports" element={<ProtectedReports />} />
        <Route path="/user-management" element={<ProtectedUserManagement />} />
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
