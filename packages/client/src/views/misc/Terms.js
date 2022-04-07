import React from 'react';
import { useTranslation } from 'react-i18next';

const Terms = () => {
  const { t } = useTranslation();

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: t('terms', {
          interpolation: { escapeValue: false },
        }),
      }}
    />
  );
};

export default Terms;
