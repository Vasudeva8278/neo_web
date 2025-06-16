#!/usr/bin/env node

/**
 * Neo Web App - Mobile Responsiveness Test Runner
 * 
 * This script provides an easy way to run mobile responsiveness tests
 * with different configurations and options.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkPrerequisites() {
  log('\n🔍 Checking prerequisites...', 'cyan');
  
  // Check if package.json exists
  if (!fs.existsSync('package.json')) {
    log('❌ package.json not found. Please run this script from the project root.', 'red');
    process.exit(1);
  }
  
  // Check if Playwright is installed
  try {
    execSync('npx playwright --version', { stdio: 'pipe' });
    log('✅ Playwright is installed', 'green');
  } catch (error) {
    log('❌ Playwright not found. Installing...', 'yellow');
    try {
      execSync('npm install @playwright/test', { stdio: 'inherit' });
      execSync('npx playwright install', { stdio: 'inherit' });
      log('✅ Playwright installed successfully', 'green');
    } catch (installError) {
      log('❌ Failed to install Playwright', 'red');
      process.exit(1);
    }
  }
  
  // Check if test files exist
  const testFile = 'tests/mobile-responsiveness.spec.js';
  if (!fs.existsSync(testFile)) {
    log(`❌ Test file not found: ${testFile}`, 'red');
    process.exit(1);
  }
  log('✅ Test files found', 'green');
  
  // Check if development server is running
  try {
    const { execSync: exec } = require('child_process');
    exec('curl -f http://localhost:4000 > nul 2>&1', { stdio: 'pipe' });
    log('✅ Development server is running on http://localhost:4000', 'green');
  } catch (error) {
    log('⚠️  Development server not detected. Please start it with: npm start', 'yellow');
    log('   Tests will attempt to start the server automatically.', 'yellow');
  }
}

function runTests(options = {}) {
  const {
    headed = false,
    ui = false,
    project = null,
    reporter = 'html',
    debug = false
  } = options;
  
  let command = 'npx playwright test';
  
  if (headed) command += ' --headed';
  if (ui) command += ' --ui';
  if (project) command += ` --project="${project}"`;
  if (reporter !== 'html') command += ` --reporter=${reporter}`;
  if (debug) command += ' --debug';
  
  // Add the specific test file
  command += ' tests/mobile-responsiveness.spec.js';
  
  log(`\n🚀 Running command: ${command}`, 'cyan');
  
  try {
    execSync(command, { stdio: 'inherit' });
    log('\n✅ Tests completed successfully!', 'green');
    
    if (reporter === 'html') {
      log('\n📊 Opening test report...', 'cyan');
      try {
        execSync('npx playwright show-report', { stdio: 'inherit' });
      } catch (reportError) {
        log('⚠️  Could not open report automatically. Run: npx playwright show-report', 'yellow');
      }
    }
  } catch (error) {
    log('\n❌ Tests failed. Check the output above for details.', 'red');
    process.exit(1);
  }
}

function showHelp() {
  log('\n📱 Neo Web App - Mobile Responsiveness Test Runner', 'bright');
  log('\nUsage: node run-mobile-tests.js [options]\n', 'cyan');
  log('Options:', 'bright');
  log('  --headed        Run tests in headed mode (show browser)', 'cyan');
  log('  --ui            Run tests in UI mode (interactive)', 'cyan');
  log('  --debug         Run tests in debug mode', 'cyan');
  log('  --project=NAME  Run tests for specific project (e.g., "Mobile Chrome")', 'cyan');
  log('  --reporter=TYPE Reporter type (html, json, junit, line)', 'cyan');
  log('  --help          Show this help message', 'cyan');
  log('\nExamples:', 'bright');
  log('  node run-mobile-tests.js', 'yellow');
  log('  node run-mobile-tests.js --headed', 'yellow');
  log('  node run-mobile-tests.js --ui', 'yellow');
  log('  node run-mobile-tests.js --project="Mobile Chrome"', 'yellow');
  log('  node run-mobile-tests.js --reporter=json', 'yellow');
  log('\nAvailable Projects:', 'bright');
  log('  - chromium', 'cyan');
  log('  - firefox', 'cyan');
  log('  - webkit', 'cyan');
  log('  - Mobile Chrome', 'cyan');
  log('  - Mobile Safari', 'cyan');
}

function parseArguments() {
  const args = process.argv.slice(2);
  const options = {};
  
  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      showHelp();
      process.exit(0);
    } else if (arg === '--headed') {
      options.headed = true;
    } else if (arg === '--ui') {
      options.ui = true;
    } else if (arg === '--debug') {
      options.debug = true;
    } else if (arg.startsWith('--project=')) {
      options.project = arg.split('=')[1];
    } else if (arg.startsWith('--reporter=')) {
      options.reporter = arg.split('=')[1];
    } else {
      log(`❌ Unknown option: ${arg}`, 'red');
      log('Use --help for available options', 'yellow');
      process.exit(1);
    }
  }
  
  return options;
}

function showTestSummary() {
  log('\n📋 Test Summary:', 'bright');
  log('\nThis test suite covers:', 'cyan');
  log('  ✅ Navigation responsiveness (width, icons, labels)', 'green');
  log('  ✅ Layout adjustments (margins, padding, grids)', 'green');
  log('  ✅ Breakpoint behavior (mobile, tablet, desktop)', 'green');
  log('  ✅ Touch target sizes (accessibility)', 'green');
  log('  ✅ Performance and loading', 'green');
  log('  ✅ CSS application and styling', 'green');
  log('\nViewport sizes tested:', 'cyan');
  log('  📱 Mobile: 375x667px', 'yellow');
  log('  📱 Tablet: 768x1024px', 'yellow');
  log('  🖥️  Desktop: 1280x720px', 'yellow');
}

function main() {
  log('\n🎯 Neo Web App - Mobile Responsiveness Testing', 'bright');
  log('=' .repeat(50), 'cyan');
  
  const options = parseArguments();
  
  checkPrerequisites();
  showTestSummary();
  
  log('\n🏃 Starting tests...', 'cyan');
  runTests(options);
}

// Handle process interruption
process.on('SIGINT', () => {
  log('\n\n⏹️  Test execution interrupted by user', 'yellow');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  log(`\n❌ Uncaught exception: ${error.message}`, 'red');
  process.exit(1);
});

if (require.main === module) {
  main();
}

module.exports = {
  runTests,
  checkPrerequisites,
  parseArguments
};