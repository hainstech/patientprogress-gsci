import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { getCurrentProfile } from '../../actions/profile';
import { connect } from 'react-redux';

const ProfessionalDashboard = ({ getCurrentProfile, profile: { profile } }) => {
  useEffect(() => {
    getCurrentProfile('professional');
  }, [getCurrentProfile]);
  return <div>Professional dashboard</div>;
};

ProfessionalDashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(
  ProfessionalDashboard
);
