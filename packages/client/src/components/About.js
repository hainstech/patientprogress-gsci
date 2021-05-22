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
              <h4 className='card-title'>{t('about.title')}</h4>
            </div>
            <div className='card-body'>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                ac nunc non magna vestibulum rutrum et quis elit. Duis imperdiet
                magna molestie mauris commodo, in aliquam lacus sollicitudin.
                Fusce sed sem non odio faucibus sodales. Praesent vitae
                hendrerit nibh. Curabitur nec libero non nibh blandit mollis non
                a tortor. Maecenas et dui sed lacus maximus pharetra. Nulla
                hendrerit vitae enim eu egestas. Etiam non consequat metus. Cras
                posuere sem eu sapien gravida tincidunt a sollicitudin erat.
                Cras pellentesque feugiat odio non tincidunt. Cras at mi viverra
                quam rutrum scelerisque. Nullam mauris velit, fringilla
                facilisis turpis et, scelerisque vestibulum velit. <br /> <br />
                Nullam id ex vel enim convallis cursus dignissim eu nisl.
                Aliquam varius et diam vel venenatis. Nunc eros erat, aliquam a
                quam lacinia, aliquet feugiat nunc. Ut euismod enim et lectus
                consequat, a tincidunt purus blandit. Phasellus mi ligula,
                efficitur vitae orci et, facilisis ultricies lorem. Nullam
                mattis velit mauris, quis commodo nulla auctor a. Suspendisse
                sit amet libero nisl. Maecenas accumsan sem vel tellus lacinia
                vehicula. Mauris hendrerit felis vitae purus euismod, vitae
                hendrerit lorem tincidunt. Cras dapibus nisi ut dapibus
                faucibus. Etiam eleifend congue ipsum in convallis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
