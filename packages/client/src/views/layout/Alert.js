import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AddAlert from '@material-ui/icons/AddAlert';
import Snackbar from '../../components/Snackbar/Snackbar.js';

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    <Snackbar
      key={alert.id}
      place="br"
      color={alert.alertType}
      icon={AddAlert}
      message={alert.msg}
      open
    />
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
