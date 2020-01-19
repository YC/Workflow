import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Theme/style imports
import './index.css';
import theme from './theme';
import {
    MuiThemeProvider,
    createGenerateClassName,
    jssPreset
} from '@material-ui/core/styles';
import { JssProvider } from 'react-jss';
import { create } from 'jss';

// Primary component imports
import Main from './components/main/Main';
import Auth from './components/auth/Auth';
import Redirect from './components/misc/Redirect';
import Status from './components/status';

// Define JSS insertion point
// Adapted from:
// https://material-ui.com/customization/css-in-js/#css-injection-order
const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
jss.options.insertionPoint = document.getElementById('jss-insertion-point');

// Main App component
class App extends React.Component {
    render() {
        return (
            <JssProvider Jss={jss} generateClassName={generateClassName}>
                <MuiThemeProvider theme={theme}>
                    {/* Define router for navigation and primary paths */}
                    <BrowserRouter>
                        <Switch>
                            <Route path="/auth" component={Auth} />.
                            <Route path="/api" component={Redirect} />
                            <Route path="/admin" component={Redirect} />
                            <Route path="/" component={Main} />
                        </Switch>
                    </BrowserRouter>
                    {/* Define status component */}
                    <Status />
                </MuiThemeProvider>
            </JssProvider>
        );
    }
}

export default App;
