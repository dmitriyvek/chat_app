#!/bin/bash
source /home/www/code/chat/backend/env/bin/activate
source  /home/www/code/chat/.env
python /home/www/code/chat/backend/manage.py migrate
exec gunicorn -c "/home/www/code/chat/backend/config/gunicorn_config.py" config.wsgi:application
