/* This module is used for confugrating the mongodb connection*/
'use strict';

//read mongodb URL from /etc/hosts
let host = 'localhost';
const fs = require('fs');
try {
  const lines = fs.readFileSync('/etc/hosts').toString().split('\n');
  for (let i in lines) {
    if (lines[i].includes('mongodb')) {
      const entrys = lines[i].split(' ');
      host = entrys[entrys.length - 1];
      console.log('Found mongodb host. Using ' + host + ' as database host.');
    }
  }
} catch (e) {
  //Windows or no read rights (bad)
}

//read mongo port from ENV
const co = require('./common');
let port = 27017;
if (!co.isEmpty(process.env.DATABASE_PORT)){
  port = process.env.DATABASE_PORT;
  //console.log('Using port ' + port + ' as database port.'); TODO replace it with logging, that isn't printed at npm run test:unit
}

module.exports = {
  MongoDB: {
    PORT: port,
    HOST: host,
    NS: 'local',
    SLIDEWIKIDATABASE: 'slidewiki'
  }
};
