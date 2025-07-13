import "./App.css";
import { ThemeProvider } from "@mui/material";
import Theme from "./Theme/Theme.js";
import Navbar from "./Components/Navbar.jsx";
import CashierView from "./Cashier/CashierView.jsx";
import Login from "./Auth/Login.jsx";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cashier" element={<CashierView />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
