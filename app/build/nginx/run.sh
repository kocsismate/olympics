#!/usr/bin/env sh
set -e

export DOLLAR='$'
rm -f /etc/nginx/conf.d/*

mkdir -p /etc/nginx/snippets
envsubst < $PROJECT_ROOT/app/build/nginx/config/security.conf > /etc/nginx/snippets/security.conf
envsubst < $PROJECT_ROOT/app/build/nginx/config/ssl.conf > /etc/nginx/snippets/ssl.conf

envsubst < $PROJECT_ROOT/app/build/nginx/config/nginx.conf > /etc/nginx/nginx.conf
envsubst < $PROJECT_ROOT/app/build/nginx/config/frontend.conf > /etc/nginx/conf.d/00-frontend.conf

mkdir -p /etc/ssl/olympics
cp $PROJECT_ROOT/app/build/nginx/certificate/olympics.key /etc/ssl/olympics/olympics.key
cp $PROJECT_ROOT/app/build/nginx/certificate/olympics.crt /etc/ssl/olympics/olympics.crt
cp $PROJECT_ROOT/app/build/nginx/certificate/dhparam.pem /etc/ssl/olympics/dhparam.pem
chmod 400 /etc/ssl/olympics/*

nginx
