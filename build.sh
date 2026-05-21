#!/usr/bin/env bash
# Render build script — runs on every deploy

set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# Only seeds if DB is empty. Won't wipe admin edits.
python manage.py seed_content
