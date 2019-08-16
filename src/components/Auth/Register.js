import React from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import firebase from '../../firebase'
import md5 from 'md5'
class Register extends React.Component {
        state = {
            username: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            errors: [],
            loading: false,
            usersRef: firebase.database().ref('users')
        };


        handleChange = event => {
            this.setState({
                [event.target.name]: event.target.value });

        };


        handleSubmit = event => {
            event.preventDefault();

            if (this.isFormValid()) {
                this.setState({ errors: [], loading: true })
                firebase
                    .auth()
                    .createUserWithEmailAndPassword(this.state.email, this.state.password)
                    .then(createdUser => {
                        console.log(createdUser)
                        var emailHashToMD5 = md5(createdUser.user.email)
                        createdUser.user.updateProfile({
                                displayName: this.state.username,
                                photoURL: 'https://www.gravatar.com/avatar/' + emailHashToMD5 + '?d=identicon'
                            })
                            .then(() => {
                                this.saveUser(createdUser).then(() => {
                                    console.log('User Saved')
                                    this.setState({ loading: false })
                                })
                            })
                            .catch(err => {
                                console.log(err)
                                this.setState({ errors: this.state.errors.concat(err), loading: false })
                            })
                    })
                    .catch(err => {
                        console.error(err);
                        this.setState({ errors: this.state.errors.concat(err), loading: false })
                    });
            }

        }

        handleInputError = (errors, inputName) => {
            return errors.some(error =>
                    error.message.toLowerCase().includes(inputName)
                ) ?
                "error" :
                ""
        }

        isFormValid = () => {
            let error;
            let errors = [];
            if (this.isFormEmpty(this.state)) {
                error = { message: 'Please fill all the fields' };
                this.setState({ errors: errors.concat(error) });
                return false;
            } else if (!this.passwordValid(this.state)) {
                error = { message: 'Password is invalid' };
                this.setState({ errors: errors.concat(error) });
                return false;
            } else {
                this.setState({ errors: [] });
                return true;
            }
        }

        isFormEmpty = ({ username, email, password, passwordConfirmation }) => {

                return !username.length || !email.length || !password.length || !passwordConfirmation.length;

            }
            // isEmailValid = ({email}) => {
            //     let emailPattern = '^[a-z][a-z0-9_\\.]{5,32}@[a-z0-9]{2,}(\\.[a-z0-9]{2,4}){1,2}$'
            //     return email.match(emailPattern);
            // }
        passwordValid = ({ password, passwordConfirmation }) => {
            if (password.length < 6 || passwordConfirmation.length < 6) {
                return false;
            } else if (password !== passwordConfirmation) {
                return false;
            } else {
                return true;
            }
        }
        saveUser = createdUser => {
            return this.state.usersRef.child(createdUser.user.uid).set({
                name: createdUser.user.displayName,
                avatar: createdUser.user.photoURL
            })
        }
        displayError = errors => errors.map((i) => < p key = { i } > { i.message } < /p>);

            render() {
                const { username, email, password, passwordConfirmation, errors, loading } = this.state;
                return ( <
                    Grid textAlign = "center"
                    verticalAlign = "middle"
                    className = "app" >
                    <
                    Grid.Column style = {
                        { maxWidth: 450 } } >
                    <
                    Header as = "h2"
                    icon color = "orange"
                    textAlign = "center" >
                    <
                    Icon name = "puzzle piece"
                    color = "orange" / >
                    Register
                    for.. <
                    /Header> <
                    Form size = "large"
                    onSubmit = { this.handleSubmit } >
                    <
                    Segment stacked >
                    <
                    Form.Input fluid name = "username"
                    icon = "user"
                    iconPosition = "left"
                    placeholder = "Username"
                    type = "text"
                    onChange = { this.handleChange }
                    value = { username }
                    />

                    <
                    Form.Input fluid name = "email"
                    icon = "mail"
                    iconPosition = "left"
                    placeholder = "Email Address"
                    type = "text"
                    onChange = { this.handleChange }
                    value = { email }
                    className = { this.handleInputError(errors, 'email') }
                    />

                    <
                    Form.Input fluid name = "password"
                    icon = "lock"
                    iconPosition = "left"
                    placeholder = "Password"
                    type = "password"
                    onChange = { this.handleChange }
                    value = { password }
                    className = { this.handleInputError(errors, 'password') }
                    />

                    <
                    Form.Input name = "passwordConfirmation"
                    icon = "repeat"
                    iconPosition = "left"
                    placeholder = "Password Confirmation"
                    type = "password"
                    onChange = { this.handleChange }
                    value = { passwordConfirmation }
                    className = { this.handleInputError(errors, 'password') }
                    />

                    <
                    Button disabled = { loading }
                    className = { loading ? 'loading' : '' }
                    color = "orange"
                    fluid size = "large" > Submit < /Button> {
                        errors.length > 0 && ( <
                            Message color = "red" >
                            <
                            h3 > Error < /h3> { this.displayError(errors) } <
                            /Message>
                        )
                    }

                    <
                    Message >
                    Already have an account ? < Link to = "/Login" > Login < /Link> <
                    /Message> <
                    /Segment> <
                    /Form> <
                    /Grid.Column> <
                    /Grid>
                );
            }
        }

        export default Register;