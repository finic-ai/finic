
FROM mcr.microsoft.com/playwright:v1.31.1-jammy as requirements-stage

# RUN apt update
# RUN apt install -y software-properties-common
# RUN add-apt-repository -y ppa:deadsnakes/ppa
# RUN apt update
# RUN apt install -y python3.10
# # RUN apt install -y python3-pip
RUN apt-get update && apt-get install -y \
    python3-distutils \
    python3-setuptools

RUN apt install python3-pip -y

# RUN update-alternatives --install /usr/bin/python3 python /usr/bin/python3.10 2
# RUN update-alternatives --install /usr/bin/python3 python /usr/bin/python3.8 1

# RUN apt install python3.10-distutils -y
# RUN curl -sS https://bootstrap.pypa.io/get-pip.py | python3.10
RUN python3.10 -m pip --version
# RUN python3.10 -m pip install --upgrade --user setuptools==65.4.1
# RUN python3.10 -m pip uninstall -y distro-info
RUN apt install python-is-python3

# RUN apt install -y python3-pip

# RUN which python

ENV POETRY_HOME=/opt/poetry
ENV POETRY_VENV=/opt/poetry-venv
ENV POETRY_DATA_DIR=/opt/poetry-data
ENV POETRY_CONFIG_DIR=/opt/poetry-config
# Tell Poetry where to place its cache and virtual environment
ENV POETRY_CACHE_DIR=/opt/.cache

VOLUME ./.poetry-data-cache /opt/poetry-data
VOLUME ./.poetry-cache /opt/.cache

RUN python3.10 -m pip install poetry
WORKDIR /workspace
RUN poetry config virtualenvs.create false

COPY ./pyproject.toml ./pyproject.toml
COPY ./poetry.lock ./poetry.lock
# install only deps in dependency list first and lockfile to cache them
RUN poetry install --no-root --only main

COPY . .
# then install our own module
RUN poetry install --only main

EXPOSE 8080

ENTRYPOINT [ "poetry", "run", "start" ]

