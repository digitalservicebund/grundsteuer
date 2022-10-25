#!/bin/bash
set -e

docker compose build
docker compose up -d

# give containers some time to get ready
sleep 3
source create-flags.sh http://localhost:4242 '*:*.unleash-insecure-admin-token'

echo
echo "You can now access unleash at http://localhost:4242. Initial username and password: admin unleash4all"
