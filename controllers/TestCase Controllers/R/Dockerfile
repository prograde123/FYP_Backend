# official Python runtime as the base image
FROM r-base:latest

# Set the working directory within the container
WORKDIR /app

# current directory contents into the container at /app
COPY . /app


CMD ["Rscript", "myscript.R"]
