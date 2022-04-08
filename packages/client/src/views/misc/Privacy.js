import React from 'react';
import { useTranslation } from 'react-i18next';

const Privacy = () => {
  const { t } = useTranslation();

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: t('privacy', {
          interpolation: { escapeValue: false },
        }),
      }}
    />
  );
};

export default Privacy;
