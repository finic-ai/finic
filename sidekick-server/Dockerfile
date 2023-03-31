FROM python:3.10.7

ENV PYTHONDONTWRITEBYTECODE=1
ENV PLAYWRIGHT_BROWSERS_PATH=/app/ms-playwright
# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1
#..... whatever else you need 
RUN apt-get clean
RUN apt-get update
RUN pip install playwright
RUN pip install --upgrade pip
# install manually all the missing libraries
# ARG RUST_VERSION=1.56.0
# RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain ${RUST_VERSION}
# ENV PATH="/root/.cargo/bin:${PATH}"
RUN apt-get install -y rustc gconf-service libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1 libgdk-pixbuf2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libxss1 fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils
RUN pip install --upgrade setuptools-rust
RUN PLAYWRIGHT_BROWSERS_PATH=/app/ms-playwright python -m playwright install --with-deps chromium

# RUN apt update
# RUN apt install -y software-properties-common
# RUN add-apt-repository -y ppa:deadsnakes/ppa
# RUN apt update
# RUN apt install -y python3.10
# RUN apt install -y python3-pip

# RUN update-alternatives --install /usr/bin/python3 python /usr/bin/python3.10 2
# RUN update-alternatives --install /usr/bin/python3 python /usr/bin/python3.8 1

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
COPY . .
# then install our own module
RUN poetry install --only main

EXPOSE 8080

ENTRYPOINT [ "poetry", "run", "start" ]

