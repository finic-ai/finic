FROM --platform=linux/amd64 python:3.11

ENV PYTHONBUFFERED True
ENV APP_HOME /app
ENV PYTHONPATH=$APP_HOME

WORKDIR ${APP_HOME}

COPY ./src/ ./

# Copy the models folder from the symlinked location to the appropriate place inside the container
COPY ./tmp/models/ ./

RUN pip install -r requirements.txt

CMD ["python", "main.py"]