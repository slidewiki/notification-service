/* This module is used for confugrating the mongodb connection*/
'use strict';

//read mongodb URL from /etc/hosts
let host = 'localhost';
const fs = require('fs');
const lines = fs.readFileSync('/etc/hosts').toString().split('\n');
for (let i in lines) {
  if (lines[i].startsWith('mongodb')) {
    const entrys = lines[i].split(' ');
    host = entrys[entrys.length - 1];
    console.log('found mongodb host', host);
  }
}

//read mongo port from ENV
const co = require('./common');
let port = 27017;
if (!co.isEmpty(process.env.DATABASE_PORT))
  port = process.env.DATABASE_PORT;

module.exports = {
  MongoDB: {
    PORT: port,
    HOST: host,
    NS: 'local',
    SLIDEWIKIDATABASE: 'slidewiki'
  }
};
