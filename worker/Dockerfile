FROM node:12.6-alpine
LABEL maintainer="docker@lagden.in"

RUN apk --update add --no-cache acl

ARG NODE_ENV=production
ARG PORT=3000
ARG BASE=/home/node

ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT
ENV BASE=$BASE
ENV APP=$BASE/app

EXPOSE $PORT

# Para fazer debug do Node.js no Chrome
# EXPOSE 9229

RUN mkdir -p $APP
COPY . $APP

WORKDIR $APP

RUN setfacl -R -m d:u:node:rwx,u:node:rwX $BASE

USER node
RUN npm ci --ignore-scripts
