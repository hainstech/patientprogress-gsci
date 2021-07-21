import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../components/Spinner/Spinner';
import { loadUser } from '../actions/auth';

const AdminRoute = ({
  component: Component,
  auth: { isAuthenticated, loading, type },
  loadUser,
  ...rest
}) => {
  const url = window.location.pathname.split('/').pop();

  React.useEffect(() => {
    (async () => {
      await loadUser();
    })();
  }, [url, loadUser]);

  return (
    <Route
      {...rest}
      render={(props) =>
        loading ? (
          <Spinner />
        ) : isAuthenticated && type === 'admin' ? (
          <Component {...props} />
        ) : (
          <Redirect to='/login' />
        )
      }
    />
  );
};

AdminRoute.propTypes = {
  auth: PropTypes.object.isRequired,
  loadUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { loadUser })(AdminRoute);
