import './App.css'
import {ThemeProvider} from "@mui/material";
import Theme from "./Theme/Theme.js";
import Navbar from './Components/Navbar.jsx';


function App() {
  return (
    <ThemeProvider theme={Theme}>
      <Navbar/>
    </ThemeProvider>
  )
}

export default App
