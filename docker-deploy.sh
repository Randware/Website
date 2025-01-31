#!/bin/bash

echo "Pulling latest changes from Git..."
git pull

echo "Checking if 'randware-website' container exists..."
if docker ps -a --format '{{.Names}}' | grep -q "randware-website"; then
    echo "Stopping and removing the 'randware-website' container..."
    docker stop randware-website
    docker rm randware-website
else
    echo "'randware-website' container does not exist."
fi

# Check if the "randware-website" image exists and remove it if it does
echo "Checking if 'randware-website' image exists..."
if docker images --format '{{.Repository}}' | grep -q "randware-website"; then
    echo "Removing 'randware-website' image..."
    docker rmi randware-website
else
    echo "'randware-website' image does not exist."
fi

# Prune the builder cache
echo "Pruning builder cache..."
docker builder prune -f

# Build the new container image
echo "Building the 'randware-website' image..."
docker build -t randware-website .

# Run the new image
echo "Running the 'randware-website' container..."
docker run --name randware-website -d -p 3000:3000 randware-website

echo "Script completed successfully."
