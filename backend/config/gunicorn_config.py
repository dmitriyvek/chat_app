import os

from dotenv import load_dotenv


load_dotenv()

command = '/home/www/code/chat/backend/env/bin/gunicorn'
pythonpath = '/home/www/code/chat/backend'
bind = '{host}:{port}'.format(
    host=os.getenv('HOST_IP'), port=os.getenv('GUNICORN_PORT'))
workers = 3
user = 'www'
limit_request_fields = 32000
limit_request_field_size = 0
raw_env = 'DJANGO_SETTINGS_MODULE=config.settings'
loglevel = 'info'
accesslog = '/home/www/code/chat/backend/log/gunicorn/access.log'
acceslogformat = "%(h)s %(l)s %(u)s %(t)s %(r)s %(s)s %(b)s %(f)s %(a)s"
errorlog = '/home/www/code/chat/backend/log/gunicorn/error.log'
