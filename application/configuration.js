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

module.exports = {
  MongoDB: {
    PORT: 27018,
    HOST: host,
    NS: 'local',
    SLIDEWIKIDATABASE: 'slidewiki'
  }
};
