
#!/bin/bash

# Stop IDM Experience services

cd /opt/idm-experience

echo "Stopping IDM Experience..."
docker-compose down

echo "Services stopped successfully!"
