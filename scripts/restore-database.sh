#!/bin/bash

# ========================================
# Database Restore Script
# ========================================
# Bu script veritabanı yedeğini geri yükler
# UYARI: Bu işlem mevcut veritabanını siler!

set -e

# ========================================
# CONFIGURATION
# ========================================
BACKUP_FILE=$1

# Database credentials
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-zayiflamaplan_prod}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD}"

# ========================================
# FUNCTIONS
# ========================================

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

show_usage() {
    echo "Usage: $0 <backup_file.sql.gz>"
    echo ""
    echo "Example:"
    echo "  $0 ./backups/zayiflamaplan_backup_20250117_020000.sql.gz"
    echo ""
    echo "Environment variables:"
    echo "  DB_HOST     - Database host (default: localhost)"
    echo "  DB_PORT     - Database port (default: 3306)"
    echo "  DB_NAME     - Database name (default: zayiflamaplan_prod)"
    echo "  DB_USER     - Database user (default: root)"
    echo "  DB_PASSWORD - Database password"
    exit 1
}

confirm_restore() {
    echo ""
    echo "⚠️  WARNING: This will REPLACE the current database!"
    echo "Database: $DB_NAME"
    echo "Backup file: $BACKUP_FILE"
    echo ""
    read -p "Are you sure you want to continue? (yes/no): " -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        log "Restore cancelled by user"
        exit 0
    fi
}

# ========================================
# VALIDATION
# ========================================

if [ -z "$BACKUP_FILE" ]; then
    log "ERROR: Backup file not specified"
    show_usage
fi

if [ ! -f "$BACKUP_FILE" ]; then
    log "ERROR: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# ========================================
# MAIN SCRIPT
# ========================================

log "Database Restore Process"
log "========================"

confirm_restore

log "Starting database restore..."

# Backup dosyasını çıkart (eğer sıkıştırılmışsa)
if [[ $BACKUP_FILE == *.gz ]]; then
    log "Decompressing backup file..."
    TEMP_FILE="${BACKUP_FILE%.gz}"
    gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"
    RESTORE_FILE="$TEMP_FILE"
else
    RESTORE_FILE="$BACKUP_FILE"
fi

# Veritabanını geri yükle
log "Restoring database: $DB_NAME"
if [ -n "$DB_PASSWORD" ]; then
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" < "$RESTORE_FILE"
else
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" < "$RESTORE_FILE"
fi

# Geçici dosyayı temizle
if [[ $BACKUP_FILE == *.gz ]]; then
    rm -f "$TEMP_FILE"
fi

log "Database restored successfully!"
log "Don't forget to restart your application"
exit 0
