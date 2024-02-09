FROM node:lts-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN apk update && apk upgrade

RUN pnpm add -g yo generator-norgate-av

USER node
ENTRYPOINT [ "yo", "--no-insight", "norgate-av" ]
