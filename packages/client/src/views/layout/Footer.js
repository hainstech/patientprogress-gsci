import React, { Fragment } from 'react';

const Footer = () => {
  return (
    <Fragment>
      <footer className="footer">
        <div className="container">
          <nav className="float-left">
            <ul>
              <li>
                <a href="https://patientprogress.ca"> PatientProgress </a>
              </li>
            </ul>
          </nav>
          <div className="copyright float-right">
            &copy; 2020, made by{' '}
            <a href="https://hainstech.com" target="_blank" rel="noreferrer">
              Hains Technologies
            </a>
            .
          </div>
        </div>
      </footer>
    </Fragment>
  );
};

export default Footer;
