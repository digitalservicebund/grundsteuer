FROM node:16

# Create app directory
WORKDIR /src
# Required files are whitelisted in dockerignore
COPY . ./
RUN npm ci && npm run build 

EXPOSE 3000
CMD ["npm", "start"]
