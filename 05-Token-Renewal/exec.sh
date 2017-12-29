#!/usr/bin/env bash
docker build -t auth0-jquery-05-token-renewal .
docker run -p 3000:3000 -it auth0-jquery-05-token-renewal
