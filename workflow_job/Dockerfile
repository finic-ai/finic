FROM --platform=linux/amd64 python:3.11

ENV PYTHONBUFFERED True
ENV APP_HOME /app

WORKDIR ${APP_HOME}

COPY ./src/ ./

RUN pip install -r requirements.txt

CMD ["python", "main.py"]