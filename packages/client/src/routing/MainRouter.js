import React, { useEffect, Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
// core components
import Navbar from '../components/Navbars/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import Footer from '../components/Footer/Footer';
import Spinner from '../components/Spinner/Spinner';

import styles from '../assets/jss/material-dashboard-react/layouts/adminStyle.js';

import bgImage from '../assets/img/sidebar.jpg';
import logo from '../assets/img/sidebar-logo.png';

import ProfessionalRoute from './ProfessionalRoute';
import PatientRoute from './PatientRoute';
import AdminRoute from './AdminRoute';

import About from '../views/About';
import Login from '../views/auth/Login';
import Register from '../views/auth/Register';
import Forgot from '../views/auth/Forgot';
import NewPassword from '../views/auth/NewPassword';

import Privacy from '../views/misc/Privacy';
import Terms from '../views/misc/Terms';

import {
  patientLinks,
  professionalLinks,
  guestLinks,
  adminLinks,
} from './routes';

const Patient = lazy(() => import('./Patient'));
const Professional = lazy(() => import('./Professional'));
const Admin = lazy(() => import('./Admin'));

const useStyles = makeStyles(styles);

const MainRouter = ({
  auth: { isAuthenticated, loading, type },
  profile: { profile, loading: ploading },
  ...rest
}) => {
  // styles
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const { i18n } = useTranslation();
  useEffect(() => {
    //get language from state profile
    if (!loading && isAuthenticated && !ploading && profile) {
      i18n.changeLanguage(profile.language);
    }
  }, [isAuthenticated, loading, profile, ploading, i18n]);

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={
          isAuthenticated
            ? type === 'patient'
              ? patientLinks
              : type === 'professional'
              ? professionalLinks
              : type === 'admin'
              ? adminLinks
              : guestLinks
            : guestLinks
        }
        logoText={'PatientProgress'}
        logo={logo}
        image={bgImage}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={'red'}
        {...rest}
      />
      <div className={classes.mainPanel}>
        <Navbar
          routes={
            isAuthenticated
              ? type === 'patient'
                ? patientLinks
                : type === 'professional'
                ? professionalLinks
                : type === 'admin'
                ? adminLinks
                : guestLinks
              : guestLinks
          }
          type={
            isAuthenticated
              ? type === 'patient'
                ? 'patient'
                : type === 'professional'
                ? 'professional'
                : type === 'admin'
                ? 'admin'
                : 'guest'
              : 'guest'
          }
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        <div className={classes.content}>
          <div className={classes.container}>
            <Suspense fallback={<Spinner />}>
              <Switch>
                <Route exact path="/" component={About} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register/:id" component={Register} />
                <Route exact path="/forgot" component={Forgot} />
                <Route exact path="/privacy" component={Privacy} />
                <Route exact path="/terms" component={Terms} />
                <Route
                  exact
                  path="/forgot/:id/:token"
                  component={NewPassword}
                />
                {/* User-type routes */}
                <PatientRoute path="/patient" component={Patient} />
                <ProfessionalRoute
                  path="/professional"
                  component={Professional}
                />
                <AdminRoute path="/admin" component={Admin} />
              </Switch>
            </Suspense>
          </div>
        </div>
        <Footer />
      </div>
    </div>
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
