#!/usr/bin/env bash

func_check_for_root() {
        if [ ! "$( id -u )" -eq 0 ]; then
            echo "ERROR: $0 Must be run as root, Script terminating" ;exit 7
        fi
    }
func_check_for_root

#SETUP PARAMS
NODE_VERSION="v5.6.0"
NODE_INT_VERSION="560"
NODE_FILE=node-${NODE_VERSION}-linux-x64.tar.gz
NODE_FOLDER=node-${NODE_VERSION}-linux-x64
NODE_URI="https://nodejs.org/dist/${NODE_VERSION}/${NODE_FILE}"

cd /usr/lib

if [[ ! -e "${NODE_FOLDER}" ]]; then
    #install DevTools for NPM
    dnf groupinstall -y 'Development Tools'
    dnf install -y build-essential

    # get node
    wget ${NODE_URI}
    # extract
    tar xvf ${NODE_FILE}
    # remove tar
    rm ${NODE_FILE} -f

    # install alternatives
    update-alternatives --install /usr/bin/node node /usr/lib/${NODE_FOLDER}/bin/node ${NODE_INT_VERSION}
    update-alternatives --install /usr/bin/npm npm /usr/lib/${NODE_FOLDER}/bin/npm ${NODE_INT_VERSION}
else
    echo Looks like node is already installed:
    echo ""
    update-alternatives --display node
fi
