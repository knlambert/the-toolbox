FROM knlambert/the-toolbox-server:latest

EXPOSE 8080
COPY build/* /*
ENTRYPOINT ["venv/bin/python2", "venv/bin/gunicorn", "-b", "0.0.0.0:8080", "wsgi"]