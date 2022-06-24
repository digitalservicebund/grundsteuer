FROM node:16.15.1 as build

# Create app directory
WORKDIR /src
# Required files are whitelisted in dockerignore
COPY . ./
RUN npm set-script prepare "" && npm ci && npm run build && npm prune --production

FROM node:16.15.1-alpine3.16
ENV NODE_ENV=production
RUN apk --purge del apk-tools

USER node
WORKDIR /home/node/src
COPY --chown=node:node --from=build /src ./
EXPOSE 3000
CMD ["npm", "start"]
