import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import Spinner from './components/Spinner/Spinner';
import App from './App';

import './i18n';

ReactDOM.render(
  <Suspense fallback={<Spinner />}>
    <App />
  </Suspense>,
  document.getElementById('root')
);
