
#!/bin/bash

# Start IDM Experience services

cd /opt/idm-experience

echo "Starting IDM Experience..."
docker-compose up -d

echo "Checking service status..."
docker-compose ps

echo ""
echo "Application started successfully!"
echo "Access: http://localhost:8084"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
