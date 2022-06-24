FROM node:16.15.1 as build

# Create app directory
WORKDIR /src
# Required files are whitelisted in dockerignore
COPY . ./
RUN npm set-script prepare "" && npm ci && npm run build && npm prune --production

FROM node:16.15.1-alpine3.16
RUN apk add --update dumb-init

USER node
ENV NODE_ENV=production

WORKDIR /home/node/src
COPY --chown=node:node --from=build /src ./
EXPOSE 3000
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "--max-http-header-size=65536", "./build/server.js"]
