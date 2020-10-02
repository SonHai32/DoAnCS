import React from "react";
import {
    Grid,
    Form,
    Segment,
    Button,
    Header,
    Message,
    Icon,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import md5 from "md5";

import background from '../../Asset/background/loginBG.png'




class Register extends React.Component {
    state = {
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errors: [],
        loading: false,
        usersRef: firebase.database().ref("users"),
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleRegisterSubmit = (event) => {
        /// preventDefault() của đối tượng event được sử dụng để ngăn chặn xử lý mặc định của trình duyệt khi xảy ra sự kiện.
        event.preventDefault();


        if (this.isFormValid()) {
            /// set loading to true => display loading wheel
            this.setState({ errors: [], loading: true });
            /// register with email and password in firebase
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then((createdUser) => {

                    var emailHashToMD5 = md5(createdUser.user.email);
                    createdUser.user
                        .updateProfile({
                            displayName: this.state.username,
                            photoURL:
                                "https://www.gravatar.com/avatar/" +
                                emailHashToMD5 +
                                "?d=identicon",
                        })
                        .then(() => {
                            this.saveUser(createdUser).then(() => {
                                this.setState({ loading: false });
                            });
                        })
                        .catch((err) => {
                            this.setState({
                                errors: this.state.errors.concat(err),
                                loading: false,
                            });
                        });
                })
                .catch((err) => {
                    console.error(err);
                    this.setState({
                        errors: this.state.errors.concat(err),
                        loading: false,
                    });
                });
        }
    };

    

    handleInputError = (errors, inputName) => {
        return errors.some((error) =>
            error.message.toLowerCase().includes(inputName)
        )
            ? "error"
            : "";
    };

    ///
    /// check everything is vaild
    ///
    isFormValid = () => {
        let error;
        let errors = [];
        if (this.isFormEmpty(this.state)) {
            error = { message: "Please fill all the fields" };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else if (!this.passwordValid(this.state)) {
            error = { message: "Password is invalid" };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else {
            this.setState({ errors: [] });
            return true;
        }
    };
    
    ///
    /// check empty input
    ///

    isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return (
            !username.length ||
            !email.length ||
            !password.length ||
            !passwordConfirmation.length
        );
    };
    
    ///
    ///check valid Password
    ///
    passwordValid = ({ password, passwordConfirmation }) => {
        if (password.length < 6 || passwordConfirmation.length < 6) {
            return false;
        } else if (password !== passwordConfirmation) {
            return false;
        } else {
            return true;
        }
    };
    ///
    ///Save user to database-firebase if success full register
    ///
    saveUser = (createdUser) => {
        return this.state.usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL,
            email: createdUser.user.email
        });
    };
    displayError = (errors) => errors.map((i) => <p key={i}> {i.message} </p>);

    render() {
        const {
            username,
            email,
            password,
            passwordConfirmation,
            errors,
            loading,
        } = this.state;
        const myStyle ={
            mainContainer:{
                backgroundImage: `url('${background}')`,
                backgroundPosition: 'right',
                backgroundSize: 'cover',
                height: '100vh'
            }
        }
        return (
            <Grid textAlign="center" style={{height: '100vh'}}  verticalAlign="middle" className="app"  >
                {/* <Grid.Row style={{backgroundImage: `url('${background}')`}}> */}
                <Grid.Row style={myStyle.mainContainer} >
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" icon color="purple" textAlign="center">
                        <Icon name="paw" color="purple" />
            Đăng Ký {" "}
                    </Header>{" "}
                    <Form size="large" onSubmit={this.handleRegisterSubmit}>
                        <Segment stacked>
                            <Form.Input
                                fluid
                                name="username"
                                icon="user"
                                iconPosition="left"
                                placeholder="Tên tài khoản"
                                type="text"
                                onChange={this.handleChange}
                                value={username}
                            />
                            <Form.Input
                                fluid
                                name="email"
                                icon="mail"
                                iconPosition="left"
                                placeholder="Địa chỉ email"
                                type="text"
                                onChange={this.handleChange}
                                value={email}
                                className={this.handleInputError(errors, "email")}
                            />
                            <Form.Input
                                fluid
                                name="password"
                                icon="lock"
                                iconPosition="left"
                                placeholder="Mật khẩu"
                                type="password"
                                onChange={this.handleChange}
                                value={password}
                                className={this.handleInputError(errors, "password")}
                            />
                            <Form.Input
                                name="passwordConfirmation"
                                icon="repeat"
                                iconPosition="left"
                                placeholder="Nhập lại mật khẩu"
                                type="password"
                                onChange={this.handleChange}
                                value={passwordConfirmation}
                                className={this.handleInputError(errors, "password")}
                            />
                            <Button
                                disabled={loading}
                                className={loading ? "Đợi xíu nhé  ..." : ""}
                                color="purple"
                                fluid
                                size="large"
                            >
                                Đăng ký
              </Button>{" "}
<Message>
                                Bạn đã có tài khoản ? <Link to="/Login"> Đăng nhập </Link>{" "}
                            </Message>{" "}
                 
                            {errors.length > 0 && (
                                <Message color="red">
                                    <h3> Error </h3> {this.displayError(errors)}{" "}
                                </Message>
                            )}
                            
                        </Segment>{" "}
                    </Form>{" "}
                </Grid.Column>{" "}
</Grid.Row>
            </Grid>
        );
    }
}

export default Register;
