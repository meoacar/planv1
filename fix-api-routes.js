const fs = require('fs');
const path = require('path');

// API route dosyalarını bul ve düzelt
function fixApiRoutes(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      fixApiRoutes(fullPath);
    } else if (file.name === 'route.ts') {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      // Pattern 1: { params }: { params: { id: string } }
      const pattern1 = /\{ params \}: \{ params: \{ ([a-zA-Z]+): string \} \}/g;
      if (pattern1.test(content)) {
        content = content.replace(
          /\{ params \}: \{ params: \{ ([a-zA-Z]+): string \} \}/g,
          '{ params }: { params: Promise<{ $1: string }> }'
        );
        modified = true;
      }
      
      // Pattern 2: { params }: { params: { id: string; memberId: string } }
      const pattern2 = /\{ params \}: \{ params: \{ ([a-zA-Z]+): string; ([a-zA-Z]+): string \} \}/g;
      if (pattern2.test(content)) {
        content = content.replace(
          /\{ params \}: \{ params: \{ ([a-zA-Z]+): string; ([a-zA-Z]+): string \} \}/g,
          '{ params }: { params: Promise<{ $1: string; $2: string }> }'
        );
        modified = true;
      }
      
      if (modified) {
        // params kullanımlarını düzelt
        // Fonksiyon başında const { id } = await params ekle
        content = content.replace(
          /(export async function (?:GET|POST|PUT|PATCH|DELETE)\([^)]+\) \{\s*try \{)/g,
          (match) => {
            // params içindeki değişkenleri bul
            const paramsMatch = content.match(/params: Promise<\{ ([^}]+) \}>/);
            if (paramsMatch) {
              const vars = paramsMatch[1].split(';').map(v => v.split(':')[0].trim());
              const destructure = `const { ${vars.join(', ')} } = await params;\n    `;
              return match + '\n    ' + destructure;
            }
            return match;
          }
        );
        
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✓ Fixed: ${fullPath}`);
      }
    }
  }
}

// Başlat
const apiDir = path.join(__dirname, 'src', 'app', 'api');
console.log('Fixing API routes...\n');
fixApiRoutes(apiDir);
console.log('\n✓ Done!');
