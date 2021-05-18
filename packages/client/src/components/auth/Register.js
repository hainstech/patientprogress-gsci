import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';

const Register = ({ setAlert, register, isAuthenticated, type, match }) => {
  const [formData, setFormData] = useState({
    name: '',
    language: '',
    gender: '',
    dob: '',
    email: '',
    password: '',
    password2: '',
    research: false,
  });

  const { name, language, gender, dob, email, password, password2, research } =
    formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      register({
        name,
        language,
        gender,
        dob,
        email,
        password,
        research,
        professional: match.params.id,
      });
    }
  };

  if (isAuthenticated && type) {
    switch (type) {
      case 'patient':
        return <Redirect to={`/patient/questionnaires`} />;
      case 'professional':
        return <Redirect to={`/professional/dashboard`} />;
      default:
        return <Redirect to={`/${type}/dashboard`} />;
    }
  }
  return (
    <div className='row'>
      <div className='col-md-5 col-sm-12 mx-auto'>
        <div className='card'>
          <div className='card-header card-header-danger'>
            <h4 className='card-title'>Register into the application</h4>
          </div>
          <div className='card-body'>
            <form onSubmit={(e) => onSubmit(e)}>
              <div className='row'>
                <div className='col-12'>
                  <div className='form-group bmd-form-group'>
                    <label className='bmd-label-static'>Nom/Name</label>
                    <input
                      name='name'
                      type='name'
                      className='form-control'
                      required
                      placeholder='John Doe'
                      value={name}
                      onChange={(e) => onChange(e)}
                    />
                  </div>
                </div>
              </div>

              <div className='row'>
                <div className='col-12'>
                  <div className='form-group bmd-form-group'>
                    <label className='bmd-label-static'>Langue/Language</label>
                    <select
                      name='language'
                      className='form-control'
                      value={language}
                      onChange={(e) => onChange(e)}
                    >
                      <option value='' defaultValue disabled>
                        Choose/Choisissez
                      </option>
                      <option value='en'>English</option>
                      <option value='fr'>Français</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className='row'>
                <div className='col-12'>
                  <div className='form-group bmd-form-group'>
                    <label className='bmd-label-static'>Genre/Gender</label>
                    <select
                      name='gender'
                      className='form-control'
                      value={gender}
                      onChange={(e) => onChange(e)}
                    >
                      <option value='' defaultValue disabled>
                        Choose/Choisissez
                      </option>
                      <option value='Male'>Homme/Male</option>
                      <option value='Female'>Femme/Female</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className='row'>
                <div className='col-12'>
                  <div className='form-group bmd-form-group'>
                    <label className='bmd-label-static'>
                      Date de Naissance/Date of Birth
                    </label>
                    <input
                      type='date'
                      className='form-control'
                      name='dob'
                      placeholder='YYYY/MM/DD'
                      value={dob}
                      onChange={(e) => onChange(e)}
                    />
                  </div>
                </div>
              </div>

              <div className='row'>
                <div className='col-12'>
                  <div className='form-group bmd-form-group'>
                    <input
                      type='email'
                      name='email'
                      className='form-control'
                      placeholder='Email'
                      value={email}
                      onChange={(e) => onChange(e)}
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
                      placeholder='Password'
                      name='password'
                      value={password}
                      onChange={(e) => onChange(e)}
                      minLength='6'
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
                      placeholder='Password'
                      name='password2'
                      value={password2}
                      onChange={(e) => onChange(e)}
                      minLength='6'
                    />
                  </div>
                </div>
              </div>

              <div className='row'>
                <div className='col-12'>
                  <div className='form-group bmd-form-group'>
                    <fieldset>
                      <label>
                        Des données anonymes de notre application peuvent être
                        utilisées à des fins de recherche. Si vous souhaitez
                        participer, veuillez cochez cette case./Anonymous data
                        from our application can be used for research purposes.
                        If you would like to participate, please check this box.
                      </label>
                      <input
                        type='checkbox'
                        name='research'
                        value={research}
                        checked={research}
                        onChange={(e) => {
                          setFormData({ ...formData, research: !research });
                        }}
                      />
                    </fieldset>
                  </div>
                </div>
              </div>

              <button type='submit' className='btn btn-danger'>
                Sumbit
              </button>
              <div className='clearfix'></div>
            </form>
            <p className='my-1'>
              Already have an account? <Link to='/login'>Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired, //ptfr
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  type: state.auth.type,
});

export default connect(mapStateToProps, { setAlert, register })(Register);
