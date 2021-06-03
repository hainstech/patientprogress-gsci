import React from 'react';
import { useTranslation } from 'react-i18next';

import GridContainer from '../components/Grid/GridContainer';
import GridItem from '../components/Grid/GridItem.js';
import Card from '../components/Card/Card.js';
import CardHeader from '../components/Card/CardHeader.js';
import CardBody from '../components/Card/CardBody.js';

import { makeStyles } from '@material-ui/core/styles';
import styles from '../assets/jss/material-dashboard-react/views/dashboardStyle';
const useStyles = makeStyles(styles);

const About = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color='danger'>
              <h4 className={classes.cardTitleWhite}>
                {t('guest.about.title')}
              </h4>
            </CardHeader>
            <CardBody>
              <p>{t('guest.about.p1')}</p>
              <p>
                <b>{t('guest.about.features')}:</b>
              </p>
              <p>{t('guest.about.patient')}</p>
              <ul>
                <li>{t('guest.about.patient1')}</li>
                <li>{t('guest.about.patient2')}</li>
                <li>{t('guest.about.patient3')}</li>
              </ul>
              <p>{t('guest.about.professional')}</p>
              <ul>
                <li>{t('guest.about.professional1')}</li>
                <li>{t('guest.about.professional2')}</li>
                <li>{t('guest.about.professional3')}</li>
                <li>{t('guest.about.professional4')}</li>
                <li>{t('guest.about.professional5')}</li>
              </ul>
              <p>{t('guest.about.researcher')}</p>
              <ul>
                <li>{t('guest.about.researcher1')}</li>
                <li>{t('guest.about.researcher2')}</li>
              </ul>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default About;
