import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

// Routing
import MainRouter from './routing/MainRouter';

// Redux
import { Provider } from 'react-redux';
import store from './store';

// Style
import './assets/css/material-dashboard-react.css?v=1.10.0';

import 'bootstrap/dist/css/bootstrap.min.css';

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
        <Switch>
          <Route path='/' component={MainRouter} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
