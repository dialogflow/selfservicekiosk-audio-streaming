# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:12-slim

# Create and change to the app directory.
WORKDIR /usr/src/app

## Make a client build npm run-script build
COPY client/package*.json ./client/
COPY client/angular.json ./client/
COPY client/tsconfig.json ./client/
COPY client/tsconfig.app.json ./client/
COPY client/tsconfig.spec.json ./client/
COPY client/tslint.json ./client/
COPY client/src/ ./client/src/

COPY server/package*.json ./server/
COPY server/tsconfig.json ./server/
COPY server/index.ts ./server/
COPY server/dialogflow.ts ./server/
COPY server/speech.ts ./server/
COPY server/translate.ts ./server/

WORKDIR /usr/src/app/client
RUN npm set progress=false && npm config set depth 0 && npm cache clean --force
RUN npm install typescript@">=3.5.0 <3.6.0" --save-dev --save-exact
RUN npm install --force
RUN npm run-script build

WORKDIR /usr/src/app/server
RUN npm install
RUN npm install pm2 -g
RUN npm run-script build

# Run the web service on container startup.

CMD ["pm2-runtime", "/usr/src/app/server/index.js"]