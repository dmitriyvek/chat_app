import os

from dotenv import load_dotenv


load_dotenv()

command = '/home/dmitriy/1programming/new_chat_app/backend/env/bin/gunicorn'
pythonpath = '/home/dmitriy/1programming/new_chat_app/backend'
bind = '{host}:{port}'.format(
    host=os.getenv('HOST'), port=os.getenv('GUNICORN_PORT'))
workers = 3
user = 'dmitriy'
limit_request_fields = 32000
limit_request_field_size = 0
raw_env = 'DJANGO_SETTINGS_MODULE=config.settings'
loglevel = 'info'
accesslog = '/home/dmitriy/1programming/new_chat_app/backend/log/gunicorn/access.log'
acceslogformat = "%(h)s %(l)s %(u)s %(t)s %(r)s %(s)s %(b)s %(f)s %(a)s"
errorlog = '/home/dmitriy/1programming/new_chat_app/backend/log/gunicorn/error.log'
