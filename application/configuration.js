/* This module is used for configurating the mongodb connection*/
'use strict';

const co = require('./common');

let host = 'localhost';
//read mongo URL from /etc/hosts
const fs = require('fs');
try {
  const lines = fs.readFileSync('/etc/hosts').toString().split('\n');
  lines.filter((line) => line.includes('mongodb')).forEach((line) => {
    const entries = line.split(' ');
    host = entries[entries.length - 1];
    console.log('Using ' + host + ' as database host.');
  });
} catch (e) {
  console.log('Exception: Windows or no read rights to read /etc/hosts (bad)');
}
//read mongo URL from ENV
host = (!co.isEmpty(process.env.DATABASE_URL)) ? process.env.DATABASE_URL : host;
if(host !== 'localhost')
  console.log('Using ' + host + ' as database host.');

let port = 27017;
//read mongo port from ENV
if (!co.isEmpty(process.env.DATABASE_PORT)){
  port = process.env.DATABASE_PORT;
  console.log('Using ' + port + ' as database port.');
}

let slidewikiDbName = 'slidewiki';
if (process.env.NODE_ENV === 'test') {
  slidewikiDbName = 'slidewiki_test';
}


module.exports = {
  MongoDB: {
    PORT: port,
    HOST: host,
    NS: 'local',
    SLIDEWIKIDATABASE: slidewikiDbName
  }
};
