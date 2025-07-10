import './App.css'
import {Button, ThemeProvider} from "@mui/material";
import Theme from "./Theme/Theme.js";

function App() {


  return (
    <ThemeProvider theme={Theme}>

    </ThemeProvider>
  )
}

export default App
