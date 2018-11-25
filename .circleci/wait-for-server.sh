#!/bin/bash

echo "Waiting for test api..."
while true; do
  curl -f http://localhost:4583/ > /dev/null 2> /dev/null
  if [ $? = 22 ]; then
    echo "Test api started"
    break
  fi

  sleep 2
done
