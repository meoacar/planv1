// src/lib/performance.ts

/**
 * Performance monitoring ve optimization utilities
 */

// ====================================================
// QUERY PERFORMANCE MONITORING
// ====================================================

/**
 * Query execution time'ı ölçer
 */
export async function measureQueryTime<T>(
  queryName: string,
  queryFn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  
  try {
    const result = await queryFn();
    const duration = Date.now() - startTime;
    
    if (duration > 100) {
      console.warn(`⚠️ Slow query detected: ${queryName} took ${duration}ms`);
    } else {
      console.log(`✓ Query ${queryName} completed in ${duration}ms`);
    }
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Query ${queryName} failed after ${duration}ms:`, error);
    throw error;
  }
}

// ====================================================
// BATCH OPERATIONS
// ====================================================

/**
 * Array'i chunk'lara böler (batch processing için)
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  
  return chunks;
}

/**
 * Batch işlemleri paralel olarak çalıştırır
 */
export async function processBatch<T, R>(
  items: T[],
  batchSize: number,
  processor: (item: T) => Promise<R>
): Promise<R[]> {
  const chunks = chunkArray(items, batchSize);
  const results: R[] = [];
  
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk.map(processor));
    results.push(...chunkResults);
  }
  
  return results;
}

// ====================================================
// DEBOUNCE & THROTTLE
// ====================================================

/**
 * Debounce fonksiyonu (son çağrıdan sonra belirtilen süre bekler)
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle fonksiyonu (belirtilen sürede en fazla bir kez çalışır)
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// ====================================================
// MEMORY OPTIMIZATION
// ====================================================

/**
 * Large array'leri stream olarak işler (memory-efficient)
 */
export async function* streamArray<T>(
  array: T[],
  chunkSize: number = 100
): AsyncGenerator<T[], void, unknown> {
  for (let i = 0; i < array.length; i += chunkSize) {
    yield array.slice(i, i + chunkSize);
  }
}

/**
 * Memory kullanımını loglar (development için)
 */
export function logMemoryUsage(label: string = 'Memory'): void {
  if (process.env.NODE_ENV === 'development') {
    const used = process.memoryUsage();
    console.log(`📊 ${label}:`, {
      rss: `${Math.round(used.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(used.external / 1024 / 1024)}MB`,
    });
  }
}

// ====================================================
// LAZY LOADING HELPERS
// ====================================================

/**
 * Image lazy loading için blur placeholder oluşturur
 */
export function getBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f0f0f0"/>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(canvas).toString('base64')}`;
}

// ====================================================
// PAGINATION HELPERS
// ====================================================

/**
 * Cursor-based pagination için cursor encode eder
 */
export function encodeCursor(id: string): string {
  return Buffer.from(id).toString('base64');
}

/**
 * Cursor-based pagination için cursor decode eder
 */
export function decodeCursor(cursor: string): string {
  return Buffer.from(cursor, 'base64').toString('utf-8');
}

/**
 * Offset-based pagination parametrelerini hesaplar
 */
export function calculatePagination(page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;
  const take = limit;
  
  return { skip, take };
}

/**
 * Pagination metadata oluşturur
 */
export function createPaginationMeta(
  total: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
}

// ====================================================
// EXPORTS
// ====================================================

export default {
  measureQueryTime,
  chunkArray,
  processBatch,
  debounce,
  throttle,
  streamArray,
  logMemoryUsage,
  getBlurDataURL,
  encodeCursor,
  decodeCursor,
  calculatePagination,
  createPaginationMeta,
};
