import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import About from './components/About';

import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

// Routing
import Professional from './components/routing/Professional';
import Patient from './components/routing/Patient';
import Admin from './components/routing/Admin';

// Redux
import { Provider } from 'react-redux';
import store from './store';

// Style
import './css/material-dashboard.min.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    // runs at every mount of a component
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <div className='wrapper'>
            <Sidebar />
            <div className='main-panel'>
              <Navbar />
              <div className='content'>
                <div className='container-fluid'>
                  <div className='row'>
                    <div className='col-10 mx-auto'>
                      <Alert />
                    </div>
                  </div>
                  <Switch>
                    <Route exact path='/' component={About} />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/register/:id' component={Register} />
                    {/* User-type routes */}
                    <Route path='/patient' component={Patient} />
                    <Route path='/professional' component={Professional} />
                    <Route path='/admin' component={Admin} />
                  </Switch>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
