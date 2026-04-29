export interface Command {
  id: string;
  tool: string;
  cmdTemplate: string;
  isCustom?: boolean;
  wordlists?: { name: string; link: string; replaceTarget?: string }[];
}

export interface CommandCategory {
  id: string;
  title: string;
  iconName: string;
  description: {
    en: string;
    ar: string;
  };
  commands: Command[];
}

const COMMON_WORDLISTS = {
  jhaddixDns: { name: 'Jhaddix DNS', link: '/usr/share/wordlists/seclists/Discovery/DNS/dns-Jhaddix.txt', replaceTarget: 'wordlist.txt' },
  seclistsTop1M: { name: 'SecLists Top 110k', link: '/usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-110000.txt', replaceTarget: 'wordlist.txt' },
  assetnoteDns: { name: 'Assetnote Best DNS', link: 'https://wordlists-cdn.assetnote.io/data/manual/best-dns-wordlist.txt', replaceTarget: 'wordlist.txt' },
  n0kovoSubdomains: { name: 'n0kovo Subs', link: 'https://raw.githubusercontent.com/n0kovo/n0kovo_subdomains/main/n0kovo_subdomains_huge.txt', replaceTarget: 'wordlist.txt' },
  trickestResolvers: { name: 'Trickest Resolvers', link: 'https://raw.githubusercontent.com/trickest/resolvers/main/resolvers.txt', replaceTarget: 'resolvers.txt' },
  raftLargeDir: { name: 'Raft Large Dir', link: '/usr/share/wordlists/seclists/Discovery/Web-Content/raft-large-directories.txt', replaceTarget: 'wordlist.txt' },
  dirList23Med: { name: 'Dir List 2.3 Med', link: '/usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt', replaceTarget: 'wordlist.txt' },
  oneListForAll: { name: 'OneListForAll Micro', link: 'https://raw.githubusercontent.com/six2dez/OneListForAll/main/onelistforallmicro.txt', replaceTarget: 'wordlist.txt' },
  bo0omFuzz: { name: 'Bo0oM Fuzz', link: 'https://raw.githubusercontent.com/Bo0oM/fuzz.txt/master/fuzz.txt', replaceTarget: 'wordlist.txt' },
  burpParams: { name: 'Burp Parameters', link: '/usr/share/wordlists/seclists/Discovery/Web-Content/burp-parameter-names.txt', replaceTarget: 'wordlist.txt' },
  assetnoteParams: { name: 'Assetnote Params', link: 'https://wordlists-cdn.assetnote.io/data/automated/httparchive_parameters_top_1m_2020_11_21.txt', replaceTarget: 'wordlist.txt' },
  arjunParams: { name: 'Arjun Default', link: 'https://raw.githubusercontent.com/s0md3v/Arjun/master/arjun/db/default.txt', replaceTarget: 'wordlist.txt' },
  bypass403: { name: '403 Bypass', link: 'https://raw.githubusercontent.com/Karanxa/Bug-Bounty-Wordlists/main/403_header_payloads.txt', replaceTarget: '403-headers.txt' },
  assetnoteApi: { name: 'Assetnote API Routes', link: 'https://wordlists-cdn.assetnote.io/data/automated/httparchive_apiroutes_2020_11_20.txt', replaceTarget: 'wordlist.txt' }
};

export const defaultCommandsData: CommandCategory[] = [
  {
    id: 'passive',
    title: 'Passive Subdomain Enumeration',
    iconName: 'Globe2',
    description: {
      en: 'Discover subdomains passively using various external sources without touching the target. This gathers historical and cached data.',
      ar: 'اكتشاف النطاقات الفرعية بشكل سلبي باستخدام مصادر خارجية مختلفة دون المساس بالهدف. يقوم هذا بجمع البيانات التاريخية والمخبأة.'
    },
    commands: [
      { id: 'subfinder-1', tool: 'Subfinder', cmdTemplate: `subfinder -d {target} -all -silent -o subs_subfinder.txt` },
      { id: 'assetfinder', tool: 'Assetfinder', cmdTemplate: `echo {target} | assetfinder -subs-only | tee -a subs_assetfinder.txt` },
      { id: 'amass-passive', tool: 'Amass (Passive)', cmdTemplate: `amass enum -passive -d {target} -o subs_amass.txt` },
      { id: 'findomain', tool: 'Findomain', cmdTemplate: `findomain -t {target} -q -u subs_findomain.txt` },
      { id: 'chaos', tool: 'Chaos', cmdTemplate: `chaos -d {target} -silent -o subs_chaos.txt` },
      { id: 'github-sub', tool: 'GitHub-Subdomains', cmdTemplate: `github-subdomains -d {target} -t $GITHUB_TOKEN -o subs_github.txt` },
      { id: 'crt-sh', tool: 'crt.sh (Curl)', cmdTemplate: `curl -s "https://crt.sh/?q=%25.{target}&output=json" | jq -r '.[].name_value' | sed 's/\\*\\.//g' | sort -u > subs_crtsh.txt` },
      { id: 'bbot-passive', tool: 'BBOT (Passive)', cmdTemplate: `bbot -t {target} -f subdomain-enum -p passive` },
    ],
  },
  {
      id: 'active',
      title: 'Active Enum & Bruteforce',
      iconName: 'Target',
      description: {
          en: 'Actively resolve and brute-force subdomains to find hidden assets that are not publicly indexed.',
          ar: 'استخراج النطاقات الفرعية النشطة وهجوم القوة العمياء للعثور على الأصول المخفية غير المؤرشفة علناً.'
      },
      commands: [
          { 
            id: 'puredns', 
            tool: 'PureDNS', 
            cmdTemplate: `puredns bruteforce wordlist.txt {target} -r resolvers.txt --write subs_puredns_brute.txt`,
            wordlists: [COMMON_WORDLISTS.jhaddixDns, COMMON_WORDLISTS.assetnoteDns, COMMON_WORDLISTS.trickestResolvers]
          },
          { 
            id: 'dnsx-brute', 
            tool: 'dnsx (Brute)', 
            cmdTemplate: `dnsx -silent -d {target} -w wordlist.txt -o subs_dnsx_brute.txt`,
            wordlists: [COMMON_WORDLISTS.seclistsTop1M, COMMON_WORDLISTS.n0kovoSubdomains]
          },
          { 
            id: 'amass-active', 
            tool: 'Amass (Active)', 
            cmdTemplate: `amass enum -active -brute -w wordlist.txt -d {target} -o subs_amass_active.txt`,
            wordlists: [COMMON_WORDLISTS.seclistsTop1M, COMMON_WORDLISTS.jhaddixDns]
          },
          { 
            id: 'ffuf-sub', 
            tool: 'ffuf (Subdomains)', 
            cmdTemplate: `ffuf -u https://FUZZ.{target} -w wordlist.txt -mc 200,301,302,401,403 -o ffuf_subs.json`,
            wordlists: [COMMON_WORDLISTS.seclistsTop1M, COMMON_WORDLISTS.n0kovoSubdomains]
          },
          { 
            id: 'ffuf-vhost', 
            tool: 'ffuf (VHost)', 
            cmdTemplate: `ffuf -u https://{target} -w wordlist.txt -H "Host: FUZZ.{target}" -mc 200,301,302,401,403 -o ffuf_vhosts.json`,
            wordlists: [COMMON_WORDLISTS.seclistsTop1M, COMMON_WORDLISTS.n0kovoSubdomains] 
          },
      ],
  },
  {
      id: 'infrastructure',
      title: 'Infrastructure & IP Space',
      iconName: 'Server',
      description: {
          en: 'Discover ASNs, reverse DNS info, cloud assets, and map the target\'s infrastructure.',
          ar: 'اكتشاف ASNs ومعلومات DNS العكسية والأصول السحابية، ورسم خريطة للبنية التحتية للهدف.'
      },
      commands: [
          { id: 'asnmap', tool: 'ASNMap', cmdTemplate: `asnmap -d {target} -silent | tee target_asns.txt` },
          { id: 'amass-intel', tool: 'Amass (Intel)', cmdTemplate: `amass intel -asn 12345,67890` },
          { id: 'dnsx-ptr', tool: 'dnsx (PTR)', cmdTemplate: `echo "192.168.1.0/24" | dnsx -silent -resp-only -ptr` },
          { id: 'hakrevdns', tool: 'hakrevdns', cmdTemplate: `hakrevdns -d {target} -R resolvers.txt | tee hakrevdns_out.txt`, wordlists: [COMMON_WORDLISTS.trickestResolvers] },
          { id: 'cloud_enum', tool: 'Cloud Enum', cmdTemplate: `cloud_enum -k {target} -l target_logs.txt` },
          { id: 'bgp-he', tool: 'BGP.he.net (grep)', cmdTemplate: `curl -s "https://bgp.he.net/search?search%5Bsearch%5D={target}&commit=Search" | grep -o 'AS[0-9]\\+'` },
      ],
  },
  {
      id: 'merge-resolve',
      title: 'Merge, Resolve & Alive Detection',
      iconName: 'Activity',
      description: {
          en: 'Compile raw lists, resolve to active IPs, and filter for live web servers. Crucial for reducing noise.',
          ar: 'تجميع القوائم، وفحص الآيبيات النشطة، والفلترة لاستخراج خوادم الويب الحية. خطوة مهمة لتقليل الضوضاء.'
      },
      commands: [
          { id: 'anew-merge', tool: 'Anew (Merge)', cmdTemplate: `cat subs_*.txt | anew all_subs.txt` },
          { id: 'puredns-resolve', tool: 'PureDNS (Resolve)', cmdTemplate: `puredns resolve all_subs.txt -r resolvers.txt -w resolved_subs.txt`, wordlists: [COMMON_WORDLISTS.trickestResolvers] },
          { id: 'dnsx-resolve', tool: 'dnsx (Resolve)', cmdTemplate: `cat all_subs.txt | dnsx -silent -a -resp | anew resolved_ips.txt` },
          { id: 'httpx-basic', tool: 'httpx (Alive)', cmdTemplate: `cat resolved_subs.txt | httpx -silent -threads 100 -o alive_web.txt` },
          { id: 'httpx-full', tool: 'httpx (Detailed)', cmdTemplate: `cat resolved_subs.txt | httpx -silent -status-code -tech-detect -title -content-length -follow-redirects -o httpx_info.txt` },
          { id: 'naabu-ports', tool: 'Naabu (Port Scan)', cmdTemplate: `naabu -list resolved_subs.txt -top-ports 100 -c 50 -nmap-cli 'nmap -sV -sC' -o naabu_ports.txt` },
      ],
  },
  {
      id: 'url-disc',
      title: 'URL Discovery & Crawling',
      iconName: 'Database',
      description: {
          en: 'Crawl open directories, archive services, and map the application surface area.',
          ar: 'زحف المجلدات المفتوحة وخدمات الأرشيف، واستخراج مساحة سطح التطبيق بالكامل.'
      },
      commands: [
          { id: 'waybackurls', tool: 'Waybackurls', cmdTemplate: `cat alive_web.txt | waybackurls | sort -u > wayback_urls.txt` },
          { id: 'gau', tool: 'GAU', cmdTemplate: `cat alive_web.txt | gau --threads 50 --providers wayback,otx,commoncrawl | sort -u > gau_urls.txt` },
          { id: 'waymore', tool: 'Waymore', cmdTemplate: `waymore -i {target} -mode U -oU waymore_urls.txt` },
          { id: 'katana', tool: 'Katana (Crawling)', cmdTemplate: `katana -list alive_web.txt -jc -kf all -d 3 -fs rdn -o katana_urls.txt` },
          { id: 'hakrawler', tool: 'Hakrawler', cmdTemplate: `cat alive_web.txt | hakrawler -depth 3 -plain > hakrawler_urls.txt` },
          { id: 'gospider', tool: 'GoSpider', cmdTemplate: `gospider -S alive_web.txt -o output -c 10 -d 1 --other-source` },
          { id: 'url-merge', tool: 'Anew (Merge URLs)', cmdTemplate: `cat *_urls.txt | anew all_urls.txt` },
      ],
  },
  {
      id: 'dir-fuzz',
      title: 'Directory & File Fuzzing',
      iconName: 'FolderSearch',
      description: {
          en: 'Bruteforce paths to find hidden admin panels, backups, old versions, and API endpoints.',
          ar: 'التخمين العنيف على المسارات للعثور على لوحات التحكم والنسخ الاحتياطية ونهايات الـ API.'
      },
      commands: [
          { 
            id: 'ffuf-dir', 
            tool: 'ffuf (Directories)', 
            cmdTemplate: `ffuf -u https://{target}/FUZZ -w wordlist.txt -mc 200,301,302,401,403 -e .php,.txt,.bak,.zip -o ffuf_dirs.txt`,
            wordlists: [COMMON_WORDLISTS.oneListForAll, COMMON_WORDLISTS.raftLargeDir]
          },
          { 
            id: 'dirsearch', 
            tool: 'Dirsearch', 
            cmdTemplate: `dirsearch -u https://{target} -e php,asp,aspx,jsp,html,zip,bak,tar.gz,sql,env -w wordlist.txt -t 50 -x 404,500 --format=plain -o dirsearch_out.txt`,
            wordlists: [COMMON_WORDLISTS.oneListForAll, COMMON_WORDLISTS.raftLargeDir]
          },
          { 
            id: 'feroxbuster', 
            tool: 'Feroxbuster', 
            cmdTemplate: `feroxbuster -u https://{target} -w wordlist.txt -t 100 -d 2 -x php,bak,zip --filter-status 404,500 -o ferox_out.txt`,
            wordlists: [COMMON_WORDLISTS.oneListForAll, COMMON_WORDLISTS.dirList23Med]
          },
          { 
            id: 'gobuster-dir', 
            tool: 'Gobuster (Dir)', 
            cmdTemplate: `gobuster dir -u https://{target} -w wordlist.txt -t 50 -x php,txt,html -b 404,500 -o gobuster_out.txt`,
            wordlists: [COMMON_WORDLISTS.oneListForAll, COMMON_WORDLISTS.raftLargeDir]
          },
          { 
            id: 'kiterunner', 
            tool: 'Kiterunner (APIs)', 
            cmdTemplate: `kr scan https://api.{target} -w wordlist.txt -A=apiroutes-210228 -x 10 -o kiterunner_out.txt`,
            wordlists: [COMMON_WORDLISTS.assetnoteApi]
          },
      ],
  },
  {
      id: 'param-discovery',
      title: 'Parameter Discovery',
      iconName: 'Braces',
      description: {
          en: 'Discover hidden GET/POST parameters which are often vulnerable to logic flaws or injections.',
          ar: 'اكتشاف المتغيرات (Parameters) لطلبات GET/POST والتي غالباً ما تكون مصابة بثغرات منطقية أو حقن.'
      },
      commands: [
          { 
            id: 'arjun', 
            tool: 'Arjun', 
            cmdTemplate: `arjun -u https://{target}/endpoint -m GET -w wordlist.txt -oT arjun_out.txt`,
            wordlists: [COMMON_WORDLISTS.arjunParams, COMMON_WORDLISTS.burpParams]
          },
          { 
            id: 'ffuf-param', 
            tool: 'ffuf (Parameters)', 
            cmdTemplate: `ffuf -u "https://{target}/endpoint?FUZZ=1" -w wordlist.txt -mc 200 -fs 1337 -o ffuf_params.txt`,
            wordlists: [COMMON_WORDLISTS.assetnoteParams, COMMON_WORDLISTS.burpParams]
          },
          { 
            id: 'x8', 
            tool: 'x8 (Rust)', 
            cmdTemplate: `x8 -u "https://{target}/endpoint" -w wordlist.txt -O x8_out.txt`,
            wordlists: [COMMON_WORDLISTS.burpParams, COMMON_WORDLISTS.arjunParams]
          },
          { id: 'gf-params', tool: 'GF (Grep Patterns)', cmdTemplate: `cat all_urls.txt | gf xss | anew xss_candidates.txt` },
      ],
  },
  {
      id: 'js-secrets',
      title: 'JavaScript & Secrets',
      iconName: 'FileCode2',
      description: {
          en: 'Analyze Javascript files for hardcoded secrets, API keys, hidden endpoints, and subdomains.',
          ar: 'تحليل ملفات الجافاسكربت بحثاً عن كلمات المرور، ومفاتيح API، والنهايات المخفية.'
      },
      commands: [
          { id: 'grep-js', tool: 'Grep JS', cmdTemplate: `cat all_urls.txt | grep -iE '\\.js$' | anew js_files.txt` },
          { id: 'subjs', tool: 'subjs', cmdTemplate: `cat all_urls.txt | subjs | anew js_files.txt` },
          { id: 'secretfinder', tool: 'SecretFinder', cmdTemplate: `python3 SecretFinder.py -i https://{target}/app.js -e -o cli` },
          { id: 'trufflehog', tool: 'TruffleHog', cmdTemplate: `trufflehog filesystem --no-verification js_files.txt` },
          { id: 'mantra', tool: 'Mantra', cmdTemplate: `cat js_files.txt | mantra` },
          { id: 'jsluice', tool: 'jsluice', cmdTemplate: `cat js_files.txt | xargs -I % sh -c 'curl -s "%" | jsluice urls'` },
      ],
  },
  {
      id: 'vuln-scan',
      title: 'Automated Vuln Scanning',
      iconName: 'Bug',
      description: {
          en: 'Run template-based scanners to find low-hanging fruit, misconfigurations, and known CVEs.',
          ar: 'تشغيل أجهزة الفحص الآلي للعثور على الأخطاء الشائعة وثغرات القوالب المعرفة (CVEs).'
      },
      commands: [
          { id: 'nuclei-full', tool: 'Nuclei (Full)', cmdTemplate: `nuclei -l alive_web.txt -t cves,exposures,vulnerabilities,misconfiguration -o nuclei_full.txt` },
          { id: 'nuclei-cves', tool: 'Nuclei (CVEs)', cmdTemplate: `nuclei -l alive_web.txt -tags cve -o nuclei_cves.txt` },
          { id: 'nuclei-tech', tool: 'Nuclei (Tech-based)', cmdTemplate: `nuclei -l alive_web.txt -as -o nuclei_tech.txt` },
          { id: 'jaeles', tool: 'Jaeles', cmdTemplate: `jaeles scan -s /jaeles-signatures/ -U alive_web.txt -O jaeles_out` },
          { id: 'dalfox', tool: 'Dalfox (XSS)', cmdTemplate: `cat xss_candidates.txt | dalfox pipe -o dalfox_xss.txt` },
          { id: 'sqlmap-batch', tool: 'SQLMap', cmdTemplate: `sqlmap -m sqli_candidates.txt --batch --random-agent --level 1 --risk 1` },
      ],
  }
];
