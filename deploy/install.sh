
#!/bin/bash

# IDM Experience Installation Script for Debian 12
# Run this script as root or with sudo privileges

set -e

echo "==========================================="
echo "IDM Experience - Installation Script"
echo "==========================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run this script as root or with sudo"
    exit 1
fi

# Update system
echo "Updating system packages..."
apt update && apt upgrade -y

# Install Docker
echo "Installing Docker..."
apt install -y ca-certificates curl gnupg lsb-release
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start and enable Docker
systemctl start docker
systemctl enable docker

# Install Docker Compose standalone
echo "Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# Create application directory
echo "Creating application directory..."
mkdir -p /opt/idm-experience
cd /opt/idm-experience

# Extract application files (assuming they're in the same directory as this script)
echo "Extracting application files..."
cp -r ../idm-experience-onpremises/* .

# Set permissions
chown -R root:root /opt/idm-experience
chmod +x deploy/*.sh

# Create systemd service
echo "Creating systemd service..."
cat > /etc/systemd/system/idm-experience.service << EOF
[Unit]
Description=IDM Experience Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/idm-experience
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
systemctl daemon-reload
systemctl enable idm-experience.service

# Configure firewall (if ufw is installed)
if command -v ufw &> /dev/null; then
    echo "Configuring firewall..."
    ufw allow 8084/tcp
    ufw allow 3001/tcp
    ufw allow 5432/tcp
fi

echo "==========================================="
echo "Installation completed successfully!"
echo "==========================================="
echo ""
echo "To start the application:"
echo "  systemctl start idm-experience"
echo ""
echo "To check status:"
echo "  systemctl status idm-experience"
echo ""
echo "Application will be available at:"
echo "  http://your-server-ip:8084"
echo ""
echo "Default credentials:"
echo "  Admin: admin@idm.com / admin123"
echo "  User:  ricardo@idm.com / 123456"
echo ""
echo "Logs location:"
echo "  /opt/idm-experience/"
echo ""
