#!/bin/bash
set -e

SERVER="local-mysql-dev";

echo "echo stop & remove old docker [$SERVER] and starting new fresh instance of [$SERVER]"
(docker kill $SERVER || :) && \
  (docker rm $SERVER || :) && \
  docker-compose up -d 

# wait for pg to start
echo "sleep wait for sql [$SERVER] to start";
sleep 3;


