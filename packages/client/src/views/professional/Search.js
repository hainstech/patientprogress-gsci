import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DayJS from 'react-dayjs';
import { useTranslation } from 'react-i18next';

import { getCurrentProfile } from '../../actions/profile';
import Spinner from '../../components/Spinner/Spinner';
import { Link } from 'react-router-dom';

import { useFormik } from 'formik';

import SearchIcon from '@material-ui/icons/Search';

import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem.js';
import Card from '../../components/Card/Card.js';
import CardHeader from '../../components/Card/CardHeader.js';
import CustomInput from '../../components/CustomInput/CustomInput';
import CardBody from '../../components/Card/CardBody.js';
import Table from '../../components/Table/Table.js';
import Button from '../../components/CustomButtons/Button.js';

import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/jss/material-dashboard-react/views/dashboardStyle';
import searchStyles from '../../assets/jss/material-dashboard-react/components/headerLinksStyle.js';
const useStyles = makeStyles(styles);
const useSearchStyles = makeStyles(searchStyles);

const Search = ({ profile: { profile, loading }, getCurrentProfile }) => {
  const classes = useStyles();
  const searchClasses = useSearchStyles();
  useEffect(() => {
    if (!profile) getCurrentProfile('professional');
  }, [profile, getCurrentProfile, loading]);

  const { t } = useTranslation();

  const [queried, setQueried] = useState(false);

  const [results, setResults] = useState([]);

  const formik = useFormik({
    initialValues: {
      query: '',
    },
    onSubmit: async ({ query }) => {
      // Affiche les patients correspondants au query
      if (query.length > 0) {
        setResults(
          //Format: [name, dob, Button]
          profile.patients
            .filter(({ name }) => name.indexOf(query) !== -1)
            .map(({ name, dob, _id }) => {
              return [
                name,
                <DayJS format='YYYY/MM/DD'>{dob}</DayJS>,
                <Link to={`/professional/patients/${_id}`}>
                  <Button color='success'>
                    {t('professional.search.open')}
                  </Button>
                </Link>,
              ];
            })
        );
        setQueried(true);
      }
    },
  });

  return (
    <Fragment>
      {profile === null ? (
        <Spinner />
      ) : (
        <GridContainer justify='center'>
          <GridItem xs={12} lg={6}>
            <Card>
              <CardHeader color='danger'>
                <h4 className={classes.cardTitleWhite}>
                  {t('professional.search.title')}
                </h4>
                <form onSubmit={formik.handleSubmit}>
                  <div className={searchClasses.searchWrapper}>
                    <CustomInput
                      formControlProps={{
                        className: searchClasses.margin,
                      }}
                      error
                      inputProps={{
                        placeholder: t('professional.search.placeholder'),
                        name: 'query',
                        inputProps: {
                          'aria-label': 'Search',
                        },
                        className: searchClasses.search,
                        value: formik.values.description,
                        onChange: formik.handleChange,
                      }}
                    />
                    <Button
                      color='white'
                      aria-label='edit'
                      justIcon
                      round
                      type='submit'
                    >
                      <SearchIcon />
                    </Button>
                  </div>
                </form>
              </CardHeader>
              <CardBody>
                {queried &&
                  (results.length > 0 ? (
                    <Table
                      tableHeaderColor='danger'
                      tableHead={[
                        t('professional.search.name'),
                        t('professional.search.dob'),
                        '',
                      ]}
                      tableData={results}
                    />
                  ) : (
                    <p style={{ textAlign: 'center', margin: '0' }}>
                      No results
                    </p>
                  ))}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      )}
    </Fragment>
  );
};

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
