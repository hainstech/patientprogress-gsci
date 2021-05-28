import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getCurrentProfile } from '../../actions/profile';
import { connect } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';
import { useTranslation } from 'react-i18next';

const QuestionnaireList = ({ getCurrentProfile, profile: { profile } }) => {
  useEffect(() => {
    if (!profile) getCurrentProfile('patient');
  }, [getCurrentProfile, profile]);

  const { t } = useTranslation();

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
                  {t('patient.questionnaireList.title')}
                </h4>
                <p className='card-category'>
                  {t('patient.questionnaireList.description')}
                </p>
              </div>

              <div className='card-body'>
                <div className='tab-content'>
                  <div className='tab-pane active' id='profile'>
                    <table className='table'>
                      <tbody>
                        {profile.questionnairesToFill.length > 0 ? (
                          profile.questionnairesToFill.map(
                            (questionnaire, index) => (
                              <tr key={index}>
                                <td> {questionnaire.title} </td>
                                <td className='td-actions text-right'>
                                  <button
                                    type='button'
                                    title='Fill'
                                    className='btn btn-primary btn-link btn-sm'
                                  >
                                    <Link
                                      to={`/patient/questionnaires/${questionnaire._id}`}
                                    >
                                      <i className='material-icons'>edit</i>
                                    </Link>
                                  </button>
                                </td>
                              </tr>
                            )
                          )
                        ) : (
                          <tr className='text-center'>
                            <td>
                              <p>
                                Thank you, all the required questionnaires are
                                filled.
                              </p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

QuestionnaireList.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(
  QuestionnaireList
);
