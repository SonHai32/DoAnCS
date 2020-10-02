import React from 'react'
import { Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import firebase from '../../firebase'

import background from '../../Asset/background/loginBG.png'

import fbSignIn from "../Auth/FacebookAuth"
import ggSignIn from "../Auth/GoogleAuth"


class Login extends React.Component {
    state = {
        email: '',
        password: '',
        errors: [],
        loading: false
    
    }
    
 

    handleChange = event =>{
        this.setState({[event.target.name]: event.target.value})
    }
    
    handleSubmit = event =>{
        event.preventDefault();
        if(this.isFormValid(this.state)){
            this.setState({errors : [], loading: true });
            firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(signinUser =>{
            this.setState({loading: false});
        })
        .catch(err =>{
            this.setState({errors: this.state.errors.concat(err), loading: false })
        })
        }
        else{
            let error = {message: 'Vui lòng nhập đủ thông tin'};
            let  errors = [];
            this.setState({errors: errors.concat(error), loading:false})
        }
    
    }
    handleFBLogin = event =>{
        event.preventDefault();
        fbSignIn();
    }
    handleGGLogin = event =>{
        event.preventDefault();
        ggSignIn();
    }
    isFormValid = ({email, password}) => email && password;

    displayError = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)

    render() {
        const {email, password, errors, loading} = this.state;

        const myStyle ={
            mainContainer:{
                backgroundImage: `url('${background}')`,
                backgroundPosition: 'right',
                backgroundSize: 'cover',
                height: '100vh'
            }
        }
        return (
            <Grid textAlign="center"  verticalAlign="middle" stretched  className="app" style={myStyle.mainContainer}>
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as="h1" icon color="purple" textAlign="center">
                        <Icon name='paw' color='purple'>

                        </Icon>
                        Đăng Nhập
                    </Header>
                        <Segment >
                    <Form size="large" onSubmit={this.handleSubmit} >
                            <Form.Input fluid name="email" icon="mail" iconPosition="left"
                            placeholder="Địa chỉ email" type="text" onChange={this.handleChange} value={email} />
                            <Form.Input fluid name="password" icon="key" iconPosition="left"
                            placeholder="Password" type="password" onChange={this.handleChange} value={password} />
                            <Button disabled={loading} className={loading ? 'loading' : ''} fluid size="large" color="purple">Login</Button>
                            
                            <Message>
                                 Bạn chưa có tài khoản đăng ký ngay ? <Link to="/register"> Đăng Ký</Link>
                            </Message>
                <Message >
                    <p>Đăng nhập bằng</p>

                <Button fluid color='facebook' onClick={this.handleFBLogin}>
                    <Icon name='facebook'></Icon>
                    Facebook
                    </Button> 
                <br></br>
                <Button  fluid color='green' onClick={this.handleGGLogin}>
                    <Icon name='google'></Icon>
                        Google
                    </Button>
                 
                 </Message>
{errors.length > 0 &&(
                                <Message color="red">
                                    <h3>Error</h3>
                                    {this.displayError(errors)}
                                </Message>
                            )}

                    </Form>
                        </Segment>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Login;