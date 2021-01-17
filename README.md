# My example chat application

There is a [link on application](https://chat.dmitriyvek.com/)
There is a [link on swagger](https://chat.dmitriyvek.com/swagger/)

## Project installation and setup from source

Getting project`s code

```
git clone https://github.com/dmitriyvek/chat_app.git chat-app
```

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

Create a .env file in project`s root with given parameters. You also need a postgres db created with given paramenters

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
