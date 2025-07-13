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


function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={Theme}>
            <Navbar />
            <Routes>
              <Route path="/" element={<CashierView />} />
              <Route path="/products" element={<ProductManagement />} />
              <Route path="/orders" element={<Orders/>} />
              <Route path="/reports" element={<div>Reports Page</div>} />
            </Routes>
   
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
