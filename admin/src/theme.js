import { createMuiTheme } from '@material-ui/core/styles';

// Define theme colours
const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#222223',
            main: '#55968f'
        },
        secondary: {
            light: '#9C8459',
            main: '#30677E',
            contrastText: '#ffffff'
        }
    }
});

export default theme;
