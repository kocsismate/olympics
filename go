#!/usr/bin/env bash
set -e

if [ "$1" == "up" ]; then
    docker-compose stop --timeout=2 && docker-compose up -d

elif [ "$1" == "down" ]; then
    docker-compose stop --timeout=2

elif [ "$1" == "db" ]; then
    docker exec -ti olympics-php-fpm /bin/bash -c "./app/task/database_setup.sh"

elif [ "$1" == "ssl" ]; then
    docker exec -ti olympics-php-fpm /bin/bash -c "./app/task/ssl_generate.sh"
fi
