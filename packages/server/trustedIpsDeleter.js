var CronJob = require('cron').CronJob;
var Redis = require('ioredis');
var redis = new Redis();

module.exports = {
  startDeleter: function () {
    try {
      var job = new CronJob(
        '* * * * 01 *',
        function () {
          var stream = redis.scanStream({
            match: 'trusted_ips_*',
          });
          stream.on('data', function (keys) {
            // `keys` is an array of strings representing key names
            if (keys.length) {
              var pipeline = redis.pipeline();
              keys.forEach(function (key) {
                pipeline.del(key);
              });
              pipeline.exec();
            }
          });
          stream.on('end', function () {
            console.log('Flushed all trusted IPs');
          });
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
