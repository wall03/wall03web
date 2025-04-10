# syntax=docker/dockerfile:latest

FROM python:3.13

# Some environment variables for python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Create a virtual directory
WORKDIR /app

COPY . .

# Install app with pip
RUN pip install -e .

# Expose the port
EXPOSE 5000

# Run the developer command(unless specified in compose file)
CMD ["gunicorn","-w","1","-b","0.0.0.0:5000","wall03web:app"]