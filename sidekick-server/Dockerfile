
FROM mcr.microsoft.com/playwright/python:v1.32.0-focal as requirements-stage

RUN apt-get update && \
    apt-get install -y python3 python3-pip 

WORKDIR /tmp

RUN pip3 install poetry

COPY ./pyproject.toml ./poetry.lock* /tmp/


RUN poetry export -f requirements.txt --output requirements.txt --without-hashes

FROM mcr.microsoft.com/playwright/python:v1.32.0-focal

RUN apt-get update && \
    apt-get install -y python3 python3-pip 

WORKDIR /code

COPY --from=requirements-stage /tmp/requirements.txt /code/requirements.txt

RUN pip3 install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . /code/

# Heroku uses PORT, Azure App Services uses WEBSITES_PORT, Fly.io uses 8080 by default
CMD ["sh", "-c", "uvicorn server.main:app --host 0.0.0.0 --port ${PORT:-${WEBSITES_PORT:-8080}}"]
