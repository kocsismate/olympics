#!/usr/bin/env bash
set -e

envsubst < $PROJECT_ROOT/app/build/php-fpm/config/custom-php-fpm.conf > /usr/local/etc/php-fpm.d/zz-docker.conf
