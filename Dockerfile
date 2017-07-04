FROM node:6.11-slim
MAINTAINER Roy Meissner <meissner@informatik.uni-leipzig.de>

RUN mkdir /nodeApp
WORKDIR /nodeApp

# ---------------- #
#   Installation   #
# ---------------- #

ADD ./application/ ./
RUN npm prune --production

# ----------------- #
#   Configuration   #
# ----------------- #

EXPOSE 80

# ----------- #
#   Cleanup   #
# ----------- #

RUN apt-get autoremove -y && apt-get -y clean && \
		rm -rf /var/lib/apt/lists/*

# -------- #
#   Run!   #
# -------- #

CMD npm start
