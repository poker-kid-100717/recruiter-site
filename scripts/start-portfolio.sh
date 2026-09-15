#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."
echo "Building and starting Joshua Davis portfolio..."
docker compose up -d --build

echo "Waiting for http://localhost:8080/healthz ..."
i=0
while [ "$i" -lt 60 ]; do
  if curl --fail --silent http://localhost:8080/healthz >/dev/null 2>&1; then
    echo "Portfolio is healthy: http://localhost:8080"
    curl --fail --silent http://localhost:8080/api/profile
    echo
    exit 0
  fi
  i=$((i + 1))
  sleep 2
done

docker compose ps
echo "Portfolio did not become healthy." >&2
exit 1
