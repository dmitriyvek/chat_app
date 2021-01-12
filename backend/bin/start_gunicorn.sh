#!/bin/bash
source /home/dmitriy/1programming/new_chat_app/backend/env/bin/activate
source  /home/dmitriy/1programming/new_chat_app/.env
python /home/dmitriy/1programming/new_chat_app/backend/manage.py migrate
exec gunicorn -c "/home/dmitriy/1programming/new_chat_app/backend/config/gunicorn_config.py" config.wsgi:application