# base image
FROM node:12.2.0-alpine

# # set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH node_modules/.bin:$PATH

# install and cache app dependencies
COPY . /app/
RUN yarn install --silent

# start app
CMD ["yarn", "start"]