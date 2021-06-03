import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../components/Spinner/Spinner';

const PatientRoute = ({
  component: Component,
  auth: { isAuthenticated, loading, type },
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      loading ? (
        <Spinner />
      ) : isAuthenticated && type === 'patient' ? (
        <Component {...props} />
      ) : (
        <Redirect to='/login' />
      )
    }
  />
);

PatientRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PatientRoute);
