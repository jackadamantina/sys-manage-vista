
#!/bin/bash

# Backup IDM Experience database

BACKUP_DIR="/opt/idm-experience/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="idm_backup_${DATE}.sql"

mkdir -p $BACKUP_DIR

echo "Creating database backup..."

docker exec idm-postgres pg_dump -U idm_user -d idm_database > $BACKUP_DIR/$BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "Backup created successfully: $BACKUP_DIR/$BACKUP_FILE"
    
    # Keep only last 7 backups
    cd $BACKUP_DIR
    ls -t idm_backup_*.sql | tail -n +8 | xargs -r rm
    
    echo "Old backups cleaned up (keeping last 7)"
else
    echo "Backup failed!"
    exit 1
fi
