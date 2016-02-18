FROM       mongo:latest
MAINTAINER Kurt Junghanns <kjunghanns@informatik.uni-leipzig.de>

# ---------------- #
#   Installation   #
# ---------------- #

ADD mongod.conf /etc/mongod.conf

# -------- #
#   Run!   #
# -------- #

CMD mongod -f /etc/mongod.conf
