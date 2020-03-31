# base image
FROM node:12.2.0-alpine

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install --silent

# start app
CMD ["npm", "start"]