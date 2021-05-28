import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getCurrentProfile } from '../../actions/profile';
import { connect } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';

const Questionnaires = ({ getCurrentProfile, profile: { profile } }) => {
  useEffect(() => {
    if (!profile) getCurrentProfile('patient');
  }, [getCurrentProfile, profile]);
  return (
    <Fragment>
      {profile === null ? (
        <Spinner />
      ) : (
        <div className='row'>
          <div className='col-md-10 mx-auto'>
            <div className='card card-profile'>
              <div className='card-body'>
                <h6 className='card-category text-gray'>
                  {profile.professional.clinic}
                </h6>
                <h4 className='card-title'>{profile.professional.name}</h4>
                <p className='card-description'>
                  {profile.professional.description}
                </p>
                <a
                  href={`tel:${profile.professional.phone}`}
                  className='btn btn-danger btn-round'
                >
                  <i className='material-icons'>call</i>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

Questionnaires.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(Questionnaires);
