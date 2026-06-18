export interface WriteupInfo {
  id: string;
  title: string;
  titleAr?: string;
  vulnerabilities: string[];
  vulnerabilitiesAr?: string[];
  tools: string[];
  methodology: string[];
  methodologyAr?: string[];
  keyTakeaways: string[];
  keyTakeawaysAr?: string[];
  dateAdded: number;
}

export const defaultWriteups: WriteupInfo[] = [
  {
    id: '1',
    title: 'Chaining BAC, Stored XSS & CSRF to Takeover Any Organization',
    titleAr: 'دمج ثغرات BAC و Stored XSS و CSRF لاختراق أي منظمة',
    vulnerabilities: ['Broken Access Control (BAC)', 'Stored XSS', 'CSRF Bypass'],
    vulnerabilitiesAr: ['تخطي صلاحيات الوصول (BAC)', 'Stored XSS', 'تخطي حماية CSRF'],
    tools: ['Burp Suite'],
    methodology: [
      'Discovered Broken Access Control (BAC) in the Page Groups feature by incrementing sequential User IDs to add users from other organizations.',
      'Found a Stored XSS vulnerability in the page editor functionality via the "placeholderText" parameter.',
      'Noticed the "xsrftoken" was accessible to JavaScript (no HttpOnly flag), unlike the session cookie.',
      'Combined the vulnerabilities: used the BAC to add random users to a Page Group containing the Stored XSS payload.',
      'Crafted an XSS payload to steal the xsrftoken, fetch the victim\'s "organisationId" from "/api/apps/user", and send a POST request to "/api/app/organisations/{org_id}/invites" to invite the attacker as Admin.',
      'Automated the attack by adding thousands of sequential User IDs to the poisoned Page Group, resulting in a mass organization takeover.'
    ],
    methodologyAr: [
      'اكتشاف ثغرة تخطي صلاحيات الوصول (BAC) في ميزة مجموعات الصفحات عن طريق زيادة معرفات المستخدمين (User IDs) المتسلسلة لإضافة مستخدمين من منظمات أخرى.',
      'العثور على ثغرة Stored XSS في وظيفة محرر الصفحة عن طريق معامل "placeholderText".',
      'ملاحظة أن "xsrftoken" كان متاحاً للوصول عبر الجافا سكريبت (بدون علامة HttpOnly)، على عكس ملف تعريف ارتباط الجلسة (Session Cookie).',
      'دمج الثغرات: استخدام BAC لإضافة مستخدمين عشوائيين إلى مجموعة صفحات تحتوي على بايلود Stored XSS.',
      'تصميم بايلود XSS لسرقة xsrftoken، وجلب "organisationId" الخاص بالضحية من "/api/apps/user"، وإرسال طلب POST إلى "/api/app/organisations/{org_id}/invites" لدعوة المهاجم كمسؤول (Admin).',
      'أتمتة الهجوم عن طريق إضافة آلاف معرفات المستخدمين المتسلسلة إلى مجموعة الصفحات الملغمة، مما أدى إلى اختراق المنظمات بشكل جماعي.'
    ],
    keyTakeaways: [
      'Chaining multiple low/medium vulnerabilities (BAC + XSS + CSRF) can escalate impact to full Organization Takeover.',
      'Sequential IDs are highly vulnerable to IDOR/BAC attacks and should be thoroughly tested for authorization checks.',
      'If a CSRF token is accessible via JavaScript (missing HttpOnly), a Stored XSS can easily bypass CSRF protections to perform privileged actions.',
      'Always look for ways to expand the attack surface, e.g., finding an endpoint to leak the Org ID to make the exploit dynamic.'
    ],
    keyTakeawaysAr: [
      'يمكن لدمج ثغرات متعددة منخفضة/متوسطة الخطورة (BAC + XSS + CSRF) أن يرفع مستوى التأثير إلى اختراق المنظمة بالكامل.',
      'تعتبر المعرفات المتسلسلة (Sequential IDs) عرضة بشكل كبير لهجمات IDOR/BAC ويجب اختبارها بدقة للتأكد من فحوصات التفويض.',
      'إذا كان يمكن الوصول إلى رمز CSRF عبر الجافا سكريبت (عدم وجود HttpOnly)، فيمكن لـ Stored XSS أن يتخطى حمايات CSRF بسهولة لتنفيذ إجراءات بصلاحيات أعلى.',
      'ابحث دائماً عن طرق لتوسيع سطح الهجوم، على سبيل المثال، إيجاد نقطة نهاية (Endpoint) لتسريب معرف المنظمة (Org ID) لجعل الاستغلال ديناميكياً.'
    ],
    dateAdded: Date.now()
  },
  {
    id: '2',
    title: 'Deanonymization & IP Logging via Blind SSRF in Chat File Upload',
    titleAr: 'كشف هوية المستخدمين وتسجيل عناوين IP عبر ثغرة Blind SSRF في رفع ملفات الدردشة',
    vulnerabilities: ['Blind SSRF', 'Information Disclosure', 'Deanonymization'],
    vulnerabilitiesAr: ['ثغرة Blind SSRF', 'تسريب المعلومات (Information Disclosure)', 'كشف هوية المستخدمين'],
    tools: ['Burp Suite', 'IP Logger'],
    methodology: [
      'Tested the file upload feature in the team chat functionality.',
      'Noticed the upload request contained a parameter called "file_url" pointing to the uploaded image\'s location.',
      'Intercepted the request and changed the "file_url" parameter to an external domain (IP-Logger).',
      'Forwarded the modified request. The chat UI displayed an error for the image.',
      'Switched to a victim\'s account and opened the team chat containing the modified image.',
      'Checked the IP-Logger and confirmed that the victim\'s IP address, OS version, city, and User-Agent were logged without any user interaction.'
    ],
    methodologyAr: [
      'اختبار ميزة رفع الملفات في وظيفة دردشة الفريق.',
      'ملاحظة أن طلب الرفع يحتوي على مسار (Parameter) يسمى "file_url" يشير إلى موقع الصورة المرفوعة.',
      'اعتراض الطلب وتغيير قيمة "file_url" إلى نطاق خارجي (رابط IP-Logger).',
      'تمرير الطلب المعدل. أظهرت واجهة الدردشة خطأ بحجة عدم التمكن من تحميل الصورة.',
      'التبديل إلى حساب الضحية وفتح الدردشة التي تحتوي على الصورة الملغمة.',
      'التحقق من IP-Logger وتأكيد تسجيل عنوان IP الخاص بالضحية وإصدار نظام التشغيل والمدينة ونوع المتصفح بدون أي تدخل من المستخدم (Zero-click).'
    ],
    keyTakeaways: [
      'Always test file upload endpoints for parameters that accept URLs, as they may lead to SSRF or Information Disclosure.',
      'Client-side rendering of attacker-controlled URLs can lead to zero-click deanonymization of other users viewing the content.',
      'Information disclosure such as IP address and User-Agent can be critical for privacy, especially in enterprise team workspaces.'
    ],
    keyTakeawaysAr: [
      'اختبر دائمًا مسارات رفع الملفات بحثًا عن مدخلات تقبل روابط (URLs)، حيث يمكن أن تؤدي إلى SSRF أو تسريب معلومات.',
      'يمكن أن يؤدي تقديم وعرض المواقع للروابط التي يتحكم فيها المهاجم إلى كشف هوية المستخدمين الآخرين الذين يشاهدون المحتوى دون أي تفاعل.',
      'تسريب المعلومات مثل عنوان IP وتفاصيل المتصفح يمكن أن يشكل خطراً كبيراً على الخصوصية، خاصة في بيئات عمل الشركات.'
    ],
    dateAdded: Date.now()
  },
  {
    id: '3',
    title: 'Bypassing WAF to Exploit Blind SQL Injection via Cookie',
    titleAr: 'تخطي الجدار الناري (WAF) لاستغلال ثغرة Blind SQL Injection عبر الكوكيز',
    vulnerabilities: ['Boolean-based Blind SQL Injection', 'WAF Bypass'],
    vulnerabilitiesAr: ['حقن SQL من نوع Boolean-based Blind', 'تخطي حماية الجدار الناري (WAF)'],
    tools: ['Burp Suite', 'sqlmap', 'ParamMiner'],
    methodology: [
      'Detected potential SQL injection in the "idEntity" parameter using Burp Scanner.',
      'Attempted to exploit with sqlmap, but it failed to detect the vulnerability initially.',
      'Manually investigated requests to verify the boolean-based SQL behavior (e.g., OR 1=1 bypassing access).',
      'Configured sqlmap with specific options (--technique=B, --not-string) and proxied traffic to Burp to analyze block reasons.',
      'Discovered that WAF was blocking standard exploitation attempts (e.g., SELECT or SLEEP statements) returning empty responses (Content-Length: 0).',
      'Used ParamMiner to discover a hidden parameter/cookie named "idEntitySelected".',
      'Confirmed that the WAF applied strict rules to GET parameters but was more relaxed with Cookie values, allowing SLEEP commands to execute successfully.',
      'Re-ran sqlmap configured to attack the "idEntitySelected" cookie, successfully bypassing the WAF and exploiting the DBMS.'
    ],
    methodologyAr: [
      'اكتشاف حقن SQL محتمل في مدخل "idEntity" باستخدام فاحص (Scanner) الخاص بـ Burp Suite.',
      'محاولة الاستغلال بواسطة sqlmap، لكن الأداة فشلت في تأكيد الثغرة في البداية.',
      'التحقيق يدويًا في الطلبات للتحقق من سلوك قواعد البيانات (مثل OR 1=1 الذي يتخطى الصلاحية).',
      'إعداد sqlmap بخيارات مخصصة مثل (--technique=B, --not-string) وتمرير الترافيك عبر Burp لتحليل سبب الحظر.',
      'اكتشاف أن الجدار الناري (WAF) كان يحظر محاولات الاستغلال (مثل أوامر SELECT و SLEEP) بردود فارغة (Content-Length: 0).',
      'استخدام إضافة ParamMiner في Burp لاكتشاف كوكيز/مدخل مخفي يسمى "idEntitySelected".',
      'التأكد من أن WAF يطبّق قواعد صارمة على مدخلات GET ولكنه أكثر تساهلًا مع قيم ملفات تعريف الارتباط (Cookies)، مما سمح بتنفيذ أوامر SLEEP بنجاح.',
      'إعادة تشغيل أداة sqlmap بعد ضبطها لمهاجمة قيمة الكوكيز "idEntitySelected"، وتخطي الجدار الناري واستغلال الثغرة بنجاح.'
    ],
    keyTakeaways: [
      'Do not give up when automated tools like sqlmap fail; always manually verify findings from your proxy scanners.',
      'A WAF might block common payloads in GET/POST parameters but may overlook other input vectors like Cookies or Headers.',
      'Burp Suite’s ParamMiner is an essential tool for unearthing hidden or alternative parameters that fall outside normal application workflows.',
      'Adapting scanning tools (e.g., adding proxy, tweaking string match, altering User-Agent) is crucial when dealing with WAF blocks.'
    ],
    keyTakeawaysAr: [
      'لا تستسلم عندما تفشل الأدوات التلقائية مثل sqlmap؛ قم دائمًا بالتحقق اليدوي من النتائج التي توفرها أدوات الفحص.',
      'قد يقوم WAF بحظر البايلود الشائع في مسارات GET/POST ولكنه قد يتساهل مع مدخلات أو أجزاء مسارات أخرى مثل ملفات تعريف الارتباط (Cookies) أو الـ Headers.',
      'تعد أداة ParamMiner (ضمن Burp Suite) ضرورية لاكتشاف المدخلات المخفية البديلة التي لا تظهر بوضوح في الطلبات العادية.',
      'تعديل أدوات الفحص مثل sqlmap لتمرير البيانات عبر Proxy، أو تغيير الـ User-Agent يعتبر أمراً حاسماً عند التعامل مع حظر الـ WAF.'
    ],
    dateAdded: Date.now()
  }
];
