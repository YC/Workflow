// Define theme for material-ui
// Derived from https://material-ui-next.com/customization/themes
import { createMuiTheme } from '@material-ui/core/styles';

// Define theme
const theme = createMuiTheme({
    // Colours for theme
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
    },

    // -------------------------------------------------
    // Styling of fonts
    typography: {
        // Defining all the font families
        fontFamily: 'Lato, Roboto, Bitter, sans-serif',
        fontDefaultWeight: 400,
        useNextVariants: true,

        // Define variants Typography variants
        h1: {
            fontFamily: 'Roboto, Arial, sans-serif',
            fontWeight: 300,
            fontSize: 12,
            color: '#757575'
        },

        // Overriding styling for h2
        h2: {
            fontFamily: 'Lato, sans-serif',
            fontWeight: 600,
            fontSize: 50,
            color: '#757575'
        },

        // Overriding styling for h3
        h3: {
            fontFamily: 'Lato, sans-serif',
            fontWeight: 600,
            fontSize: 38,
            color: '#757575'
        },

        // Overriding styling for h4
        h4: {
            fontFamily: 'Lato, sans-serif',
            fontWeight: 500,
            fontSize: 30,
            color: '#757575'
        },

        // Overriding styling for h6
        h6: {
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 500,
            //fontStyle: 'bold',
            fontSize: 20,
            color: '#757575'
        },

        // Overriding styling for subtitle1
        subtitle1: {
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 500,
            fontStyle: 'bold',
            fontSize: 18
        },

        // button styling
        button: {
            fontFamily: 'Bitter, serif',
            fontWeight: 400
        },

        // Overriding styling for body2
        body2: {
            fontFamily: 'Roboto, Arial, sans-serif',
            fontWeight: 300,
            fontSize: 14
        },

        // Overriding styling for body1
        body1: {
            fontFamily: 'Roboto, Arial, sans-serif',
            fontWeight: 300,
            fontSize: 14,
            fontHeight: 1.5,
            color: 'rgba(0, 0, 0, 0.87)'
        }
    },

    // Overrides
    overrides: {
        // Adornment Icon
        MuiInputAdornment: {
            root: {
                color: '#A8A8A8;'
            }
        },

        // Avatar
        MuiAvatar: {
            root: {
                fontFamily: 'Bitter, serif'
            }
        },

        // Card
        MuiCard: {
            root: {
                margin: '16px 0'
            }
        },

        // List Item Text
        MuiListItemText: {
            root: {
                fontSize: 14,
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                color: '#757575'
            }
        },

        // Form control
        MuiFormControl: {
            root: {
                display: 'flex'
            }
        },

        // Tab
        MuiTab: {
            root: {
                '@media (min-width: 600px)': {
                    minWidth: 'inherit'
                }
            }
        }
    }
});

export default theme;
