#!/bin/bash
cd "$(dirname "$0")/../backend" || exit 1

if [ -z "$DISPLAY" ]; then
  xvfb-run pdm run python tools/mark_chat_position.py
else
pdm run python tools/mark_chat_position.py
fi
