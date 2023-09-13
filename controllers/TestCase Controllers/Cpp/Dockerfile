# Use an official GCC image as the base image
FROM gcc:latest

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Run the compiled program when the container starts
CMD ["g++", "main.cpp", "-o", "program"]