FROM node:16 as build

# Create app directory
WORKDIR /app
# Required files are whitelisted in dockerignore
COPY . ./
RUN npm ci && npm run build && npm prune --production

FROM node:16-alpine
USER node
ENV NODE_ENV=production

WORKDIR /home/node/app
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "start"]
