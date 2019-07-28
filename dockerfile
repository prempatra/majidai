FROM alpine

# install
RUN apk --update add nodejs npm git

# making working directory data
WORKDIR /data

# main file
RUN git init
RUN git remote add origin https://github.com/dakc/majidai.git
RUN git fetch
RUN git checkout refs/tags/docker -- example

# change working directory
WORKDIR /data/example

# install majidai 
RUN npm install

# open port
EXPOSE 80

# run nodejs
CMD ["node", "index.js"]