#!/bin/bash

# Abonelik Sistemi Deployment Script
# Kullanım: ./deploy-subscription.sh

echo "🚀 Abonelik Sistemi Deployment Başlıyor..."

# Renk kodları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Sunucu bilgileri
SERVER="root@31.97.34.163"
PROJECT_PATH="/root/Plan V1"

echo -e "${YELLOW}📦 1. GitHub'a push ediliyor...${NC}"
git add .
git commit -m "feat: abonelik sistemi eklendi - premium, ödeme, admin panel"
git push origin main

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Git push başarısız!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ GitHub'a push tamamlandı${NC}"

echo -e "${YELLOW}📡 2. Sunucuya bağlanılıyor...${NC}"

ssh $SERVER << 'ENDSSH'
    cd "/root/Plan V1"
    
    echo "📥 Git pull yapılıyor..."
    git pull origin main
    
    echo "🗄️ SQL migration çalıştırılıyor..."
    mysql -u root -p"$(cat .env | grep DATABASE_URL | cut -d'@' -f2 | cut -d':' -f3 | cut -d'/' -f1)" zayiflamaplan < add-subscription-system.sql
    
    echo "📦 Dependencies yükleniyor..."
    npm install
    
    echo "🔨 Prisma generate..."
    npx prisma generate
    
    echo "🏗️ Next.js build..."
    npm run build
    
    echo "🔄 PM2 restart..."
    pm2 restart all
    
    echo "✅ Deployment tamamlandı!"
ENDSSH

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment başarılı!${NC}"
    echo -e "${GREEN}🌐 Site: https://yourdomain.com${NC}"
else
    echo -e "${RED}❌ Deployment başarısız!${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}📋 Sonraki Adımlar:${NC}"
echo "1. Webhook URL'lerini ödeme sağlayıcı panellerinde ayarlayın"
echo "2. Admin panelden premium özellikleri test edin"
echo "3. Test kartları ile ödeme akışını test edin"
echo ""
echo -e "${GREEN}🎉 Abonelik sistemi hazır!${NC}"
