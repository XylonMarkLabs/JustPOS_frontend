import './App.css'
import {ThemeProvider} from "@mui/material";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Theme from "./Theme/Theme.js";
import Navbar from './Components/Navbar.jsx';
import Sidebar from './Components/Sidebar.jsx';
import CashierView from './Cashier/CashierView.jsx';
import Login from './Auth/Login.jsx';
import ProductManagement from './Products/ProductManagement.jsx';
import Orders from './Orders/Orders.jsx';
import UserManagement from './User Management/UserManagement.jsx';
import Reports from './Reports/Reports.jsx';
import { useEffect, useState } from 'react';
import AlertProvider from './Components/AlertProvider.jsx';
import AuthService from './Services/AuthService.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (AuthService.isTokenExpired()) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider theme={Theme}>
        <AlertProvider>
            {isLoggedIn && <Navbar />}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<CashierView />} />
              <Route path="/products" element={<ProductManagement />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/user-management" element={<UserManagement />} />
            </Routes>
        </AlertProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App