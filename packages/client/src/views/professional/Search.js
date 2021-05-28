import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import DayJS from 'react-dayjs';
import { useTranslation } from 'react-i18next';

import { getCurrentProfile } from '../../actions/profile';
import Spinner from '../../components/Spinner/Spinner';
import { Link } from 'react-router-dom';

function Search({ profile: { profile, loading }, getCurrentProfile }) {
  useEffect(() => {
    if (!profile) getCurrentProfile('professional');
  }, [profile, getCurrentProfile, loading]);

  const { t } = useTranslation();

  const [queried, setQueried] = useState(false);

  const [results, setResults] = useState([]);

  const { register, handleSubmit } = useForm();

  const onSubmit = ({ query }) => {
    // Affiche les patients correspondants au query
    if (query.length > 0) {
      setResults(
        profile.patients.filter(({ name }) => name.indexOf(query) !== -1)
      );
      setQueried(true);
    }
  };

  return (
    <Fragment>
      {profile === null ? (
        <Spinner />
      ) : (
        <div className='row'>
          <div className='col-10 mx-auto'>
            <div className='card'>
              <div className='card-header card-header-danger'>
                <h4 className='card-title'>{t('professional.search.title')}</h4>
                <div className='input-group no-border'>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    style={{ width: '100%' }}
                  >
                    <input
                      {...register('query')}
                      type='text'
                      className='form-control'
                      placeholder={t('professional.search.placeholder')}
                      name='query'
                      id='searchPatient'
                      autoComplete='off'
                    />
                    <button
                      type='submit'
                      className='btn btn-white btn-round btn-just-icon'
                    >
                      <i className='material-icons'>search</i>
                      <div className='ripple-container'></div>
                    </button>
                  </form>
                </div>
              </div>
              <div className='card-body table-responsive'>
                {queried &&
                  (results.length > 0 ? (
                    <table className='table table-hover'>
                      <thead className='text-danger'>
                        <tr>
                          <th>{t('professional.search.name')}</th>
                          <th>{t('professional.search.dob')}</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map(({ _id, name, dob }) => (
                          <tr key={_id}>
                            <td>{name}</td>
                            <td>
                              <DayJS format='YYYY/MM/DD'>{dob}</DayJS>
                            </td>
                            <td>
                              <Link
                                to={`/professional/patients/${_id}`}
                                className='btn btn-danger btn-sm pull-right'
                              >
                                {t('professional.search.open')}
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p style={{ textAlign: 'center', margin: '0' }}>
                      No results
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

Search.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, {
  getCurrentProfile,
})(Search);
