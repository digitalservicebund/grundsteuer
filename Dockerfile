FROM node:16 as build

# Create app directory
WORKDIR /src
# Required files are whitelisted in dockerignore
COPY . ./
RUN npm set-script prepare "" && npm ci && npm run build && npm prune --production

FROM node:16-alpine
USER node
ENV NODE_ENV=production

WORKDIR /home/node/src
COPY --from=build /src ./
EXPOSE 3000
CMD ["/bin/sh"]
