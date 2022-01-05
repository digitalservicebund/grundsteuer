# Grundsteuer

This is the code repository of Grundsteuer by [DigitalService4Germany](https://digitalservice4germany.com).

## Quick Start Guide

- [Remix Docs](https://remix.run/docs)

### Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

You need a local `.env` file to load configuration parameters from. The default values for are stored in `.env.example`.

#### Style (Linting & Formatting)

We use [ESLint](https://eslint.org/docs/user-guide/getting-started) for linting
and [Prettier](https://prettier.io/docs/en/index.html) to enforce consistent formatting.

Check style:

```sh
npm run style:check
```

Autofix issues:

```sh
npm run style:fix
```

Run all checks (use before every commit!):

```sh
npm run check
```

### Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

### Docker Tooling

There are 2 docker files, the standard Dockerfile is intended for production images and the dev.Dockerfile can be used
for local development in combination with docker-compose where the app directory is mounted into the container for hot
reload capabilities.

#### Production Flow

```sh
docker build -t grundsteuer .
docker run --rm -it -p 3000:3000 grundsteuer
```

This builds and starts your app in production mode.

#### Development Flow

```sh
docker-compose up
```

This starts your app in development mode, rebuilding assets on file changes.
