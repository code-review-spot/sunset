var config = require('./config')
  , nitrogen = require('nitrogen')
  , SunCalc = require('suncalc');

var service = new nitrogen.Service(config);

var sunsetApp = new nitrogen.User({
    nickname: 'user',
});

SunCalc.addTime(0.30, 'sunriseShot', 'sunsetShot');

service.authenticate(sunsetApp, function(err, session, sunsetApp) {
    if (err) return console.log('failed to connect sunset app: ' + err);

    nitrogen.Principal.find(session, { name: 'Sunset Camera'}, {}, function(err, principals) {
      if (err) return console.log('error finding sunset camera: ' + err);
      if (principals.length === 0) return console.log("didn't find sunset camera");

      nitrogen.Message.find(session, { type: 'cameraCommand', to: principals[0].id }, {}, function(err, messages) {
          var sunsetsAlreadyHave = {};
          messages.forEach(function(message) {
            console.log('already have sunset at:' + message.ts.toString());
            sunsetsAlreadyHave[message.ts.toString()] = message;
          });

          for (var daysOut=0; daysOut <= 1; daysOut++) {
              var date = new Date();
              date.setDate(new Date().getDate() + daysOut);
              var times = SunCalc.getTimes(date, 36.972, -122.0263);

              console.log('looking for sunset at:' + sunsetTime.toString());
              if (!sunsetsAlreadyHave[sunsetTime.toString()]) {
                  console.log('adding sunset photo');
                                
                  var expireTime = new Date(times.sunsetShot.getTime() + 15* 60000);

                  var cmd = new nitrogen.Message({
                      to: principals[0].id,
                      type: 'cameraCommand',
                      ts: times.sunsetShot,
                      expires: expireTime,
                      body: {
                          command: 'snapshot'
                      }
                  });

                  console.dir(cmd);
                  cmd.send(session);
              } else {
                  console.log('already had it');
              }
          }

      });
    });
});
