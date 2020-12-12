import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

// Various material-ui-next component imports
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';

// Icon imports
import AccountBox from '@material-ui/icons/AccountBox';
import Lock from '@material-ui/icons/Lock';
import Logo from './logo.svg';

// Component for login page
export class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        // Initialise state
        this.state = {
            username: '',
            password: '',
            usernameInvalid: false,
            passwordInvalid: false
        };
        // Bind functions
        this.setInput = this.setInput.bind(this);
        this.login = this.login.bind(this);
    }

    // When new props are received
    // eslint-disable-next-line no-unused-vars
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user !== this.props.user) {
            // If user authentication was successful, redirect to /
            const { user, history } = this.props;
            if (user && user.status === 'success') {
                history.push('/');
            }
        }
    }

    // Set state when input is changed, Adapted from:
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/10734
    setInput(inputName, event) {
        // Update state of input and reset invalid status to false
        this.setState({
            [inputName]: event.target.value,
            [inputName + 'Invalid']: false
        });
    }

    // Handles click event of login button
    login(e) {
        // Prevent form submission (which will navigate away from the page)
        e.preventDefault();

        // Extract info from props/state
        const { userLogin } = this.props;
        const { username, password } = this.state;

        // Ensure that username/password is not empty
        let error = false;
        if (username === '') {
            this.setState({ usernameInvalid: true });
            error = true;
        }
        if (password === '') {
            this.setState({ passwordInvalid: true });
            error = true;
        }
        if (error) {
            return false;
        }

        // Perform user login
        userLogin(username, password);
    }

    render() {
        // Extract username/password and statuses from state
        const {
            username,
            password,
            usernameInvalid,
            passwordInvalid
        } = this.state;

        return (
            <Card>
                <Helmet>
                    <title>Login</title>
                </Helmet>
                <div id="login">
                    {/* Header */}
                    <div>
                        <img src={Logo} alt="App Icon" id="icon" />
                    </div>
                    <Typography variant="h3">Sign In</Typography>

                    {/* Form (username/password fields) */}
                    <form>
                        <TextField
                            placeholder="Username / Email"
                            id="user"
                            margin="normal"
                            className="flex"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountBox />
                                    </InputAdornment>
                                )
                            }}
                            InputLabelProps={{
                                shrink: true
                            }}
                            value={username}
                            error={usernameInvalid}
                            onChange={e => this.setInput('username', e)}
                        />
                        <TextField
                            placeholder="Password"
                            id="password"
                            type="password"
                            margin="normal"
                            className="flex"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock />
                                    </InputAdornment>
                                )
                            }}
                            InputLabelProps={{
                                shrink: true
                            }}
                            value={password}
                            error={passwordInvalid}
                            onChange={e => this.setInput('password', e)}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            id="authButton"
                            onClick={e => this.login(e)}
                        >
                            Continue
                        </Button>
                    </form>

                    {/* Additional actions */}
                    <Typography variant="body2">
                        Don&apos;t have an account?{' '}
                        <Link to={'/auth/register'} className="visible-link">
                            Register
                        </Link>{' '}
                        here!
                    </Typography>
                    <Typography variant="body2">
                        <Link to={'/admin'} className="visible-link">
                            Admin Login
                        </Link>
                    </Typography>
                </div>
            </Card>
        );
    }
}

// Define props
LoginPage.propTypes = {
    user: PropTypes.object,
    userLogin: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
};
export default withRouter(LoginPage);
