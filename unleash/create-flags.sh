#!/bin/bash
set -e

script=$0

if [[ $# -ne 2 ]]; then
  echo "usage: $script <host> <admin-api-token>"
  echo "example: $script http://localhost:4242 \"*:*.unleash-insecure-admin-token\""
  exit 1
fi

host=$1
token=$2

flags=("grundsteuer.bundesident_down" "grundsteuer.ekona_down" "grundsteuer.erica_down" "grundsteuer.grundsteuer_down" "grundsteuer.sendinblue_down" "grundsteuer.zammad_down")

for flag in "${flags[@]}"
do
  echo
  echo Creating flag "$flag"
  # create unleash toggle
  curl -H "Content-Type: application/json" -H  "Authorization: $token" -X POST -d "{\"name\": \"$flag\", \"type\": \"kill-switch\"}" "${host}"/api/admin/projects/default/features

  echo
  # create development strategy for toggle
  curl -H "Content-Type: application/json" -H  "Authorization: $token" -X POST -d "{\"name\": \"default\"}" "${host}"/api/admin/projects/default/features/"$flag"/environments/development/strategies
  echo
done
