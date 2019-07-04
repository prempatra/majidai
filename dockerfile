FROM alpine

# install
RUN apk --update add nodejs npm git

# making working directory data
WORKDIR /data

# install majidai
RUN npm install -g majidai

# set path
ENV NODE_PATH=/usr/lib/node_modules

# open port
EXPOSE 80

# main file
RUN git init
RUN git remote add origin https://github.com/dakc/majidai.git
RUN git fetch
RUN git checkout refs/tags/docker -- example

WORKDIR /data/example

# run nodejs
ENTRYPOINT ["node", "sample.js"]