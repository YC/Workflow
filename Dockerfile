# Adapted from:
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

# Build from base Node image
FROM node:latest

# Copy files to build directory and navigate to build directory
COPY . /usr/src/build
WORKDIR /usr/src/build

# Install dependencies
RUN npm install && npm install --prefix app/ && npm install --prefix admin/

# Build app
RUN REACT_APP_API_URL=https://foldr.herokuapp.com/api npm run build

# Set NODE_ENV to production
ENV NODE_ENV production

# Move built app and switch directory
RUN mv build/ /usr/src/app
WORKDIR /usr/src/app

# Install production dependencies (dependencies required by deployed app)
COPY package.json /usr/src/app
RUN npm install --production

# Specify port and start command
EXPOSE 3000
CMD [ "npm", "start" ]
