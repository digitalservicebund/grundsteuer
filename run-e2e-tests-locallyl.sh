#!/bin/bash
set -e

docker_start() {
  echo "Setting up ephemeral database..."
  npm run docker:up
}

docker_destroy() {
  echo "Tearing down ephemeral database..."
  npm run docker:down
}

run_tests() {
  # destroy ephemeral container when script terminates for any reason
  trap 'docker_destroy' EXIT

  docker_start
  # wait for postgres startup in container
  sleep 2
  npx prisma migrate deploy
  npx prisma db seed
  npm run test:e2e
  exit 0
}

DATABASE_URL=postgresql://prisma:prisma@localhost:5433/tests run_tests
