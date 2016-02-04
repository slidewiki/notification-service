FROM node:5.5
MAINTAINER Roy Meissner <meissner@informatik.uni-leipzig.de>

RUN apt-get update && apt-get -y upgrade
RUN mkdir /nodeApp
WORKDIR /nodeApp

# ---------------- #
#   Installation   #
# ---------------- #

#RUN apt-get -y install
ADD ./* /nodeApp/
RUN rm Dockerfile docker-compose.yml

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

#ENTRYPOINT []
CMD node YOUR_APPLICATION.js
