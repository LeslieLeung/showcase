import { execSync } from 'child_process';
import { copyFileSync, existsSync } from 'fs';

async function build() {
  console.log('Building GitHub Showcase...');
  
  try {
    console.log('1. Fetching repositories...');
    execSync('npm run fetch-repos', { stdio: 'inherit' });
    
    console.log('2. Building React app...');
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('3. Copying data to dist...');
    if (existsSync('src/data/repositories.json')) {
      execSync('mkdir -p dist/src/data', { stdio: 'inherit' });
      copyFileSync('src/data/repositories.json', 'dist/src/data/repositories.json');
    }
    
    console.log('✅ Build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  build();
}