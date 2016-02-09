FROM node:5.5-slim
MAINTAINER Roy Meissner <meissner@informatik.uni-leipzig.de>

RUN apt-get update && apt-get -y upgrade
RUN mkdir /nodeApp
WORKDIR /nodeApp

# ---------------- #
#   Installation   #
# ---------------- #

ADD ./application/package.json ./
RUN npm install --production

ADD ./application/ ./

# ----------------- #
#   Configuration   #
# ----------------- #

EXPOSE 3000

# ----------- #
#   Cleanup   #
# ----------- #

RUN apt-get autoremove -y && apt-get -y clean && \
		rm -rf /var/lib/apt/lists/*

# -------- #
#   Run!   #
# -------- #

CMD npm start
