import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getCurrentProfile } from '../../actions/profile';
import { connect } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';

import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem.js';
import Card from '../../components/Card/Card.js';
import CardBody from '../../components/Card/CardBody.js';
import Button from '../../components/CustomButtons/Button.js';
import CallIcon from '@material-ui/icons/Call';

const Questionnaires = ({ getCurrentProfile, profile: { profile } }) => {
  useEffect(() => {
    if (!profile) getCurrentProfile('patient');
  }, [getCurrentProfile, profile]);
  return (
    <Fragment>
      {profile === null ? (
        <Spinner />
      ) : (
        <GridContainer justify='center'>
          <GridItem xs={12} md={10}>
            <Card profile>
              <CardBody profile>
                <h6>{profile.professional.clinic}</h6>
                <h4>{profile.professional.name}</h4>
                <p>{profile.professional.description}</p>
                <Button
                  color='danger'
                  round
                  justIcon
                  href={`tel:${profile.professional.phone}`}
                >
                  <CallIcon />
                </Button>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
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
