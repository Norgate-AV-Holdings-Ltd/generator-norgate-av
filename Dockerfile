FROM node:lts-alpine3.15

RUN apk update && apk upgrade
RUN apk add git

RUN yarn global add yo generator-norgate-av
RUN chown -R node:node /usr/local/lib/node_modules

USER node
ENTRYPOINT [ "yo", "--no-insight", "norgate-av" ]
