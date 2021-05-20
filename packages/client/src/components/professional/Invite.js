import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';

import { invitePatient } from '../../actions/professional';

function Invite({ invitePatient }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = ({ email }) => {
    invitePatient(email);
  };

  return (
    <Fragment>
      <div className='row'>
        <div className='col-10 mx-auto'>
          <div className='card'>
            <div className='card-header card-header-danger'>
              <h4 className='card-title'>Invite a new patient by email</h4>
            </div>
            <div className='card-body'>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='row'>
                  <div className='col-md-12'>
                    <div className='form-group'>
                      <label className='bmd-label-floating'>Email</label>
                      <input
                        type='text'
                        className='form-control'
                        name='email'
                        {...register('email')}
                      />
                    </div>
                    <button type='submit' className='btn btn-danger'>
                      Send
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
