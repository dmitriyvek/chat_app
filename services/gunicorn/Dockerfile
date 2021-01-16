FROM python:3.8

RUN useradd -ms /bin/bash www
SHELL ["/bin/bash", "-c"]
USER www

RUN mkdir -p /home/www/code/chat/backend/log/{app,gunicorn}
RUN touch /home/www/code/chat/backend/log/app/{info.log,error.log}

WORKDIR /home/www/code/chat/backend

# differend requirements because of channels and chatnnels-redis version conflict
COPY services/requirements.txt requirements.txt
RUN python3 -m venv env
RUN env/bin/pip3 install -U pip
RUN env/bin/pip3 install -r requirements.txt
# force return 0 code because of channels and chatnnels-redis version conflict
RUN env/bin/pip3 install -U channels; exit 0

COPY backend/config config
COPY backend/chat chat
COPY backend/user user
# the folder bin/* must have execution rights
COPY backend/bin bin  
COPY backend/manage.py manage.py
COPY .env ../.env

EXPOSE 8002

ENTRYPOINT ["./bin/start_gunicorn.sh"]