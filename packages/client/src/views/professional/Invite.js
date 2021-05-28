import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { invitePatient } from '../../actions/professional';

function Invite({ invitePatient }) {
  const { register, handleSubmit } = useForm();
  const { t } = useTranslation();

  const onSubmit = ({ email }) => {
    invitePatient(email);
  };

  return (
    <Fragment>
      <div className='row'>
        <div className='col-10 mx-auto'>
          <div className='card'>
            <div className='card-header card-header-danger'>
              <h4 className='card-title'>{t('professional.invite.title')}</h4>
            </div>
            <div className='card-body'>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='row'>
                  <div className='col-md-12'>
                    <div className='form-group'>
                      <label className='bmd-label-static'>
                        {t('professional.invite.email')}
                      </label>
                      <input
                        type='text'
                        className='form-control'
                        name='email'
                        {...register('email')}
                      />
                    </div>
                    <button type='submit' className='btn btn-danger'>
                      {t('professional.invite.submit')}
                    </button>
                    <div className='clearfix'></div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

Invite.propTypes = {
  invitePatient: PropTypes.func.isRequired,
};

export default connect(null, {
  invitePatient,
})(Invite);
