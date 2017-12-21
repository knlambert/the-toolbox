FROM knlambert/the-toolbox-server:latest

EXPOSE 8080
COPY build/ build/
WORKDIR build/
CMD ["venv/bin/gunicorn", "-b", "0.0.0.0:8080", "wsgi"]