FROM mcr.microsoft.com/playwright/python:v1.47.0-jammy

ENV POETRY_HOME=/opt/poetry
ENV POETRY_VENV=/opt/poetry-venv
ENV POETRY_DATA_DIR=/opt/poetry-data
ENV POETRY_CONFIG_DIR=/opt/poetry-config
# Tell Poetry where to place its cache and virtual environment
ENV POETRY_CACHE_DIR=/opt/.cache

VOLUME ./.poetry-data-cache /opt/poetry-data
VOLUME ./.poetry-cache /opt/.cache

RUN python -m pip install poetry==1.7.1
WORKDIR /workspace
RUN poetry config virtualenvs.create false

COPY ./pyproject.toml ./pyproject.toml
COPY ./poetry.lock ./poetry.lock
# install only deps in dependency list first and lockfile to cache them
RUN poetry install --no-root --only main

COPY . .


ENV PYTHONUNBUFFERED=1
ENV DISPLAY=:99

# CMD Xvfb :99 -screen 0 1024x768x16 & poetry run python run_worker.py
CMD poetry run python run_worker.py
