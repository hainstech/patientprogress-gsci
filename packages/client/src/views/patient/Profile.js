import React, { Fragment, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { editProfile, getCurrentProfile } from '../../actions/profile';
import Spinner from '../../components/Spinner/Spinner';

const EditProfile = ({
  profile: { profile, loading },
  editProfile,
  getCurrentProfile,
  history,
}) => {
  const { reset, register, handleSubmit } = useForm();
  const { t } = useTranslation();

  useEffect(() => {
    if (!profile) getCurrentProfile('patient');
    if (!loading && profile) {
      reset({
        name: !profile.name ? '' : profile.name,
        language: !profile.language ? '' : profile.language,
        dob: !profile.dob ? '' : profile.dob.split('T')[0],
      });
    }
  }, [loading, getCurrentProfile, profile, reset]);

  const onSubmit = async (data) => {
    await editProfile('patient', data, history);
    await getCurrentProfile('patient');
  };

  return (
    <Fragment>
      {profile === null ? (
        <Spinner />
      ) : (
        <div className='row'>
          <div className='col-md-10 mx-auto'>
            <div className='card'>
              <div className='card-header card-header-danger'>
                <h4 className='card-title'>{t('patient.profile.title')}</h4>
                <p className='card-category'>
                  {t('patient.profile.description')}
                </p>
              </div>
              <div className='card-body'>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className='row'>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label className='bmd-label-static'>
                          {t('patient.profile.name')}
                        </label>
                        <input
                          type='text'
                          className='form-control'
                          name='name'
                          {...register('name')}
                        />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label className='bmd-label-static'>
                          {t('patient.profile.language')}
                        </label>
                        <select
                          name='language'
                          className='form-control'
                          {...register('language')}
                        >
                          <option value='fr'>Français</option>
                          <option value='en'>English</option>
                        </select>
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label className='bmd-label-static'>
                          {t('patient.profile.dob')}
                        </label>
                        <input
                          className='form-control'
                          name='dob'
                          type='date'
                          {...register('dob')}
                        />
                      </div>
                    </div>
                  </div>
                  <button type='submit' className='btn btn-danger pull-right'>
                    {t('patient.profile.submit')}
                  </button>
                  <div className='clearfix'></div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

EditProfile.propTypes = {
  editProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { editProfile, getCurrentProfile })(
  withRouter(EditProfile)
);
