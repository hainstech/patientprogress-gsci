import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/CustomButtons/Button.js';

import {
  FormControl,
  NativeSelect,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from 'formik';

import inputStyles from '../../assets/jss/material-dashboard-react/components/customInputStyle.js';
const useInputStyles = makeStyles(inputStyles);

function Consent({ consentData, setConsentData }) {
  const inputClasses = useInputStyles();
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // https://v4.mui.com/components/dialogs/
  const descriptionElementRef = React.useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open, consentData]);

  const formik = useFormik({
    initialValues: {
      dataConsent: '',
      participantConsent: '',
    },
    onSubmit: async (data) => {
      const consent = {
        dataConsent: data.dataConsent || consentData.dataConsent,
        participantConsent:
          data.participantConsent || consentData.participantConsent,
      };
      setConsentData(consent);
    },
  });

  return (
    <div>
      <Button color="success" onClick={handleClickOpen}>
        {t('register.fillConsent')}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={'paper'}
        aria-labelledby="consent-form"
        aria-describedby="Consent form for the patientprogress app."
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle id="consent-form">{t('consent.title')}</DialogTitle>
          <DialogContent dividers={true}>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: t('consent.1', {
                    interpolation: { escapeValue: false },
                  }),
                }}
              />

              <FormControl fullWidth className={inputClasses.formControl}>
                <p>{t('consent.dataConsent')}</p>

                <NativeSelect
                  value={consentData.dataConsent || formik.values.dataConsent}
                  onChange={formik.handleChange}
                  inputProps={{
                    type: 'text',
                    id: 'dataConsent',
                  }}
                  disabled={
                    consentData.dataConsent === 'true' ||
                    consentData.dataConsent === true
                  }
                >
                  <option value="" defaultValue disabled></option>
                  <option value="true">{t('report.yes')}</option>
                  <option value="false">{t('report.no')}</option>
                </NativeSelect>
              </FormControl>

              <div
                dangerouslySetInnerHTML={{
                  __html: t('consent.2', {
                    interpolation: { escapeValue: false },
                  }),
                }}
              />

              <FormControl fullWidth className={inputClasses.formControl}>
                <p>{t('consent.participantConsent')}</p>

                <NativeSelect
                  value={
                    consentData.participantConsent ||
                    formik.values.participantConsent
                  }
                  onChange={formik.handleChange}
                  inputProps={{
                    type: 'text',
                    id: 'participantConsent',
                  }}
                  disabled={
                    consentData.participantConsent === 'true' ||
                    consentData.participantConsent === true
                  }
                >
                  <option value="" defaultValue disabled></option>
                  <option value="true">{t('report.yes')}</option>
                  <option value="false">{t('report.no')}</option>
                </NativeSelect>
              </FormControl>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="success" type="submit">
              {t('register.submit')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
export default Consent;
