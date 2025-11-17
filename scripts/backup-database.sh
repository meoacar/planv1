#!/bin/bash

# ========================================
# Database Backup Script
# ========================================
# Bu script production veritabanının yedeğini alır
# Cron job ile otomatik çalıştırılabilir: 0 2 * * * /path/to/backup-database.sh

set -e  # Hata durumunda scripti durdur

# ========================================
# CONFIGURATION
# ========================================
BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="zayiflamaplan_backup_${TIMESTAMP}.sql"
COMPRESSED_FILE="${BACKUP_FILE}.gz"

# Database credentials (environment variables'dan al)
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-zayiflamaplan_prod}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD}"

# S3 Configuration (optional)
S3_BUCKET="${BACKUP_S3_BUCKET}"
AWS_REGION="${AWS_REGION:-eu-central-1}"

# Notification settings
WEBHOOK_URL="${BACKUP_WEBHOOK_URL}"

# ========================================
# FUNCTIONS
# ========================================

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

send_notification() {
    local status=$1
    local message=$2
    
    if [ -n "$WEBHOOK_URL" ]; then
        curl -X POST "$WEBHOOK_URL" \
            -H "Content-Type: application/json" \
            -d "{\"status\":\"$status\",\"message\":\"$message\",\"timestamp\":\"$(date -Iseconds)\"}" \
            2>/dev/null || true
    fi
}

cleanup_old_backups() {
    log "Cleaning up backups older than $RETENTION_DAYS days..."
    find "$BACKUP_DIR" -name "zayiflamaplan_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
    log "Cleanup completed"
}

# ========================================
# MAIN SCRIPT
# ========================================

log "Starting database backup..."

# Backup dizinini oluştur
mkdir -p "$BACKUP_DIR"

# Database backup al
log "Creating backup: $BACKUP_FILE"
if [ -n "$DB_PASSWORD" ]; then
    mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" \
        --single-transaction \
        --routines \
        --triggers \
        --events \
        --add-drop-database \
        --databases "$DB_NAME" \
        > "$BACKUP_DIR/$BACKUP_FILE"
else
    mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" \
        --single-transaction \
        --routines \
        --triggers \
        --events \
        --add-drop-database \
        --databases "$DB_NAME" \
        > "$BACKUP_DIR/$BACKUP_FILE"
fi

# Backup'ı sıkıştır
log "Compressing backup..."
gzip "$BACKUP_DIR/$BACKUP_FILE"

# Backup boyutunu kontrol et
BACKUP_SIZE=$(du -h "$BACKUP_DIR/$COMPRESSED_FILE" | cut -f1)
log "Backup created successfully: $COMPRESSED_FILE ($BACKUP_SIZE)"

# S3'e yükle (eğer konfigüre edilmişse)
if [ -n "$S3_BUCKET" ]; then
    log "Uploading to S3: s3://$S3_BUCKET/$COMPRESSED_FILE"
    aws s3 cp "$BACKUP_DIR/$COMPRESSED_FILE" "s3://$S3_BUCKET/$COMPRESSED_FILE" \
        --region "$AWS_REGION" \
        --storage-class STANDARD_IA
    log "S3 upload completed"
fi

# Eski backup'ları temizle
cleanup_old_backups

# Başarı bildirimi gönder
send_notification "success" "Database backup completed successfully: $COMPRESSED_FILE ($BACKUP_SIZE)"

log "Backup process completed successfully!"
exit 0
