#!/bin/bash

npm install

# npx vite --host 0.0.0.0 --port 5050

npx vite build --config vite.config.js

sleep infinity

# npx vite preview --host 0.0.0.0 --port 5050
