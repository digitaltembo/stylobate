#!/bin/sh
source /app/venv/bin/activate
/start-reload.sh & yarn --noninteractive --cwd /frontend start