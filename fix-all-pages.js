const fs = require('fs');
const path = require('path');

function fixPages(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      fixPages(fullPath);
    } else if (file.name === 'page.tsx') {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      // Pattern 1: params: { id: string }
      if (/params:\s*\{\s*[a-zA-Z]+:\s*string\s*\}/.test(content)) {
        content = content.replace(
          /params:\s*\{\s*([a-zA-Z]+):\s*string\s*\}/g,
          'params: Promise<{ $1: string }>'
        );
        modified = true;
      }
      
      // Pattern 2: params: { id: string; other: string }
      if (/params:\s*\{\s*[a-zA-Z]+:\s*string;\s*[a-zA-Z]+:\s*string\s*\}/.test(content)) {
        content = content.replace(
          /params:\s*\{\s*([a-zA-Z]+):\s*string;\s*([a-zA-Z]+):\s*string\s*\}/g,
          'params: Promise<{ $1: string; $2: string }>'
        );
        modified = true;
      }
      
      if (modified) {
        // generateMetadata fonksiyonunu düzelt
        content = content.replace(
          /(export async function generateMetadata\(\{\s*params[^}]*\}[^)]*\)[^{]*\{)/g,
          (match) => {
            // params içindeki değişkenleri bul
            const paramsMatch = content.match(/params:\s*Promise<\{\s*([^}]+)\s*\}>/);
            if (paramsMatch) {
              const vars = paramsMatch[1].split(/[;,]/).map(v => v.split(':')[0].trim()).filter(v => v);
              const destructure = `const { ${vars.join(', ')} } = await params;\n  `;
              return match + '\n  ' + destructure;
            }
            return match;
          }
        );
        
        // default export fonksiyonunu düzelt
        content = content.replace(
          /(export default async function [^(]+\(\{\s*params[^}]*\}[^)]*\)[^{]*\{)/g,
          (match) => {
            // params içindeki değişkenleri bul
            const paramsMatch = content.match(/params:\s*Promise<\{\s*([^}]+)\s*\}>/);
            if (paramsMatch) {
              const vars = paramsMatch[1].split(/[;,]/).map(v => v.split(':')[0].trim()).filter(v => v);
              const destructure = `const { ${vars.join(', ')} } = await params;\n  `;
              return match + '\n  ' + destructure;
            }
            return match;
          }
        );
        
        // params.id gibi kullanımları düzelt (eğer varsa)
        const paramsMatch = content.match(/params:\s*Promise<\{\s*([^}]+)\s*\}>/);
        if (paramsMatch) {
          const vars = paramsMatch[1].split(/[;,]/).map(v => v.split(':')[0].trim()).filter(v => v);
          vars.forEach(varName => {
            // params.varName kullanımlarını varName ile değiştir
            const regex = new RegExp(`params\\.${varName}\\b`, 'g');
            content = content.replace(regex, varName);
          });
        }
        
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✓ Fixed: ${fullPath}`);
      }
    }
  }
}

const appDir = path.join(__dirname, 'src', 'app');
console.log('Fixing all page.tsx files...\n');
fixPages(appDir);
console.log('\n✓ Done!');
