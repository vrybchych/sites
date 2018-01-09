#!/bin/bash

# node TEST.js
# TASK_PID=$!
# sleep 15
# kill $TASK_PID
while true; do
  echo "START: \n"
  timeout 3600s node app.js
  sleep 3620
done
