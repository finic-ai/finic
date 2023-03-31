
FROM mcr.microsoft.com/playwright:v1.30.0-focal as requirements-stage

RUN apt-get update
RUN apt-get -y purge python3.8
RUN apt-get -y autoremove

RUN apt-get install -y python3.10 python3-pip

# RUN which python

ENV POETRY_HOME=/opt/poetry
ENV POETRY_VENV=/opt/poetry-venv
ENV POETRY_DATA_DIR=/opt/poetry-data
ENV POETRY_CONFIG_DIR=/opt/poetry-config
# Tell Poetry where to place its cache and virtual environment
ENV POETRY_CACHE_DIR=/opt/.cache

VOLUME ./.poetry-data-cache /opt/poetry-data
VOLUME ./.poetry-cache /opt/.cache

RUN pip install poetry
WORKDIR /workspace
RUN poetry config virtualenvs.create false

COPY ./pyproject.toml ./pyproject.toml
COPY ./poetry.lock ./poetry.lock
# install only deps in dependency list first and lockfile to cache them
RUN echo "$(which python)" > python_location.txt

# RUN poetry install --no-root --only main

# COPY . .
# # then install our own module
# RUN poetry install --only main

# EXPOSE 8080

# ENTRYPOINT [ "poetry", "run", "start" ]

