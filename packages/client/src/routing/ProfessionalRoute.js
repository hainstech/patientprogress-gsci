import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../components/Spinner/Spinner';

const ProfessionalRoute = ({
  component: Component,
  auth: { isAuthenticated, loading, type },
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      loading ? (
        <Spinner />
      ) : isAuthenticated && type === 'professional' ? (
        <Component {...props} />
      ) : (
        <Redirect to='/login' />
      )
    }
  />
);

ProfessionalRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ProfessionalRoute);
