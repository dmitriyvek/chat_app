#!/bin/bash
source /home/www/code/chat/backend/env/bin/activate
source  /home/www/code/chat/.env
# python /home/www/code/backend/manage.py migrate
exec daphne -b $HOST_IP -p $DAPHNE_PORT config.asgi:application
