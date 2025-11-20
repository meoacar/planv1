const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else if (file.endsWith('.ts')) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

function fixParamsInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Find destructured params
    const pattern = /const\s+\{\s*([^}]+)\s*\}\s*=\s*await\s+params/g;
    const matches = [...content.matchAll(pattern)];
    
    if (matches.length === 0) return false;
    
    let newContent = content;
    
    matches.forEach(match => {
      const vars = match[1].split(',').map(v => v.trim());
      
      vars.forEach(varStr => {
        let paramName, localName;
        
        if (varStr.includes(':')) {
          const parts = varStr.split(':');
          paramName = parts[0].trim();
          localName = parts[1].trim();
        } else {
          paramName = varStr.trim();
          localName = varStr.trim();
        }
        
        // Replace params.paramName with localName
        const replacePattern = new RegExp(`\\bparams\\.${paramName}\\b`, 'g');
        newContent = newContent.replace(replacePattern, localName);
      });
    });
    
    if (newContent !== originalContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  const apiDir = path.join(__dirname, 'src', 'app', 'api');
  const files = getAllFiles(apiDir);
  let fixedCount = 0;
  
  files.forEach(file => {
    if (fixParamsInFile(file)) {
      console.log(`Fixed: ${file}`);
      fixedCount++;
    }
  });
  
  console.log(`\nTotal files fixed: ${fixedCount}`);
}

main();
