import React from 'react';
import { useTranslation } from 'react-i18next';
import Faq from 'react-faq-component';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import GridContainer from '../components/Grid/GridContainer';
import GridItem from '../components/Grid/GridItem.js';
import Card from '../components/Card/Card.js';
import CardHeader from '../components/Card/CardHeader.js';
import CardBody from '../components/Card/CardBody.js';

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
            <CardHeader color="danger">
              <Typography variant="h5" className={classes.cardTitleWhite}>
                PatientProgress
                {process.env.REACT_APP_BETA && ' - BETA VERSION'}
              </Typography>
            </CardHeader>
            <CardBody>
              {process.env.REACT_APP_BETA && (
                <div>
                  <h5>Warning: This is the Beta version of PatientProgress</h5>
                  <h5>
                    <a href="https://app.patientprogress.ca">Click here</a> to
                    access the latest stable version.
                  </h5>
                  <br />
                </div>
              )}
              <Typography variant="subtitle1">{t('guest.about.p1')}</Typography>
              <br />
              <Typography variant="subtitle1">{t('guest.about.p2')}</Typography>
              <br />
              <Typography variant="h5">{t('guest.about.sub1')}</Typography>

              <Typography variant="body1">{t('guest.about.p3')}</Typography>
              <br />
              <Typography variant="h5">{t('guest.about.sub2')}</Typography>

              <Typography variant="body1">{t('guest.about.p4')}</Typography>
              <br />
              <Typography variant="h5">{t('guest.about.sub3')}</Typography>

              <Typography variant="body1">{t('guest.about.p5')}</Typography>
              <br />
              <Faq
                data={{
                  title: 'FAQ',
                  rows: [
                    {
                      title: t('guest.about.q1'),
                      content: t('guest.about.r1'),
                    },
                    {
                      title: t('guest.about.q2'),
                      content: t('guest.about.r2'),
                    },
                    {
                      title: t('guest.about.q3'),
                      content: t('guest.about.r3'),
                    },
                    {
                      title: t('guest.about.q4'),
                      content: (
                        <>
                          {t('guest.about.r4')}
                          <a
                            href="https://github.com/hainsdominic/patientprogress"
                            target="_blank"
                            rel="noopener norefer"
                          >
                            PatientProgress
                          </a>
                        </>
                      ),
                    },
                  ],
                }}
              />
              <br />
              <Typography variant="body2">{t('guest.about.email')}</Typography>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default About;
