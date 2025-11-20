const fs = require('fs');

const files = [
  'src/app/api/v1/leagues/my/route.ts',
  'src/app/api/v1/admin/leagues/add-points/route.ts',
  'src/app/api/gamification/streak/route.ts',
  'src/app/api/admin/sin-leaderboard-stats/route.ts'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace import
  content = content.replace(
    /import { getServerSession } from ['"]next-auth['"];?\s*import { authOptions } from ['"]@\/lib\/auth['"];?/g,
    "import { auth } from '@/lib/auth';"
  );
  
  // Replace usage
  content = content.replace(
    /const session = await getServerSession\(authOptions\)/g,
    'const session = await auth()'
  );
  
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Fixed: ${file}`);
});

console.log('Done!');
