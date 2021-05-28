import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
// core components
import Navbar from '../components/Navbars/Navbar.js';
import Sidebar from '../components/Sidebar/Sidebar.js';

import styles from '../assets/jss/material-dashboard-react/layouts/adminStyle.js';

import bgImage from '../assets/img/sidebar.jpg';
import logo from '../assets/img/logo.svg';

import Navbar from '../components/Navbars/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';

import ProfessionalRoute from './ProfessionalRoute';
import PatientRoute from './PatientRoute';
import AdminRoute from './AdminRoute';

import {
  patientLinks,
  patientRoutes,
  professionalLinks,
  professionalRoutes,
  guestLinks,
  guestRoutes,
  adminLinks,
  adminRoutes,
} from './routes';

const switchPatient = (
  <Switch>
    {patientLinks.map(({ layout, path, component }, key) => {
      return (
        <PatientRoute path={layout + path} component={component} key={key} />
      );
    })}
    {patientRoutes.map(({ layout, path, component }, key) => {
      return (
        <PatientRoute path={layout + path} component={component} key={key} />
      );
    })}
  </Switch>
);

const switchProfessional = (
  <Switch>
    {professionalLinks.map(({ layout, path, component }, key) => {
      return (
        <ProfessionalRoute
          path={layout + path}
          component={component}
          key={key}
        />
      );
    })}
    {professionalRoutes.map(({ layout, path, component }, key) => {
      return (
        <ProfessionalRoute
          path={layout + path}
          component={component}
          key={key}
        />
      );
    })}
  </Switch>
);

const switchGuest = (
  <Switch>
    {guestLinks.map(({ layout, path, component }, key) => {
      return <Route path={layout + path} component={component} key={key} />;
    })}
    {guestRoutes.map(({ layout, path, component }, key) => {
      return <Route path={layout + path} component={component} key={key} />;
    })}
  </Switch>
);

const switchadmin = (
  <Switch>
    {adminLinks.map(({ layout, path, component }, key) => {
      return (
        <AdminRoute path={layout + path} component={component} key={key} />
      );
    })}
    {adminRoutes.map(({ layout, path, component }, key) => {
      return (
        <AdminRoute path={layout + path} component={component} key={key} />
      );
    })}
  </Switch>
);

const useStyles = makeStyles(styles);

const MainRouter = ({
  auth: { isAuthenticated, loading },
  profile: { profile, loading: ploading },
  ...rest
}) => {
  const { i18n } = useTranslation();
  useEffect(() => {
    //get language from state profile
    if (!loading && isAuthenticated && !ploading && profile) {
      i18n.changeLanguage(profile.language);
    }
  }, [isAuthenticated, loading, profile, ploading, i18n]);

  return <div></div>;
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
