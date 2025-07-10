import {createTheme} from "@mui/material";

const theme = createTheme({
    palette:{
        mode: "light",
        primary:{
            main:"#FBF8EF",
            contrastText: "#292929",
        },
        secondary:{
            main:"#292929",
            contrastText: "#FBF8EF",
        }
    }
})

export default theme;