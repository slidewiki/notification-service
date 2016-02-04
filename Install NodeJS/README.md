# Install NodeJS latest stable #
---
[![Language](https://img.shields.io/badge/language-bash-blue.svg)](https://www.gnu.org/software/bash/)
[![Framework](https://img.shields.io/badge/Framework-NodeJS%205.5.0-blue.svg)](https://nodejs.org/en/)

### Linux ###
---

Inside this Folder you'll find scripts for all popular Linux operating systems to install the current (as of writing this readme) version of NodeJS. Just execute the appropriate file on your commandline as a root user.

```
sudo ./ubuntu.sh
```

### Windows and Mac ###
---
To install NodeJS on Windows or Mac, visit [this page](https://nodejs.org/dist/v5.5.0/), download the appropriate .msi (Windows) or .pkg (Mac) file and execute it on your machine.

### Docker ###
---
Alternatively you can use the following commands on your commandline to run a Docker container, containing NodeJS, to execute your scripts. Remember to alter paths and variables to match your cases. The Docker container will start your program as a webserver on port 8880 (make sure that this port isn't in use!) or just executes it on commandline.

```
docker run -it --rm -v /PATH_TO_YOUR_APP:/usr/src/app -w /usr/src/app -p 8880:80 node:5.5 node YOUR_SCRIPT.js
```
