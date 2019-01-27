import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';

// Various material-ui-next components
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

// Icon imports
import Lock from '@material-ui/icons/Lock';
import AccountBox from '@material-ui/icons/AccountBox';
import Face from '@material-ui/icons/Face';
import SupervisorAccount from '@material-ui/icons/SupervisorAccount';
import Email from '@material-ui/icons/Email';

// Component for registration page
export class RegisterPage extends React.Component {
    constructor(props) {
        super(props);

        // Initialise state
        this.state = {
            firstname: '',
            lastname: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            type: 'employee',
            firstnameInvalid: false,
            lastnameInvalid: false,
            usernameInvalid: false,
            emailInvalid: false,
            passwordInvalid: false
        };
        // Bind functions
        this.setInput = this.setInput.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.register = this.register.bind(this);
    }

    // When new props are received
    componentWillReceiveProps(newProps) {
        // Set new props
        this.props = newProps;

        // If user registration was successful, redirect
        const { user, history } = this.props;
        if (user && user.status === 'success') {
            history.push('/auth/success');
        }
    }

    // Function for setting this.state on component change
    setInput(inputName, event) {
        this.setState({
            [inputName]: event.target.value,
            [inputName + 'Invalid']: false
        });
    }

    // Function for setting password fields
    setPassword(inputName, event) {
        let { password, confirmPassword } = this.state;

        // Set the fields
        if (inputName === 'password') {
            this.setState({ password: event.target.value });
            password = event.target.value;
        } else if (inputName === 'confirmPassword') {
            this.setState({ confirmPassword: event.target.value });
            confirmPassword = event.target.value;
        }

        // If the 2 passwords don't match
        if (confirmPassword !== '' && confirmPassword !== password) {
            this.setState({ passwordInvalid: true });
        } else {
            this.setState({ passwordInvalid: false });
        }
    }

    // Handles onClick of registration button
    register(e) {
        // Prevent form submission (which will navigate away from the page)
        e.preventDefault();

        // Extract function from props
        const { userRegister } = this.props;
        // Extract input from state
        const {
            firstname,
            lastname,
            username,
            email,
            confirmPassword,
            password,
            type
        } = this.state;

        // Validate input
        let error = false;
        if (firstname === '') {
            this.setState({ firstnameInvalid: true });
            error = true;
        }
        if (lastname === '') {
            this.setState({ lastnameInvalid: true });
            error = true;
        }
        if (username === '') {
            this.setState({ usernameInvalid: true });
            error = true;
        }
        if (email === '') {
            this.setState({ emailInvalid: true });
            error = true;
        }
        if (password === '' || confirmPassword !== password) {
            this.setState({ passwordInvalid: true });
            error = true;
        }
        if (error) {
            return false;
        }

        userRegister({ firstname, lastname, username, email, password, type });
    }

    render() {
        const {
            firstnameInvalid,
            lastnameInvalid,
            emailInvalid,
            usernameInvalid,
            passwordInvalid
        } = this.state;

        return (
            <Card>
                <Helmet title="Register" />
                <div id="register">
                    {/* Heading */}
                    <Typography variant="h3" id="register-heading">
                        Register
                    </Typography>

                    <form>
                        {/* Name fields */}
                        <Grid container spacing={8}>
                            <Grid item>
                                <TextField
                                    className="flex"
                                    id="firstname"
                                    placeholder="First Name"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Face />
                                            </InputAdornment>
                                        )
                                    }}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    value={this.state.firstname}
                                    error={firstnameInvalid}
                                    onChange={e =>
                                        this.setInput('firstname', e)
                                    }
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    className="flex"
                                    id="lastname"
                                    placeholder="Last Name"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SupervisorAccount />
                                            </InputAdornment>
                                        )
                                    }}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    value={this.state.lastname}
                                    error={lastnameInvalid}
                                    onChange={e => this.setInput('lastname', e)}
                                />
                            </Grid>
                        </Grid>

                        {/* Username */}
                        <TextField
                            id="username"
                            placeholder="Username"
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
                            margin="normal"
                            className="flex"
                            value={this.state.username}
                            error={usernameInvalid}
                            onChange={e => this.setInput('username', e)}
                        />
                        {/* Email */}
                        <TextField
                            id="email"
                            placeholder="Email"
                            type="email"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email />
                                    </InputAdornment>
                                )
                            }}
                            InputLabelProps={{
                                shrink: true
                            }}
                            margin="normal"
                            className="flex"
                            value={this.state.email}
                            error={emailInvalid}
                            onChange={e => this.setInput('email', e)}
                        />

                        {/* Password fields */}
                        <TextField
                            id="password"
                            placeholder="Password"
                            type="password"
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
                            margin="normal"
                            className="flex"
                            value={this.state.password}
                            error={passwordInvalid}
                            onChange={e => this.setPassword('password', e)}
                        />
                        <TextField
                            id="confirmpassword"
                            placeholder="Confirm Password"
                            type="password"
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
                            margin="normal"
                            className="flex"
                            value={this.state.confirmPassword}
                            error={passwordInvalid}
                            onChange={e =>
                                this.setPassword('confirmPassword', e)
                            }
                        />

                        {/* Employee Type field */}
                        <FormControl className="flex" margin="normal">
                            <InputLabel htmlFor="employee-type">
                                I am a{' '}
                            </InputLabel>
                            <Select
                                value={this.state.type}
                                onChange={e => this.setInput('type', e)}
                                input={<Input name="type" id="employee-type" />}
                            >
                                <MenuItem value="employee">employee</MenuItem>
                                <MenuItem value="contractor">
                                    contractor
                                </MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className="authButton"
                            onClick={e => this.register(e)}
                        >
                            Continue
                        </Button>
                    </form>

                    {/* Additional actions */}
                    <Typography variant="body2">
                        Already have an account?{' '}
                        <Link className="visible-link" to={'/auth/login'}>
                            Login
                        </Link>{' '}
                        here!
                    </Typography>
                </div>
            </Card>
        );
    }
}

// Define props
RegisterPage.propTypes = {
    user: PropTypes.object,
    history: PropTypes.object.isRequired,
    userRegister: PropTypes.func.isRequired
};
export default withRouter(RegisterPage);
