const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();
  const errors = [];
  const consoleMessages = [];

  page.on('console', msg => {
    consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', err => {
    errors.push(err.message);
  });

  page.on('requestfailed', req => {
    errors.push(`Request failed: ${req.url()} - ${req.failure()?.errorText}`);
  });

  try {
    console.log('1. Navigating to login page...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0', timeout: 15000 });
    console.log('   Page loaded. Title:', await page.title());

    const hasEmail = await page.$('#email-input') !== null;
    const hasPassword = await page.$('#password-input') !== null;
    const hasSubmit = await page.$('#login-submit-button') !== null;
    console.log('   Email field present:', hasEmail);
    console.log('   Password field present:', hasPassword);
    console.log('   Submit button present:', hasSubmit);

    console.log('2. Filling in credentials...');
    await page.type('#email-input', 'suvin123@gmail.com');
    await page.type('#password-input', 'password123');

    console.log('3. Clicking Sign In...');
    const submitButton = await page.$('#login-submit-button');
    await submitButton.click();

    console.log('4. Waiting for navigation or response...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    const url = page.url();
    console.log('   Current URL:', url);

    const alertText = await page.$eval('#api-error-alert', el => el.textContent).catch(() => null);
    if (alertText) {
      console.log('   Error alert text:', alertText.trim());
    }

    const pageContent = await page.content();
    if (pageContent.includes('Welcome to SupportFlow') || pageContent.includes('Welcome,')) {
      console.log('5. Dashboard rendered successfully!');
    } else {
      console.log('5. Dashboard NOT rendered.');
    }

    console.log('\n--- Console Messages ---');
    consoleMessages.forEach(msg => console.log(msg));

    console.log('\n--- Errors ---');
    if (errors.length === 0) {
      console.log('No errors');
    } else {
      errors.forEach(err => console.log(err));
    }

  } catch (e) {
    console.error('Test failed:', e.message);
  } finally {
    await browser.close();
  }
})();
