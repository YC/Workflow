// Defines theme for Team avatar tiles
// Derived from https://material-ui-next.com/customization/themes
import { createMuiTheme } from '@material-ui/core/styles';

const AvatarTheme = createMuiTheme({
    // Edit the margins of the team avatars
    overrides: {
        MuiAvatar: {
            root: {
                right: '8px',
                fontFamily: 'Bitter',
                margin: '-6px 0'
            }
        }
    }
});
export default AvatarTheme;
