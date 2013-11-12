var nitrogen = require('nitrogen');

var config = {
    //  host: 'localhost',
    //  http_port: 3030,
    //  protocol: 'http'
};

config.store = new nitrogen.Store(config);

module.exports = config;