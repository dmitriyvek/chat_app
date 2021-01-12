#!/bin/bash
source /home/dmitriy/1programming/new_chat_app/backend/env/bin/activate
source  /home/dmitriy/1programming/new_chat_app/.env
# python /home/dmitriy/1programming/new_chat_app/backend/manage.py migrate
exec daphne -b $HOST -p $DAPHNE_PORT config.asgi:application