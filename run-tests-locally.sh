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
  npm run build
  npx prisma migrate deploy
  npx prisma db seed
  ./unleash/create-flags.sh http://localhost:4243 "*:*.unleash-insecure-admin-token"
  npm run "$1"
  exit 0
}

script=$0
command=

if [[ $# -gt 2  || $1 != "e2e" && $1 != "integration" ]]; then
  echo "usage: $script e2e|integration"
  exit 1
fi

if [[ $1 == "e2e" ]]; then
  command="test:e2e"
elif [[ $1 == "integration" ]]; then
  command="test:integration"
fi


DATABASE_URL=postgresql://prisma:prisma@localhost:5433/tests \
ERICA_URL=http://localhost:8001 REDIS_URL=redis://localhost:6380/0 \
APP_VERSION=test \
UNLEASH_HOST=http://localhost:4243 \
UNLEASH_API_TOKEN=default:development.unleash-insecure-api-token \
UNLEASH_ADMIN_TOKEN=*:*.unleash-insecure-admin-token \
UNLEASH_REFRESH_INTERVAL=500 \
TEST_FEATURES_ENABLED=true \
run_tests $command
