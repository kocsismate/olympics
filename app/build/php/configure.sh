#!/usr/bin/env bash
set -e

export DOLLAR='$'
envsubst < $PROJECT_ROOT/app/build/php/config/custom-php.ini > /usr/local/etc/php/conf.d/zz-custom-php.ini
