# Grundsteuer

This is the code repository of Grundsteuer by [DigitalService](https://digitalservice.bund.de).

## Quick Start Guide

- [Remix Docs](https://remix.run/docs)

### Development

On first install:

```
npm install
npx prisma migrate dev
```

To start the app:

```sh
npm run dev
```

This starts your app in development mode on `localhost:3000`, rebuilding assets on file changes.

The app requires a PostgreSQL instance and reads the connection string from the environment variable `DATABASE_URL`.
It uses [Prisma](https://www.prisma.io) for database migrations. It also needs a Redis instance (version 5) and reads
the connection string from `REDIS_URL`.

You need a local `.env` file to load configuration parameters from. The default values are stored in `.env.example`.
If no `.env` exists in project root, `npm run dev` will create one by copying `.env.example`. If there are parameters
defined in `.env.example` that are missing in your local `.env`, the app will fail on startup
with an error message indicating the missing keys.

#### E2E/integration tests

The E2E tests require a working database connection, meaning that the environment variable `DATABASE_URL` must be set to
a connection string for a live PostgreSQL server. Since the tests assume a fresh database seeded with test data, it is
best to use an ephemeral database used exclusively for this purpose.

Assuming the Docker daemon is running, you can execute `run-e2e-tests-locally.sh` to fire up and seed such an ephemeral
instance in form of a Docker container. The script then runs the test against it and destroys the container once
it's finished executing or is terminated.

#### Style (Linting & Formatting)

We use [ESLint](https://eslint.org/docs/user-guide/getting-started) to find problems in our code
and [Prettier](https://prettier.io/docs/en/index.html) to enforce consistent formatting.

It's probably a good idea to setup ESLint and Prettier in your editor (it might even be there out-of-the-box). This way you become aware of linting errors immediately while coding. Auto-formatting on saving the file frees you from any manual formatting work.

To be on the safe side ESLint and Prettier are also run on all staged files before a commit. Automatically, so you can't forget it.

Additionally ,you can always run ESLint and Prettier manually via npm tasks:

Check style:

```sh
npm run style:check
```

Autofix issues:

```sh
npm run style:fix
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

The Dockerfile is intended for production images. A Docker Compose file, `docker-compose-test.yml`, is
provided to minimize local setup required for running E2E tests.

#### Production Flow

```sh
docker build -t grundsteuer .
docker run --rm -it -p 3000:3000 grundsteuer
```

This builds and starts your app in production mode.

## The form logic

To construct our forms we use four different structures:

- State machine: The state machine defines the order in which the form is build from steps depending on the user data. This can be found in `app/domain/states.ts`.
- Step definitions: The fields that are used in a step and further information such as validations is defined through the step definition. These can be found in `app/domain/steps/index.ts`.
- Step specific components: If a step needs to look different from the DefaultStep, it needs to have a specific StepComponent or StepHeadlineComponent (only title and description). These can be found in `app/components/steps/index.ts` or `app/components/headlines/index.ts`.
- Step specific texts: Texts for each step (like headlines, descriptions, text in help components) need to be set through localization. These texts can be found in `public/locales/de/all.json`.

These structures are then used in `app/routes/formular/_step.tsx` to construct a step.
