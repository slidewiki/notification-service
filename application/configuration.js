'use strict';

//read mongodb URL from /etc/hosts
let host = 'localhost';
var fs = require('fs');
var lines = fs.readFileSync('/etc/hosts').toString().split("\n");
for(var i in lines) {
    if (lines[i].startsWith('::1')) {
      const entrys = lines[i].split(' ');
      host = entrys[entrys.length - 1];
      console.log('found mongodb host', host);
    }
}

module.exports =  {
  MongoDB: {
    URL: 'mongodb://localhost:27017/local',
    PORT: 27017,
    HOST: host,
    NS: 'local',
    SLIDEWIKIDATABASE: 'slidewiki'
  }
};
