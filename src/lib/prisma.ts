/**
 * Prisma Client Export
 * db.ts ile aynı instance'ı export eder
 */

import { db } from './db';

// prisma olarak export et (bazı dosyalar bunu kullanıyor)
export const prisma = db;

// default export
export default db;
