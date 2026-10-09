import './App.css';
import { useContext, useEffect, useState } from 'react';
import { ThemeProvider, CircularProgress, Box, Typography, Button } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Theme from './Theme/Theme.js';
import Navbar from './Components/Navbar.jsx';
import AlertProvider from './Components/AlertProvider.jsx';
import AuthProvider, { AuthContext } from './Services/AuthContext.jsx';
import { baseURL } from './Services/ApiCall';
import Login from './Auth/Login.jsx';
import InitialAdminSetup from './Auth/InitialAdminSetup.jsx';
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

const fetchSetupStatus = async () => {
  const response = await axios.get(`${baseURL}/setup/status`, { withCredentials: true });
  return Boolean(response.data?.setupRequired);
};

let adminExistsCache = false;

const CenteredSpinner = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress sx={{ color: '#b0a892' }} />
  </Box>
);

function SetupGate() {
  // 'checking' | 'setup' | 'login' | 'error'
  const [status, setStatus] = useState(adminExistsCache ? 'login' : 'checking');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (adminExistsCache) return;

    let cancelled = false;
    setStatus('checking');

    fetchSetupStatus()
      .then((setupRequired) => {
        if (cancelled) return;
        if (!setupRequired) adminExistsCache = true;
        setStatus(setupRequired ? 'setup' : 'login');
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('Error checking setup status:', error);
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  if (status === 'checking') return <CenteredSpinner />;

  if (status === 'error') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          gap: 2,
          px: 3,
          textAlign: 'center',
        }}
      >
        <Typography sx={{ color: '#374151', fontSize: { xs: '0.95rem', sm: '1.05rem' } }}>
          We couldn't reach the server to check your system status.
        </Typography>
        <Button
          variant="contained"
          onClick={() => setAttempt((a) => a + 1)}
          sx={{
            backgroundColor: '#292929',
            color: '#FBF8EF',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#1a1a1a' },
          }}
        >
          Try again
        </Button>
      </Box>
    );
  }

  return status === 'setup' ? <InitialAdminSetup /> : <Login />;
}

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
    return <CenteredSpinner />;
  }

  return (
    <>
      {isAuthenticated && location.pathname.startsWith('/cashier') && <Navbar />}
      <Routes>
        {/* "/" shows either first-time admin setup or Login, depending on
            whether the backend reports that an admin already exists. */}
        <Route path="/" element={<SetupGate />} />
        {/* InitialAdminSetup redirects here on success / already-set-up.
            Bounce to "/" so SetupGate re-checks and renders Login. */}
        <Route path="/login" element={<Navigate to="/" replace />} />
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