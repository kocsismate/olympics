#!/usr/bin/env bash
set -e

$PROJECT_ROOT/app/build/php/configure.sh
$PROJECT_ROOT/app/build/php-fpm/configure.sh

php-fpm
