import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getCurrentProfile } from '../../actions/profile';
import { connect } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';
import { useTranslation } from 'react-i18next';

import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem.js';
import Card from '../../components/Card/Card.js';
import CardHeader from '../../components/Card/CardHeader.js';
import CardBody from '../../components/Card/CardBody.js';
import Button from '../../components/CustomButtons/Button.js';

import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/jss/material-dashboard-react/views/dashboardStyle';
const useStyles = makeStyles(styles);

const QuestionnaireList = ({
  getCurrentProfile,
  profile: { profile },
  history,
}) => {
  const classes = useStyles();
  useEffect(() => {
    if (!profile) getCurrentProfile('patient');
  }, [getCurrentProfile, profile]);

  const { t } = useTranslation();

  const goToQuestionnaire = (id) => {
    history.push(`/patient/questionnaires/${id}`);
  };

  return (
    <Fragment>
      {profile === null ? (
        <Spinner />
      ) : (
        <GridContainer justify='center'>
          <GridItem xs={12} md={6}>
            <Card>
              <CardHeader color='danger'>
                <h4 className={classes.cardTitleWhite}>
                  {t('patient.questionnaireList.title')}
                </h4>
                <p className={classes.cardCategoryWhite}>
                  {t('patient.questionnaireList.description')}
                </p>
              </CardHeader>
              <CardBody align='center'>
                {profile.questionnairesToFill.length > 0 ? (
                  profile.questionnairesToFill.map((questionnaire, index) => (
                    <p key={index}>
                      <Button
                        color='success'
                        onClick={() => goToQuestionnaire(questionnaire._id)}
                      >
                        {questionnaire.title}
                      </Button>
                    </p>
                  ))
                ) : (
                  <p>{t('patient.questionnaireList.empty')}</p>
                )}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
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
