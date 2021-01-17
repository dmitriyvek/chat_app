# My example chat application

- There is a [link on application](https://chat.dmitriyvek.com/)
- There is a [link on swagger](https://chat.dmitriyvek.com/swagger/)

# Table of contents

1. [Geting the code](#get-code)
2. [Setuping the project](#setup)
   - [Setup with docker](#docker-setup)
   - [Setup from source](#source-setup)

## Getting the code ready to setup <a name="get-code"></a>

Get the code

```
git clone https://github.com/dmitriyvek/chat_app.git chat-app
```

Create a .env file in project`s root with given parameters

```
DEBUG="(false | true)"
SECRET_KEY=some_secret_key
HOST="0.0.0.0"
DOMAIN_NAME="(ip_addr | domain_name)"
GUNICORN_PORT=port_number_of_gunicornv_server
DAPHNE_PORT=port_number_of_daphne_server
REDIS_HOST=redis_host
REDIS_PORT=port_number_of_redis
PSQL_HOST=psql_host
PSQL_PORT=port_number_of_postgresql
PSQL_DB=postgresql_db_name
PSQL_USER=postgresql_username_for_given_db
PSQL_PSWD=postgresql_password_for_given_db
FRONTEND_PORT=port_of_frontend_server
APP_DOMAIN_NAME="http(s)://domain_name"
SOCKET_DOMAIN_NAME="ws(s)://domain_name"
```

## Setup the project <a name="setup"></a>

### Setup with docker <a name="docker-setup"></a>

You should [get the code and make .env file for it](#get-code)

Make .env file for postgres setup

```
vim chat-app/services/postgres/.env
    POSTGRES_DB=postgresql_db_name
    POSTGRES_USER=postgresql_username_for_given_db
    POSTGRES_PASSWORD=postgresql_password_for_given_db
```

Build javascript file

```
cd chat-app/frontend
npm install
npm run build
```

Start with docker-compose

```
docker-compose up
```

You may want to populate your db with some test data

```
docker-compose exec gunicorn env/bin/python3 manage.py init_db_data
```

### Setup from source <a name="source-setup"></a>

You should [get the code and make .env file for it](#get-code)

Install all python requirements

```
cd chat-app/backend
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```

Install all javascript requirements

```
cd ../frontend
npm install
```

You may want to populate your db with some test data

```
./backend/manage.py init_db_data
```

Change gunicorn configuration

```
cd ../backend
vim config/gunicorn_config.py
vim bin/start_gunicorn.sh
```

Change daphne configuration

```
vim bin/start_daphne.sh
```

Create a folder for app and gunicorn logs (where you specified it)

```
mkdir -p backend/log/{app,gunicorn}
```

Starting gunicorn and daphne servers

```
./bin/start_gunicorn.sh
./bin/start_daphne.sh
```

Setup frontend

```
cd ../frontend
npm run build # for building a javascript file
npm start $ for starting development server
```
