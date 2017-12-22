FROM knlambert/the-toolbox-server:latest

EXPOSE 8080
COPY . build/
WORKDIR build/

CMD ["venv/bin/gunicorn", "gunicorn", "-b", "0.0.0.0:8080", "wsgi"]