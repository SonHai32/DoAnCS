import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
// import Login from './components/Auth/Login'
import * as serviceWorker from './serviceWorker';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


const Root = () =>(
    <Router>
        <Switch>
            <Route exact path="/" component={App} />
            <Route path="/Login" component={Login} />
            <Route path="/Register" component={Register} />
        </Switch>
    </Router>
);


ReactDOM.render( <Root /> , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();