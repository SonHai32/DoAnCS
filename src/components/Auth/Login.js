import React from 'react'
import { Grid, Form, Segment, Button, Header, Message} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import firebase from '../../firebase'



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
            console.log('Sign in');
            this.setState({loading: false});
        })
        .catch(err =>{
            console.log(err);
            this.setState({errors: this.state.errors.concat(err), loading: false })
        })
        }
        else{
            let error = {message: 'Please fill all fields'};
            let  errors = [];
            this.setState({errors: errors.concat(error), loading:false})
        }
    
    }
    isFormValid = ({email, password}) => email && password;

    displayError = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)

    render() {
        const {email, password, errors, loading} = this.state;
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as="h2" icon color="orange" textAlign="center">
                        Login
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment stacked>
                            <Form.Input fluid name="email" icon="mail" iconPosition="left"
                            placeholder="Email address" type="text" onChange={this.handleChange} value={email} />
                            <Form.Input fluid name="password" icon="key" iconPosition="left"
                            placeholder="Password" type="password" onChange={this.handleChange} value={password} />
                            <Button disabled={loading} className={loading ? 'loading' : ''} fluid size="large" color="orange">Login</Button>
                            {errors.length > 0 &&(
                                <Message color="red">
                                    <h3>Error</h3>
                                    {console.log(errors)}
                                    {this.displayError(errors)}
                                </Message>
                            )}
                            <Message>
                                You don't have an account ? <Link to="/register"> Register</Link>
                            </Message>
                        </Segment>

                    </Form>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Login;