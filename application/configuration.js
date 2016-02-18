'use strict';

//read mongodb URL from /etc/hosts
let host = 'localhost';
let fs = require('fs');
let lines = fs.readFileSync('/etc/hosts').toString().split('\n');
for (let i in lines) {
  if (lines[i].startsWith('::1')) {
    const entrys = lines[i].split(' ');
    host = entrys[entrys.length - 1];
    console.log('found mongodb host', host);
  }
}

module.exports = {
  MongoDB: {
    PORT: 27017,
    HOST: host,
    NS: 'local',
    SLIDEWIKIDATABASE: 'slidewiki'
  }
};
