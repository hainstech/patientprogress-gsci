const request = require('request');
var CronJob = require('cron').CronJob;
const Patient = require('./models/Patient');

const TelegramAPIKey = '***REMOVED***';

module.exports = {
  startBot: function () {
    try {
      var job = new CronJob(
        '00 00 00 * * *',
        async function () {
          const patientCount = await Patient.countDocuments();
          const professionalCount = await Professional.countDocuments();
          const Message = `API running in ${process.env.NODE_ENV} ✅ \n${patientCount} patients 👦 \n${professionalCount} professionals 👨‍⚕️`;
          request(
            encodeURI(
              `https://api.telegram.org/bot${TelegramAPIKey}/sendMessage?***REMOVED***&text=${Message}`
            )
          );
        },
        null,
        true,
        'Canada/Eastern'
      );
      job.start();
    } catch (error) {
      console.error(error);
    }
  },
};
