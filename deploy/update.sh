
#!/bin/bash

# Update IDM Experience application

cd /opt/idm-experience

echo "Updating IDM Experience..."

# Stop services
docker-compose down

# Pull latest images
docker-compose pull

# Rebuild and start
docker-compose up -d --build

echo "Update completed successfully!"
echo "Application is running at: http://localhost:8084"
