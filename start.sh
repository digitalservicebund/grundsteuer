#!/bin/sh

if [ "$APP_MODE" = "cron" ]; then
  node ./build/start-cron.js
else
  node --max-http-header-size=65536 ./build/server.js
fi
