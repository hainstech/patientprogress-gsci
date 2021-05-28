import React, { Fragment, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { editProfile, getCurrentProfile } from '../../actions/profile';
import Spinner from '../../components/Spinner/Spinner';

const Preferences = ({
  profile: { profile, loading },
  editProfile,
  getCurrentProfile,
  history,
}) => {
  const { reset, register, handleSubmit } = useForm();
  const { t } = useTranslation();

  useEffect(() => {
    if (!profile) getCurrentProfile('professional');
    if (!loading && profile) {
      reset({
        name: !profile.name ? '' : profile.name,
        language: !profile.language ? '' : profile.language,
        clinic: !profile.clinic ? '' : profile.clinic,
        description: !profile.description ? '' : profile.description,
        phone: !profile.phone ? '' : profile.phone,
      });
    }
  }, [loading, getCurrentProfile, profile, reset]);

  const onSubmit = async (data) => {
    await editProfile('professional', data, history);
    await getCurrentProfile('professional');
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
                <h4 className='card-title'>
                  {t('professional.preferences.title')}
                </h4>
                <p className='card-category'>
                  {t('professional.preferences.description')}
                </p>
              </div>
              <div className='card-body'>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className='row'>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label className='bmd-label-static'>
                          {t('professional.preferences.name')}
                        </label>
                        <input
                          {...register('name')}
                          type='text'
                          className='form-control'
                          name='name'
                        />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label className='bmd-label-static'>
                          {t('professional.preferences.clinic')}
                        </label>
                        <input
                          {...register('clinic')}
                          type='text'
                          className='form-control'
                          name='clinic'
                        />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label className='bmd-label-static'>
                          {t('professional.preferences.phone')}
                        </label>
                        <input
                          {...register('phone')}
                          type='text'
                          className='form-control'
                          name='phone'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-12'>
                      <div className='form-group'>
                        <label className='bmd-label-static'>
                          {t('professional.preferences.yourDescription')}
                        </label>
                        <div className='form-group'>
                          <textarea
                            {...register('description')}
                            type='text'
                            className='form-control'
                            name='description'
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label className='bmd-label-static'>
                          {t('professional.preferences.language')}
                        </label>
                        <select
                          {...register('language')}
                          type='text'
                          name='language'
                          className='form-control'
                        >
                          <option value='fr'>Français</option>
                          <option value='en'>English</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <button type='submit' className='btn btn-danger pull-right'>
                    {t('professional.preferences.submit')}
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

Preferences.propTypes = {
  editProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { editProfile, getCurrentProfile })(
  withRouter(Preferences)
);
