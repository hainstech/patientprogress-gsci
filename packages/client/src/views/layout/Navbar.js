import React from 'react';

const Navbar = () => {
  return (
    <nav className='navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top'>
      <div className='container-fluid'>
        <div className='navbar-wrapper'>
          <a className='navbar-brand' href='/'>
            PatientProgress
          </a>
        </div>
        <button
          className='navbar-toggler'
          type='button'
          data-toggle='collapse'
          aria-controls='navigation-index'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='sr-only'>Toggle navigation</span>
          <span className='navbar-toggler-icon icon-bar'></span>
          <span className='navbar-toggler-icon icon-bar'></span>
          <span className='navbar-toggler-icon icon-bar'></span>
        </button>
        <div className='collapse navbar-collapse justify-content-end'>
          <form className='navbar-form'></form>
          <ul className='navbar-nav'></ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
