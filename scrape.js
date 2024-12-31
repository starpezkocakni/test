const axios = require('axios');
const fs = require('fs');
const path = require('path');

const outputFile = 'proxy.txt';

if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile);
    console.log('SCRAPPING FUCK PROXY');
}

const proxyUrls = [
	'https://raw.githubusercontent.com/lhuwux/gado2/refs/heads/main/http2.txt',
	'https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/proxylist.txt',
	'https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/http.txt',
	'https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/https.txt',
	'https://raw.githubusercontent.com/ALIILAPRO/Proxy/main/http.txt',
	'https://raw.githubusercontent.com/babyhagey74/free-proxies/refs/heads/main/proxies/https/https.txt',
	'https://raw.githubusercontent.com/babyhagey74/free-proxies/refs/heads/main/proxies/http/http.txt',
	'https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/socks5.txt',
	'https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/socks4.txt',
	'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/refs/heads/master/socks5.txt',
	'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/refs/heads/master/socks4.txt',
	'https://raw.githubusercontent.com/dpangestuw/Free-Proxy/refs/heads/main/All_proxies.txt',
	'https://raw.githubusercontent.com/dpangestuw/Free-Proxy/refs/heads/main/http_proxies.txt',
	'https://raw.githubusercontent.com/dpangestuw/Free-Proxy/refs/heads/main/socks4_proxies.txt',
	'https://raw.githubusercontent.com/dpangestuw/Free-Proxy/refs/heads/main/socks5_proxies.txt',
	'https://raw.githubusercontent.com/yemixzy/proxy-list/refs/heads/main/proxies/http.txt',
	'https://raw.githubusercontent.com/yemixzy/proxy-list/refs/heads/main/proxies/socks5.txt',
	'https://raw.githubusercontent.com/yemixzy/proxy-list/refs/heads/main/proxies/socks4.txt',
	'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=anonymous',
    'http://worm.rip/http.txt',
    'https://proxyspace.pro/http.txt',
    'https://multiproxy.org/txt_all/proxy.txt',
    'https://proxy-spider.com/api/proxies.example.txt',
    'https://sunny9577.github.io/proxy-scraper/proxies.txt',
    'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=1000&country=all&ssl=all&anonymity=anonymous',
    'https://sunny9577.github.io/proxy-scraper/generated/http_proxies.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies_anonymous/http.txt',
    'https://raw.githubusercontent.com/zloi-user/hideip.me/main/http.txt',
    'https://www.proxy-list.download/api/v1/get?type=http',
    'https://raw.githubusercontent.com/zloi-user/hideip.me/main/https.txt',
    'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks4&timeout=5000&country=all&ssl=all&anonymity=all',
    'https://sunny9577.github.io/proxy-scraper/generated/socks4_proxies.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks4.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies_anonymous/socks4.txt',
    'https://raw.githubusercontent.com/zloi-user/hideip.me/main/socks4.txt',
    'https://www.proxy-list.download/api/v1/get?type=socks4',
    'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks5&timeout=5000&country=all&ssl=all&anonymity=all',
    'https://sunny9577.github.io/proxy-scraper/generated/socks5_proxies.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks5.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies_anonymous/socks5.txt',
    'https://raw.githubusercontent.com/zloi-user/hideip.me/main/socks5.txt',
    'https://www.proxy-list.download/api/v1/get?type=socks',
    'https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/http.txt',
    'https://raw.githubusercontent.com/mallisc5/master/proxy-list-raw.txt',
    'https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt',
    'https://raw.githubusercontent.com/saisuiu/Lionkings-Http-Proxys-Proxies/main/free.txt',
    'https://raw.githubusercontent.com/HyperBeats/proxy-list/main/https.txt',
    'https://raw.githubusercontent.com/UptimerBot/proxy-list/main/proxies/http.txt',
    'https://raw.githubusercontent.com/caliphdev/Proxy-List/master/http.txt',
    'https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/https.txt',
    'https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/http.txt',
    'https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/protocols/http/data.txt',
    'https://raw.githubusercontent.com/tuanminpay/live-proxy/master/http.txt',
    'https://raw.githubusercontent.com/casals-ar/proxy-list/main/https',
    'https://raw.githubusercontent.com/casals-ar/proxy-list/main/http',
	'https://raw.githubusercontent.com/mmpx12/proxy-list/refs/heads/master/http.txt',
    'https://api.ngocphong.space/get-proxy?key=Lintar21&type=http',
    'https://api.ngocphong.space/get-proxy?key=Lintar21&type=https',
    'https://api.ngocphong.space/get-proxy?key=Lintar21&type=socks4',
    'https://api.ngocphong.space/get-proxy?key=Lintar21&type=socks5',
    'https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTPS_RAW.txt',
    'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
    'https://raw.githubusercontent.com/MuRongPIG/Proxy-Master/main/http.txt',
    'https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/http/http.txt',
    'https://raw.githubusercontent.com/prxchk/proxy-list/main/http.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt',
    'https://raw.githubusercontent.com/proxylist-to/proxy-list/main/http.txt',
    'https://raw.githubusercontent.com/yuceltoluyag/GoodProxy/main/raw.txt',
    'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt',
    'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/https.txt',
    'https://raw.githubusercontent.com/mmpx12/proxy-list/master/https.txt',
    'https://raw.githubusercontent.com/Anonym0usWork1221/Free-Proxies/main/proxy_files/http_proxies.txt',
    'https://raw.githubusercontent.com/opsxcq/proxy-list/master/list.txt',
    'https://raw.githubusercontent.com/Anonym0usWork1221/Free-Proxies/main/proxy_files/https_proxies.txt',
    'https://api.openproxylist.xyz/http.txt',
    'https://api.proxyscrape.com/v2/?request=displayproxies',
    'https://api.proxyscrape.com/?request=displayproxies&proxytype=http',
    'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all',
    'https://www.proxydocker.com/en/proxylist/download?email=noshare&country=all&city=all&port=all&type=all&anonymity=all&state=all&need=all',
    'https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/http.txt',
    'https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/https.txt',
    'https://raw.githubusercontent.com/proxy4parsing/proxy-list/main/http.txt',
    'http://atomintersoft.com/proxy_list_port_80',
    'http://atomintersoft.com/proxy_list_domain_org',
    'http://atomintersoft.com/proxy_list_port_3128',
    'http://www.cybersyndrome.net/pla5.html',
    'http://alexa.lr2b.com/proxylist.txt',
    'http://browse.feedreader.com/c/Proxy_Server_List-1/449196258',
    'http://free-ssh.blogspot.com/feeds/posts/default',
    'http://browse.feedreader.com/c/Proxy_Server_List-1/449196259',
    'http://johnstudio0.tripod.com/index1.htm',
    'http://atomintersoft.com/transparent_proxy_list',
    'http://atomintersoft.com/anonymous_proxy_list',
    'http://atomintersoft.com/high_anonymity_elite_proxy_list',
    'http://worm.rip/https.txt',
    'http://rootjazz.com/proxies/proxies.txt',
    'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies.txt',
    'https://raw.githubusercontent.com/hookzof/socks5_list/master/proxy.txt',
    'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt',
    'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=1000000&country=all&ssl=all&anonymity=all',
    'https://www.proxydocker.com/en/proxylist/download?email=noshare&country=all&city=all&port=all&type=all&anonymity=all&state=all&need=all',
    'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=1000000&country=all&ssl=all&anonymity=anonymous',
	'https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt',
	'https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/protocols/http/data.txt',
	'https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/countries/US/data.txt',
	'https://raw.githubusercontent.com/zenjahid/FreeProxy4u/master/http.txt',
	'https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/http/http.txt',
	'https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/https/https.txt',
	'https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/xResults/Proxies.txt',
	'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
	'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt',
	'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt',
	'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt',
	'https://raw.githubusercontent.com/RX4096/proxy-list/main/online/http.txt',
	'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-http.txt',
	'https://raw.githubusercontent.com/mmpx12/proxy-list/master/http.txt',
	'https://raw.githubusercontent.com/sunny9577/proxy-scraper/master/proxies.txt',
	'https://raw.githubusercontent.com/proxy4parsing/proxy-list/main/http.txt',
	'https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTPS_RAW.txt',
	'https://raw.githubusercontent.com/mertguvencli/http-proxy-list/main/proxy-list/data.txt',
	'https://raw.githubusercontent.com/hendrikbgr/Free-Proxy-Repo/master/proxy_list.txt',
	'https://raw.githubusercontent.com/almroot/proxylist/master/list.txt',
	'https://www.proxy-list.download/api/v1/get?type=http',
	'https://www.proxyscan.io/download?type=http',
	'https://raw.githubusercontent.com/rdavydov/proxy-list/main/proxies/http.txt',
	'https://raw.githubusercontent.com/UptimerBot/proxy-list/main/proxies/http.txt',
	'https://api.openproxylist.xyz/http.txt',
	'https://cyber-hub.pw/statics/proxy.txt',
	'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/https.txt',
	'https://raw.githubusercontent.com/RX4096/proxy-list/main/online/https.txt',
	'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-https.txt',
	'https://raw.githubusercontent.com/mmpx12/proxy-list/master/https.txt',
	'https://www.proxyscan.io/download?type=https',
	'https://raw.githubusercontent.com/aslisk/proxyhttps/main/https.txt',
	'https://raw.githubusercontent.com/VolkanSah/Auto-Proxy-Fetcher/refs/heads/main/proxies.txt',
	'https://raw.githubusercontent.com/monosans/proxy-list/refs/heads/main/proxies/http.txt',
	'https://raw.githubusercontent.com/proxifly/free-proxy-list/refs/heads/main/proxies/protocols/http/data.txt',
	'https://raw.githubusercontent.com/proxifly/free-proxy-list/refs/heads/main/proxies/protocols/https/data.txt',
	'https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/http.txt',
	'https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/https.txt',
	'https://vakhov.github.io/fresh-proxy-list/http.txt',
	'https://vakhov.github.io/fresh-proxy-list/https.txt',
	'https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/refs/heads/master/http.txt',
	'https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/refs/heads/master/https.txt',
	'https://raw.githubusercontent.com/yemixzy/proxy-list/refs/heads/main/proxies/http.txt',
	'https://raw.githubusercontent.com/Anonym0usWork1221/Free-Proxies/refs/heads/main/proxy_files/http_proxies.txt',
	'https://raw.githubusercontent.com/Anonym0usWork1221/Free-Proxies/refs/heads/main/proxy_files/https_proxies.txt',
	'https://raw.githubusercontent.com/mmpx12/proxy-list/refs/heads/master/http.txt',
	'https://raw.githubusercontent.com/mmpx12/proxy-list/refs/heads/master/https.txt',
	'https://raw.githubusercontent.com/ProxyScraper/ProxyScraper/refs/heads/main/http.txt',
	'https://api.proxyscrape.com/v2/?request=displayproxies',
	'https://raw.githubusercontent.com/yuceltoluyag/GoodProxy/main/raw.txt',
	'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies.txt',
	'https://raw.githubusercontent.com/hookzof/socks5_list/master/proxy.txt',
	'https://raw.githubusercontent.com/opsxcq/proxy-list/master/list.txt',
	'https://proxyspace.pro/http.txt',
	'https://api.proxyscrape.com/?request=displayproxies&proxytype=http',
	'http://worm.rip/http.txt',
	'http://alexa.lr2b.com/proxylist.txt',
	'http://rootjazz.com/proxies/proxies.txt',
	'https://multiproxy.org/txt/all/proxy.txt',
	'https://proxy-spider.com/api/proxies.example.txt',
	'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all',
	'https://www.proxydocker.com/en/proxylist/download?email=noshare&country=all&city=all&port=all&type=all&anonymity=all&state=all&need=all',
	'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=anonymous',
	'https://raw.githubusercontent.com/lhuwux/gado2/refs/heads/main/http.txt',
	'https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/xResults/RAW.txt',
	'https://raw.githubusercontent.com/mmpx12/proxy-list/refs/heads/master/https.txt',
	'https://raw.githubusercontent.com/mmpx12/proxy-list/refs/heads/master/proxies.txt'
];

const downloadAndSaveProxies = async (url, outputFile) => {
    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            let dataArray = response.data.split('\n');
            for (let d of dataArray){
                fs.appendFileSync(outputFile, 
                    d.replace('http://', '')
                    .replace('https://', '')
                    .replace('socks4://','')
                    .replace(' ','')
                    .replace('error','')
                    .replace('code','')
                    .replace('socks5://','')
                + '\n', 'utf8');
            }

            console.log(`Success Gets In ${url}`);
        } else {
            console.log(`Failed In ${url}`);
        }
    } catch (error) {
        console.error(`Something Broken in ${url}`);
    }
};

(async () => {
    for (let url of proxyUrls) {
        await downloadAndSaveProxies(url, outputFile);
    }

    const fileContent = fs.readFileSync(outputFile, 'utf8');
    const lines = fileContent.split('\n');
    const uniqueProxies = [...new Set(lines)].join('\n');
    
    fs.writeFileSync(outputFile, uniqueProxies);
    console.log('Successfully cleaned and saved proxies.');
})();
