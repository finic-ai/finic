# Use the official Python image as the base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Set environment variables for Poetry
ENV POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_NO_INTERACTION=1 \
    PYSETUP_PATH="/app" \
    PATH="$POETRY_HOME/bin:$PATH"

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 -

# Copy the 'pyproject.toml' and 'poetry.lock' files into the container
COPY pyproject.toml poetry.lock /app/

# Install dependencies using Poetry
RUN poetry install --no-dev

# Copy the rest of the application code
COPY . /app

# Install Playwright and its dependencies
RUN python -m playwright install

# Expose the port Uvicorn will run on
EXPOSE 8080

# Run the FastAPI server with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
