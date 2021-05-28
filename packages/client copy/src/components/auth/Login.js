import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import { useTranslation } from 'react-i18next';

const Login = ({ login, isAuthenticated, type }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { t } = useTranslation();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
  };

  // Redirect if logged in
  if (isAuthenticated && type) {
    switch (type) {
      case 'patient':
        return <Redirect to={`/patient/questionnaires`} />;
      case 'professional':
        return <Redirect to={`/professional/patients`} />;
      case 'admin':
        return <Redirect to={`/admin/questionnaire-builder`} />;
      default:
        return <Redirect to={`/${type}/dashboard`} />;
    }
  }
  return (
    <div className='row'>
      <div className='col-md-5 col-sm-12 mx-auto'>
        <div className='card'>
          <div className='card-header card-header-danger'>
            <h4 className='card-title'>{t('guest.login.title')}</h4>
          </div>
          <div className='card-body'>
            <form onSubmit={(e) => onSubmit(e)}>
              <div className='row'>
                <div className='col-12'>
                  <div className='form-group bmd-form-group'>
                    <input
                      type='email'
                      className='form-control'
                      required
                      name='email'
                      value={email}
                      onChange={(e) => onChange(e)}
                      placeholder={t('guest.login.email')}
                    />
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-12'>
                  <div className='form-group bmd-form-group'>
                    <input
                      type='password'
                      className='form-control'
                      required
                      name='password'
                      value={password}
                      onChange={(e) => onChange(e)}
                      minLength='6'
                      placeholder={t('guest.login.password')}
                      autoComplete='on'
                    />
                  </div>
                </div>
              </div>

              <button type='submit' className='btn btn-danger'>
                {t('guest.login.submit')}
              </button>
              <div className='clearfix'></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  type: PropTypes.string,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  type: state.auth.type,
});

export default connect(mapStateToProps, { login })(Login);
