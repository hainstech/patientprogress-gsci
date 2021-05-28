import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  return (
    <div>
      <div className='row'>
        <div className='col-12 mx-auto'>
          <div className='card'>
            <div className='card-header card-header-danger'>
              <h4 className='card-title'>{t('guest.about.title')}</h4>
            </div>
            <div className='card-body'>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
