FROM node:16.20.2 as build

ARG COMMIT_SHA
ENV APP_VERSION=$COMMIT_SHA

# Create app directory
WORKDIR /src
# Required files are whitelisted in dockerignore
COPY . ./
RUN npm pkg delete scripts.prepare && npm ci && npm run build && npm prune --production && \
    curl https://dbs-download.obs.otc.t-systems.com/rds/ca-bundle.pem -o /opt/rds-ca-bundle.pem

FROM node:16.20.2-alpine3.18

RUN apk add --no-cache dumb-init curl && \
    rm -rf /var/cache/apk/* && \
    curl https://dbs-download.obs.otc.t-systems.com/rds/ca-bundle.pem -o /opt/rds-ca-bundle.pem
USER node
ENV NODE_ENV=production
ARG COMMIT_SHA
ENV APP_VERSION=$COMMIT_SHA

WORKDIR /home/node/src
COPY --chown=node:node --from=build /src ./
# Purge source maps
RUN find public/build -name '*.map' -exec rm {} \;
EXPOSE 3000
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["sh", "./start.sh"]
