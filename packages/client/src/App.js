import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';

import { loadUser, logout } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

// Routing
import MainRouter from './routing/MainRouter';

// Redux
import { Provider } from 'react-redux';
import store from './store';

// Style
import './assets/css/material-dashboard-react.css?v=1.10.0';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

// Logout user when server responds with a 401
axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
  if (
    err.response.status === 401 ||
    err.response.data.message === '401 Unauthorized'
  ) {
    store.dispatch(logout());
  }
  return Promise.reject(err);
});

const App = () => {
  useEffect(() => {
    // runs at every mount of a component
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/" component={MainRouter} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
