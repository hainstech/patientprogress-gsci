import React, { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ auth: { isAuthenticated, loading, type }, logout }) => {
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split('/');
  const { t, i18n } = useTranslation();

  const professionalLinks = (
    <ul className="nav">
      <li
        className={`nav-item ${
          splitLocation[2] === 'patients' ? 'active' : ''
        }`}
      >
        <Link className="nav-link" to={`/${type}/patients`}>
          <i className="material-icons">group</i>
          <p>{t('sidebar.professional.patients')}</p>
        </Link>
      </li>
      <li
        className={`nav-item ${splitLocation[2] === 'invite' ? 'active' : ''}`}
      >
        <Link className="nav-link" to={`/${type}/invite`}>
          <i className="material-icons">group_add</i>
          <p>{t('sidebar.professional.invite')}</p>
        </Link>
      </li>
      <li
        className={`nav-item ${
          splitLocation[2] === 'preferences' ? 'active' : ''
        }`}
      >
        <Link className="nav-link" to={`/${type}/preferences`}>
          <i className="material-icons">settings</i>
          <p>{t('sidebar.professional.preferences')}</p>
        </Link>
      </li>
      <li className="nav-item">
        <a className="nav-link" onClick={logout} href="/">
          <i className="material-icons">logout</i>
          <p>{t('sidebar.professional.logout')}</p>
        </a>
      </li>
    </ul>
  );

  const patientLinks = (
    <ul className="nav">
      <li
        className={`nav-item ${
          splitLocation[2] === 'questionnaires' ? 'active' : ''
        }`}
      >
        <Link className="nav-link" to={`/${type}/questionnaires`}>
          <i className="material-icons">quiz</i>
          <p>{t('sidebar.patient.questionnaires')}</p>
        </Link>
      </li>
      <li
        className={`nav-item ${splitLocation[2] === 'profile' ? 'active' : ''}`}
      >
        <Link className="nav-link" to={`/${type}/profile`}>
          <i className="material-icons">person</i>
          <p>{t('sidebar.patient.profile')}</p>
        </Link>
      </li>
      <li
        className={`nav-item ${
          splitLocation[2] === 'professional' ? 'active' : ''
        }`}
      >
        <Link className="nav-link" to={`/${type}/professional`}>
          <i className="material-icons">local_hospital</i>
          <p>{t('sidebar.patient.professional')}</p>
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" onClick={logout} to="/">
          <i className="material-icons">logout</i>
          <p>{t('sidebar.patient.logout')}</p>
        </Link>
      </li>
    </ul>
  );

  const adminLinks = (
    <ul className="nav">
      <li
        className={`nav-item ${
          splitLocation[2] === 'questionnaire-builder' ? 'active' : ''
        }`}
      >
        <Link className="nav-link" to={`/admin/questionnaire-builder`}>
          <i className="material-icons">quiz</i>
          <p>Questionnaire Builder</p>
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" onClick={logout} to="/">
          <i className="material-icons">logout</i>
          <p>Logout</p>
        </Link>
      </li>
    </ul>
  );

  const getOtherLang = () => {
    return i18n.language === 'en' ? 'Français' : 'English';
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
  };

  const guestLinks = (
    <ul className="nav">
      <li className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
        <Link className="nav-link" to="/">
          <i className="material-icons">info</i>
          <p>{t('sidebar.guest.about')}</p>
        </Link>
      </li>
      <li
        className={`nav-item ${splitLocation[1] === 'login' ? 'active' : ''}`}
      >
        <Link className="nav-link" to="/login">
          <i className="material-icons">login</i>
          <p>{t('sidebar.guest.login')}</p>
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" onClick={() => toggleLanguage()} to="#">
          <i className="material-icons">language</i>
          <p>{getOtherLang()}</p>
        </Link>
      </li>
    </ul>
  );
  return (
    <div
      className="sidebar"
      data-color="danger"
      data-background-color="white"
      data-image="/img/sidebar.jpg"
    >
      <div className="logo" style={{ textAlign: 'center' }}>
        <Link to="/" className="sidebar-link">
          <img
            src="/img/PatientProgressLogoSingle_v2.svg"
            id="navLogo"
            alt="PatientProgress logo"
          />
        </Link>
      </div>

      <div className="sidebar-wrapper">
        {!loading && (
          <Fragment>
            {isAuthenticated
              ? type === 'patient'
                ? patientLinks
                : type === 'professional'
                ? professionalLinks
                : type === 'admin'
                ? adminLinks
                : guestLinks
              : guestLinks}
          </Fragment>
        )}
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Sidebar);
