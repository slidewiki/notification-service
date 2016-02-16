FROM       mongo:latest
MAINTAINER Kurt Junghanns <kjunghanns@informatik.uni-leipzig.de>

# Expose port from the container to the host - have to be the same port as in the mongod.conf file
EXPOSE 27018

# ---------------- #
#   Installation   #
# ---------------- #

ADD mongod.conf /etc/mongod.conf

# -------- #
#   Run!   #
# -------- #

CMD mongod -f /etc/mongod.conf
