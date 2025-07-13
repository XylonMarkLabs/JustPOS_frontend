import {createTheme} from "@mui/material";

const theme = createTheme({
    palette:{
        mode: "light",
        secondary:{
            main:"#FBF8EF",
            contrastText: "#FBF8EF",
        },
        primary:{
            main:"#292929",
            contrastText: "#292929",
        }
    }
})

export default theme;