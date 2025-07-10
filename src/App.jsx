import './App.css'
import {ThemeProvider} from "@mui/material";
import Theme from "./Theme/Theme.js";
import Navbar from './Components/Navbar.jsx';
import CashierView from './Cashier/CashierView.jsx';
import Login from './Auth/Login.jsx';


function App() {
  return (
    <ThemeProvider theme={Theme}>
      {/* <Navbar/> */}
      <Login/>
      {/* <CashierView/> */}
    </ThemeProvider>
  )
}

export default App
