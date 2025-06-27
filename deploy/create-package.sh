
#!/bin/bash

# Script para criar pacote de deployment

echo "Creating IDM Experience deployment package..."

# Create temporary directory
TEMP_DIR="/tmp/idm-experience-onpremises"
PACKAGE_NAME="idm-experience-onpremises.tar.gz"

rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

# Copy all necessary files
cp -r backend "$TEMP_DIR/"
cp -r deploy "$TEMP_DIR/"
cp docker-compose.yml "$TEMP_DIR/"
cp Dockerfile.frontend "$TEMP_DIR/"
cp nginx.conf "$TEMP_DIR/"
cp README-DEPLOY.md "$TEMP_DIR/"

# Copy frontend build (you need to build it first)
if [ -d "dist" ]; then
    cp -r dist "$TEMP_DIR/"
else
    echo "Warning: Frontend dist folder not found. Make sure to run 'npm run build' first."
fi

# Copy package.json and other frontend files needed for build
cp package*.json "$TEMP_DIR/"
cp vite.config.ts "$TEMP_DIR/"
cp tsconfig*.json "$TEMP_DIR/"
cp tailwind.config.ts "$TEMP_DIR/"
cp postcss.config.js "$TEMP_DIR/"
cp index.html "$TEMP_DIR/"
cp -r src "$TEMP_DIR/"
cp -r public "$TEMP_DIR/"

# Make scripts executable
chmod +x "$TEMP_DIR/deploy/"*.sh

# Create .env file from example
cp "$TEMP_DIR/backend/.env.example" "$TEMP_DIR/.env"

# Create package
cd /tmp
tar -czf "$PACKAGE_NAME" idm-experience-onpremises/

# Move to current directory
mv "$PACKAGE_NAME" "$(pwd)/"

echo "Package created: $PACKAGE_NAME"
echo "Size: $(du -sh $PACKAGE_NAME | cut -f1)"

# Cleanup
rm -rf "$TEMP_DIR"

echo "Package ready for deployment!"
