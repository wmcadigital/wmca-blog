#!/usr/bin/env node

/**
 * Build the web component as a standalone bundle
 * Creates a single JS file that can be embedded anywhere
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const buildDir = path.join(__dirname, '..', 'web-component-dist');

console.log('Building web component...');

// Build Next.js app
console.log('1. Building Next.js application...');
try {
  execSync('npm run next:build', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
} catch (e) {
  console.error('❌ Next.js build failed:', e.message);
  process.exit(1);
}

// Create dist directory
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy web component
console.log('2. Packaging web component...');
const webComponentSource = path.join(__dirname, '..', 'src', 'WebComponent.js');
const webComponentDest = path.join(buildDir, 'wmca-blog-component.js');

let componentCode = fs.readFileSync(webComponentSource, 'utf-8');

// Remove ES6 export statements for standalone bundle
componentCode = componentCode.replace(/^export\s+(default\s+)?/gm, '');

// Wrap in IIFE for standalone use
const wrapped = `(function() {
  if (typeof window === 'undefined') return;
  
  ${componentCode}
  
  // Auto-register on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      // Component is auto-registered via customElements.define
    });
  }
})();`;

fs.writeFileSync(webComponentDest, wrapped);

console.log('✅ Web component built successfully!');
console.log(`📦 Output: ${webComponentDest}`);
console.log('\nNext steps:');
console.log('1. Upload web-component-dist/wmca-blog-component.js to your CDN');
console.log('2. Use in Umbraco template:');
console.log('   <wmca-blog app-url="https://your-blog.vercel.app" height="800px"></wmca-blog>');
console.log('   <script src="https://your-cdn.com/wmca-blog-component.js"></script>');
