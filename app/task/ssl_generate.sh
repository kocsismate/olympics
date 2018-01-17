#!/usr/bin/env bash
set -e

SSL_DIR="$PROJECT_ROOT/app/build/nginx/certificate"

# Set our CSR variables
SUBJ="
C=HU
ST=Budapest
O=Woohoo Labs. Ltd.
localityName=Budapest
commonName=*.$HOSTNAME/CN=$HOSTNAME
organizationalUnitName=IT department
emailAddress=woohoolabs@gmail.com
"

mkdir -p $SSL_DIR

# Generate our Private Key, CSR and Certificate
openssl genrsa \
        -out "$SSL_DIR/olympics.key" 4096

openssl req \
        -new \
        -sha512 \
        -subj "$(echo -n "$SUBJ" | tr "\n" "/")" \
        -key "$SSL_DIR/olympics.key" \
        -out "$SSL_DIR/olympics.csr" \
        -passin pass:""

openssl x509 \
        -req \
        -days 365 \
        -in "$SSL_DIR/olympics.csr" \
        -signkey "$SSL_DIR/olympics.key" \
        -out "$SSL_DIR/olympics.crt"

openssl dhparam -out "$SSL_DIR/dhparam.pem" 2048

openssl x509 -text -noout -in "$SSL_DIR/olympics.crt" | egrep "Signature Algo|Subject:|Public-Key"
