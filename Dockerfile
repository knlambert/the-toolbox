FROM knlambert/the-toolbox-server:latest

COPY build/ .
RUN virtualenv -p python2 venv/
RUN venv/bin/pip2 install -r requirements/prod.txt
CMD venv/bin/gunicorn -b 0.0.0.0:$PORT wsgi