import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Helmet, HelmetProvider } from 'react-helmet-async';

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

const MainRouter = ({
  auth: { isAuthenticated, loading },
  profile: { profile, loading: ploading },
}) => {
  const { i18n } = useTranslation();
  useEffect(() => {
    //get language from state profile
    if (!loading && isAuthenticated && !ploading && profile) {
      i18n.changeLanguage(profile.language);
    }
  }, [isAuthenticated, loading, profile, ploading, i18n]);

  return (
    <HelmetProvider>
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
      {/* makes the js work in developement */}
      <Helmet>
        <script src='/js/core/jquery.min.js'></script>
        <script src='/js/core/popper.min.js'></script>
        <script src='/js/core/bootstrap-material-design.min.js'></script>
        <script src='/js/plugins/perfect-scrollbar.jquery.min.js'></script>
        <script src='/js/material-dashboard.js?v=2.1.1'></script>
      </Helmet>
    </HelmetProvider>
  );
};

MainRouter.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps)(MainRouter);
