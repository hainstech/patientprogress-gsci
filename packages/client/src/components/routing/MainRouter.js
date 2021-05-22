import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import Register from '../../components/auth/Register';
import Login from '../../components/auth/Login';
import Alert from '../../components/layout/Alert';
import About from '../../components/About';

import Professional from './Professional';
import ProfessionalRoute from './ProfessionalRoute';
import Patient from './Patient';
import PatientRoute from './PatientRoute';
import Admin from './Admin';
import AdminRoute from './AdminRoute';

const MainRouter = (props) => {
  return (
    <div>
      <Switch>
        <>
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
                    <PatientRoute path='/patient' component={Patient} />
                    <ProfessionalRoute
                      path='/professional'
                      component={Professional}
                    />
                    <AdminRoute path='/admin' component={Admin} />
                  </Switch>
                </div>
              </div>
            </div>
          </div>
        </>
      </Switch>
    </div>
  );
};

MainRouter.propTypes = {};

export default MainRouter;
