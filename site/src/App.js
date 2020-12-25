import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
  
import Menu from './Menu';
import Admin from './Admin';
import Auth from './pages/Auth/Auth'

function App() {
    return (
        <div>
            <Router>
                <Switch>
                    <Route path="/admin">
                        <Admin />
                    </Route>
                    <Route path="/">
                        <Menu />
                    </Route>
                    <Route path='/register'>
                        <Auth />
                    </Route>
                    <Route path='/login'>
                        <Auth />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
