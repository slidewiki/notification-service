# Install NodeJS latest stable #
---
[![Language](https://img.shields.io/badge/Language-Bash-lightgrey.svg)](https://www.gnu.org/software/bash/)
[![Framework](https://img.shields.io/badge/Framework-NodeJS%205.6.0-blue.svg)](https://nodejs.org/en/)
[![Virtualization](https://img.shields.io/badge/Virtualization-Docker-blue.svg)](https://www.docker.com/)

### Linux ###
---

Inside this folder you'll find scripts for all popular Linux operating systems to install the current (as of writing this readme) version of NodeJS. Just execute the appropriate file on your commandline as a root user.

Watch out for any errors or warnings (typically occuring when you've already installed a version of NodeJS). Maybe you'll have to do some things by yourself.

```
sudo ./ubuntu.sh
node --version
npm --version
```

**Issues**: I've noticed that using `sudo update-alternatives --config node` and `sudo update-alternatives --config npm` helps in many cases. Maybe you have to invest a little more by using update-alternatives. Alternatively re-/moving your node bin (`which node`) can also be helpful.

### Windows and Mac ###
---
To install NodeJS on Windows or Mac, visit [this page](https://nodejs.org/dist/v5.6.0/), download the appropriate .msi (Windows) or .pkg (Mac) file and execute it on your machine.

### Docker ###
---
Alternatively you can use the following commands on your commandline to run a Docker container, containing NodeJS, to execute your scripts. Remember to alter paths and variables to match your cases. The Docker container will start your program as a webserver on port 8880 (make sure that this port isn't in use!) or just executes it on commandline.

```
docker run -it --rm -v /PATH_TO_YOUR_APP:/usr/src/app -w /usr/src/app -p 8880:80 node:5.6-slim node YOUR_SCRIPT.js
```
